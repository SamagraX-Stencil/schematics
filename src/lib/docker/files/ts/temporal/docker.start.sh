#!/bin/sh

# Copy env-example to .env
cp env-example .env

# Start Docker Compose services
docker-compose -f docker-compose.yml up 
