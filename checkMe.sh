#!/bin/bash

npm install

npm run tsc

if [ $? -eq 0 ]
then
  echo "TSC Passed!"
else
  echo "TSC FAILED"
fi


npm run lint

if [ $? -eq 0 ]
then
  echo "Linter passed!"
else
  echo "Linter Failed"
fi


SERVER_LOG=$(mktemp)
npm start &> $SERVER_LOG & pid=$!
sleep 10
ps -o pid | egrep -q "^\s*${pid}$" || (cat $SERVER_LOG && exit 1)
npm test || (cat $SERVER_LOG && exit 1)
sleep 1
kill -SIGINT %1
cat $SERVER_LOG

if [ $? -eq 0 ]
then
  echo ""
  echo "Tests passed - good to go!"
  echo ""
  echo "Push your branch, merge Master into your branch, and then push your branch to Git"
  echo ""
  exit 0
else
  echo "Tests failed"
  exit 1
fi