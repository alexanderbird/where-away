#!/bin/bash

echo 1️⃣  test setup

echo ▸ Creating temp directory
where_away_path=$(pwd)
new_project=$(mktemp -d /tmp/where-away-test.XXXXXXXXX)
cd $new_project

echo ▸ Initializing npm and installing local where-away
npm init -y --no-package-lock > /dev/null
# Update package.json to mark the repo as private to reduce the irrelevant warnings
tmp=$(mktemp /tmp/XXXXXXXXX)
jq ". * { private: true }" < package.json > $tmp
mv $tmp package.json

npm install $where_away_path > /dev/null

echo 2️⃣  running the test

set -x
npx --no-install where-away
