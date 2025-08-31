FROM node:24-alpine

WORKDIR /app

# Copy shared types first
COPY shared/types ./shared/types
WORKDIR /app/shared/types
RUN npm install && npm run build

# Copy shared utils second
WORKDIR /app
COPY shared/utils ./shared/utils
WORKDIR /app/shared/utils
RUN npm install && npm run build

# Now work on api-gateway
WORKDIR /app/api-gateway
COPY micro-services/api-gateway/package*.json ./
COPY micro-services/api-gateway/tsconfig.json ./

# Install shared packages as local dependencies
RUN npm install ../shared/types ../shared/utils

# Install other dependencies
RUN npm install

# Copy source code and env
COPY micro-services/api-gateway/src ./src

# Build the service
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]