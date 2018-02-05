#!/bin/bash

cd "$(dirname "$0")"
/home/ubuntu/.nvm/versions/node/v8.9.2/bin/node -r dotenv/config src/index.js
