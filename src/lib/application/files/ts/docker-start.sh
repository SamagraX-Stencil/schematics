#!/bin/bash

docker compose up -d

LOGGING_DIR="./services/logging"

if [ -d "$LOGGING_DIR" ]; then

  cd "$LOGGING_DIR"
  
  # copy env-example.txt to .env
  mv env-example.txt .env
  
  docker compose up -d

  cd ../..

fi

MONITOR_DIR="./services/monitor"

if [ -d "$MONITOR_DIR" ]; then
  cd "$MONITOR_DIR"
  
  docker compose up -d

  cd ../..

fi

TEMPORAL_DIR="./services/temporal"

if [ -d "$TEMPORAL_DIR" ]; then

  cd "$TEMPORAL_DIR"
  
  # copy env-example.txt to .env
  mv env-example.txt .env

  docker compose up -d

  cd ../..

fi
