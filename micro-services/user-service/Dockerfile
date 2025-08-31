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

# Now work on user-service
WORKDIR /app/user-service
COPY micro-services/user-service/package*.json ./
COPY micro-services/user-service/tsconfig.json ./

# Install shared packages as local dependencies
RUN npm install ../shared/types ../shared/utils

# Install other dependencies
RUN npm install

# Copy source code and env
COPY micro-services/user-service/src ./src

# Build the service
RUN npm run build

EXPOSE 4001

CMD ["npm", "start"]