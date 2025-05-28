#!/bin/bash

# This script compiles the ZoKrates program, and generates a proof.
# Ensure you have the JSON input file with the necessary parameters.
# Ensure you have ZoKrates installed and available in your PATH.
set -e

# Check if arguments are provided
if [ "$#" -ne 3 ]; then
    echo "[BASH] Usage: $0 <program_zok_path> <input_json_path> <output_folder>"
    exit 1
fi
PROGRAM_ZOK_PATH=$1
INPUT_JSON_PATH=$2
OUTPUT_FOLDER=$3

# Check if the input file exists
if [ ! -f "$INPUT_JSON_PATH" ]; then
    echo "[BASH] Input file not found: $INPUT_JSON_PATH"
    exit 1
fi
# Check if the ZoKrates program file exists
if [ ! -f "$PROGRAM_ZOK_PATH" ]; then
    echo "[BASH] ZoKrates program file not found: $PROGRAM_ZOK_PATH"
    exit 1
fi

# Check if the output folder exists, if not create it
if [ ! -d "$OUTPUT_FOLDER" ]; then
    mkdir -p "$OUTPUT_FOLDER"
fi

ZOKRATES_PATH=${ZOKRATES_PATH:-~/.zokrates/bin}
PATH=$PATH:$ZOKRATES_PATH
# Ensure ZoKrates is installed and available in PATH
if ! command -v zokrates &> /dev/null; then
    # echo "[BASH] ZoKrates could not be found. Please install it and ensure it's in your PATH."
    read -p "[BASH] ZoKrates is not installed. Do you want to install it now? (y/n): " choice
    if [[ "$choice" =~ ^[Yy]$ ]]; then
        echo "[BASH] Installing ZoKrates..."
        curl -LSfs get.zokrat.es | sh
        ZOKRATES_PATH=${ZOKRATES_PATH:-~/.zokrates/bin}
        PATH=$PATH:$ZOKRATES_PATH
    else
        exit 1
    fi
fi

# Copy the program and input JSON to the output folder
cp $PROGRAM_ZOK_PATH $OUTPUT_FOLDER
cp $INPUT_JSON_PATH $OUTPUT_FOLDER
cd $OUTPUT_FOLDER
PROGRAM_ZOK_PATH=$(basename "$PROGRAM_ZOK_PATH")
INPUT_JSON_PATH=$(basename "$INPUT_JSON_PATH")

# Compile the program
echo "[BASH] Compiling ZoKrates program..."
zokrates compile --verbose -i $PROGRAM_ZOK_PATH

# Setup the proving system
echo "[BASH] Setting up the proving system..."
zokrates setup --verbose

# Compute the witness
echo "[BASH] Computing the witness..."
zokrates compute-witness --abi --verbose --stdin < $INPUT_JSON_PATH 

# Generate the proof
echo "[BASH] Generating the proof..."
zokrates generate-proof --verbose