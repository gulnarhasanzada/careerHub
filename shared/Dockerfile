FROM node:24-alpine

WORKDIR /app

# Build shared types
COPY shared/types ./types
WORKDIR /app/types
RUN npm install && npm run build

# Build shared utils  
WORKDIR /app
COPY shared/utils ./utils
WORKDIR /app/utils
RUN npm install && npm run build

# Keep the built packages accessible
WORKDIR /app