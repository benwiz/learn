#!/bin/bash

echo Installing dependencies
go install

echo Building project...
go build

echo Running project...
echo
./blockchain-in-go
