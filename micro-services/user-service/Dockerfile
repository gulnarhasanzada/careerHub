FROM my-app-shared:latest AS shared

FROM node:24-alpine

WORKDIR /app/user-service

# Copy pre-built shared packages
COPY --from=shared /app/types ./shared/types
COPY --from=shared /app/utils ./shared/utils

# Copy service package files first (for better caching)
COPY micro-services/user-service/package*.json ./
COPY micro-services/user-service/tsconfig.json ./

# Install dependencies (this layer will be cached if package.json unchanged)
RUN npm install ./shared/types ./shared/utils && npm install

# Copy source code last (changes here won't invalidate dependency cache)
COPY micro-services/user-service/src ./src

# Build the service
RUN npm run build

EXPOSE 4001
CMD ["npm", "start"]