#!/bin/bash

# Compile
GOROOT=/usr/lib/go-1.23 PATH=/usr/lib/go-1.23/bin:$PATH make build-remarkable-paper-pro

# Upload
scp goMarkableStream root@remark:

# Run
ssh root@remark -t "./goMarkable.sh"

