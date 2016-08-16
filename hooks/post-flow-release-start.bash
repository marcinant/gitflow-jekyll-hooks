#!/usr/bin/env bash

echo "Git post-flow-release-start hook."

VERSION=$1
ORIGIN=$2
BRANCH=$3
BASE=$4

# Implement your script here.

ROOTDIR=$(git rev-parse --show-toplevel)

SCRIPT_PATH="$0"; while [ -h "$SCRIPT_PATH" ]; do SCRIPT_PATH=$(readlink "$SCRIPT_PATH"); done
. "$(dirname $SCRIPT_PATH)/modules/functions.sh"

. "$HOOKS_DIR/modules/write-version.sh"
if [ $? -ne 0 ]; then
    exit 1
fi

# gulp task to build and optimize 

echo "post-flow-release-start - git dir: $ROOT_DIR"

# ensure jekyll is not running

pkill -9 -f jekyll &> /dev/null

# run server instance for uncss
jekyll server --detach

# run optimizations with node binaries
npm run prepublish

# kill server
pkill -9 -f jekyll &> /dev/null

npm version minor --no-git-tag-version

git add .
git commit -m 'build'

exit 0
