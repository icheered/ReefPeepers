#!/bin/bash
npm install
npm run build
pm2 delete reefpeepers
PORT=4005 pm2 start npm --name "reefpeepers" -- start
