#!/bin/bash

echo "🔨 Building shared packages..."
docker build -f shared/Dockerfile -t my-app-shared:latest .

if [ $? -eq 0 ]; then
    echo "✅ Shared packages built successfully"
    echo "🚀 Starting services..."
    DOCKER_BUILDKIT=1 docker-compose up --build
else
    echo "❌ Failed to build shared packages"
    exit 1
fi