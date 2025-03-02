#!/bin/bash
# Script to install the correct protobuf version

# Activate the Python environment if needed
# Replace 'nextjs' with your environment name if different
# source ~/miniconda3/etc/profile.d/conda.sh
# conda activate nextjs

# Install or upgrade protobuf - note the quotes around the package spec
pip install "protobuf>=5.29.0"

echo "Protobuf has been upgraded to version 5.29.0 or higher" 