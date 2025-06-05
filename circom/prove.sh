#!/bin/bash

# This script compiles the Circom program, and generates a proof.
# Ensure you have the JSON input file with the necessary parameters.
# Ensure you have Circom and SnarkJS installed and available in your PATH.
set -e

# Check if arguments are provided
if [ "$#" -ne 4 ]; then
    echo "[BASH] Usage: $0 <program_name>.circom <input_name>.json <input_folder> <output_folder>"
    exit 1
fi

CIRCOM_PROGRAM_NAME=$1
INPUT_JSON_NAME=$2
INPUT_FOLDER=$3
CIRCOM_PROGRAM_PATH=${INPUT_FOLDER}/${CIRCOM_PROGRAM_NAME}.circom 
INPUT_JSON_PATH=${INPUT_FOLDER}/${INPUT_JSON_NAME}.json
OUTPUT_FOLDER=$4

# Check if the input file exists
if [ ! -f "$INPUT_JSON_PATH" ]; then
    echo "[BASH] Input file not found: $INPUT_JSON_PATH"
    exit 1
fi
# Check if the Circom program file exists
if [ ! -f "$CIRCOM_PROGRAM_PATH" ]; then
    echo "[BASH] Circom program file not found: $CIRCOM_PROGRAM_PATH"
    exit 1
fi

# Check if the output folder exists, if not create it
if [ ! -d "$OUTPUT_FOLDER" ]; then
    mkdir -p "$OUTPUT_FOLDER"
fi

if ! command -v circom &> /dev/null; then
    echo "[BASH] Circom could not be found. Please install it and ensure it's in your PATH."
    exit 1
fi
if ! command -v snarkjs &> /dev/null; then
    echo "[BASH] SnarkJS could not be found. Please install it and ensure it's in your PATH."
    exit 1
fi

# Copy the program and input JSON to the output folder
cp $CIRCOM_PROGRAM_PATH $OUTPUT_FOLDER
cp $INPUT_JSON_PATH $OUTPUT_FOLDER
cd $OUTPUT_FOLDER
CIRCOM_PROGRAM_PATH=$(basename "$CIRCOM_PROGRAM_PATH")
INPUT_JSON_PATH=$(basename "$INPUT_JSON_PATH")

# Compile the program
echo "[BASH] Compiling Circom program..."
if [ ! -d "circuit" ]; then
    mkdir -p "circuit"
fi
cd circuit
circom ../$CIRCOM_PROGRAM_PATH --r1cs --wasm --sym

# Compute the witness
echo "[BASH] Computing the witness..."
snarkjs calculateWitness --wasm ${CIRCOM_PROGRAM_NAME}_js/${CIRCOM_PROGRAM_NAME}.wasm --input ../${INPUT_JSON_PATH} --witness ${CIRCOM_PROGRAM_NAME}.wtns   
cd ..   

# Setup the proving system
echo "[BASH] Phase 1: Setting up the proving system..."
if [ ! -d "setup" ]; then
    mkdir -p "setup"
fi
cd setup
snarkjs powersoftau new bn128 12 pot12_0000.ptau
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" <<< 123

echo "[BASH] Phase 2: Setting up the proving system..."
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau 
snarkjs groth16 setup ../circuit/${CIRCOM_PROGRAM_NAME}.r1cs pot12_final.ptau ${CIRCOM_PROGRAM_NAME}_0000.zkey
snarkjs zkey contribute ${CIRCOM_PROGRAM_NAME}_0000.zkey ${CIRCOM_PROGRAM_NAME}_0001.zkey --name="1st Contributor Name" <<< 123
snarkjs zkey export verificationkey ${CIRCOM_PROGRAM_NAME}_0001.zkey verification_key.json 
cd ..

# Generate the proof
echo "[BASH] Generating the proof..."
if [ ! -d "proof" ]; then
    mkdir -p "proof"
fi
snarkjs groth16 prove setup/${CIRCOM_PROGRAM_NAME}_0001.zkey circuit/${CIRCOM_PROGRAM_NAME}.wtns proof/proof.json proof/public.json

echo "[BASH] Proof exported ${OUTPUT_FOLDER}/proof/proof.json"
echo "[BASH] Public parameters exported ${OUTPUT_FOLDER}/proof/public.json"
