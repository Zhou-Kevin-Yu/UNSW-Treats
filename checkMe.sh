#!/bin/bash

npm install

npm run tsc

if [ $? -eq 0 ]
then
  echo "TSC Passed!"
else
  echo "TSC FAILED"
  exit 1
fi


npm run lint

if [ $? -eq 0 ]
then
  echo "Linter passed!"
else
  echo "Linter Failed"
  exit 1
fi


SERVER_LOG=$(mktemp)
npm run ts-node-coverage &> $SERVER_LOG & pid=$!
sleep 10
ps -o pid | egrep -q "^\s*${pid}$" || (cat $SERVER_LOG && exit 1)
npm run test src/**/*.ts 

if [ $? -eq 0 ]
then
  echo "JEST Passed!"
else
  echo "Jest Failed"
  sleep 1
  kill -SIGINT %1
  cat $SERVER_LOG
  echo "Jest Failed :("
  exit 1
fi

sleep 1
kill -SIGINT %1
cat $SERVER_LOG

if [ $? -eq 0 ]
then
  echo ""
  echo "Tests passed - good to go!"
  echo ""
  echo "Push your branch, checkout master, pull master, checkout your branch"
  echo ""
  echo "merge Master into your branch, and then push your branch to Git"
  echo ""
  echo "Then create a merge request with this screenshot as the description"
  exit 0
else
  echo "Tests failed"
  exit 1
fi