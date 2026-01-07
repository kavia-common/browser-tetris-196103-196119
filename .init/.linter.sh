#!/bin/bash
cd /home/kavia/workspace/code-generation/browser-tetris-196103-196119/tetris_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

