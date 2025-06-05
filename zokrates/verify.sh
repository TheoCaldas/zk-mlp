#!/bin/bash

# This verifies the proof of the program.
# Ensure you have ZoKrates installed and available in your PATH.
set -e

if [ "$#" -ne 1 ]; then
    echo "[BASH] Usage: $0 <output_folder>"
    exit 1
fi

OUTPUT_FOLDER=$1

# Check if the output folder exists
if [ ! -d "$OUTPUT_FOLDER" ]; then
    echo "[BASH] Output folder not found: $OUTPUT_FOLDER"
    exit 1
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


cd $OUTPUT_FOLDER

# Verify the proof
echo "[BASH] Verifying the proof..."
zokrates verify --verbose