#!/bin/bash

echo "🚀 Setting up CareerHub monorepo..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build shared packages first
echo "🔨 Building shared packages..."
cd shared/types && npm install && npm run build
cd ../utils && npm install && npm run build
cd ../..

# Install all service dependencies
echo "📦 Installing micro-frontend dependencies..."
cd micro-frontends/shell && npm install
cd ../auth && npm install
cd ../..

echo "📦 Installing micro-service dependencies..."
cd micro-services/user-service && npm install
cd ../..

echo "✅ Setup complete! Run 'npm run dev' to start all services"