#!/usr/bin/env bash
# docker-run-deploy.sh

echo "Building deployment Docker image..."
docker build -t splitly-deploy -f Dockerfile.deploy .

echo "Running deployment in container..."
docker run --rm \
  -e DEPLOYER_SECRET_KEY \
  -e NETWORK="${NETWORK:-testnet}" \
  -v "$(pwd):/app" \
  splitly-deploy
