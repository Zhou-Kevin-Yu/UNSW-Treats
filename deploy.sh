#!/usr/bin/env bash

WORKING_DIRECTORY="~/www/cs1531deployass"

USERNAME="z5359859"
SSH_HOST="ssh-z5359859.alwaysdata.net"

scp -r ./package.json ./package-lock.json ./tsconfig.json ./src "$USERNAME@$SSH_HOST:$WORKING_DIRECTORY"
ssh "$USERNAME@$SSH_HOST" "cd $WORKING_DIRECTORY && npm install --only=production"