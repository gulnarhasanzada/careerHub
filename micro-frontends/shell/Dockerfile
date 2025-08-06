FROM node:24-alpine

WORKDIR /app

# Copy shared packages
COPY shared/types /app/shared/types
COPY shared/utils /app/shared/utils

# Build shared packages
WORKDIR /app/shared/types
RUN npm install && npm run build

WORKDIR /app/shared/utils
RUN npm install && npm run build

# Copy shell app
WORKDIR /app/shell
COPY micro-frontends/shell/package*.json ./
COPY micro-frontends/shell/next.config.ts ./
COPY micro-frontends/shell/tsconfig.json ./

# Install shared packages locally
RUN npm install ../shared/types ../shared/utils

# Install other dependencies
RUN npm install

# Copy source code
COPY micro-frontends/shell/app ./app
COPY micro-frontends/shell/public ./public

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]