#!/bin/bash

# Install csvjson first
# brew install csvkit

# Set the URL of the GitHub repository and the CSV file
REPO_NAME="awesome-chatgpt-prompts"
REPO_URL="https://github.com/f/$REPO_NAME.git"
CSV_FILE="$REPO_NAME/prompts.csv"
JSON_FILE="app/src/data/prompts.json"

# Fetch the repository
git clone $REPO_URL

# Parse the CSV file and convert to JSON
csvjson $CSV_FILE > $JSON_FILE

# Clean up by removing the cloned repository
rm -rf $REPO_NAME
