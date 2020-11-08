#!/bin/bash

# The output of this script will be stored in an environment variable for jest to use. 
# All status updates should be sent to stderr so they're not also included in the standard output.
log() {
  >&2 echo "$@"
}

[[ "$RESULT_FILE" == "" ]] && {
  log "Configuration error: RESULT_FILE environvent variable is empty"
  exit 2
}

log ① Creating a test sandbox

log " ▸ Creating temp directory"
where_away_path=$(pwd)
sandbox=$(mktemp -d /tmp/where-away-test.XXXXXXXXX)
cd $sandbox
log "    ↳ $sandbox"

# output to stdout so the Jest test can use it
echo $sandbox

log " ▸ Initializing npm and installing local where-away"
npm init -y --no-package-lock > /dev/null
# Update package.json to mark the repo as private to reduce the irrelevant warnings
tmp=$(mktemp /tmp/XXXXXXXXX)
jq ". * { private: true }" < package.json > $tmp
mv $tmp package.json 1>&2

npm install $where_away_path > /dev/null

log ②   executing where-away to generate an HTML file
set -x
npx --no-install where-away > $RESULT_FILE
