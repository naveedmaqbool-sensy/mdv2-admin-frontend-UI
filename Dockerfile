# Base stage for dependencies
FROM node:20-slim AS develop
WORKDIR /app

# Install system dependencies if any
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

COPY . .

# Test stage
FROM develop AS test
RUN npm run lint
RUN npm run build

# Release stage
FROM node:20-slim AS release
WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files for production
COPY --from=develop /app/next.config.ts ./
COPY --from=develop /app/public ./public
COPY --from=develop /app/.next ./.next
COPY --from=develop /app/node_modules ./node_modules
COPY --from=develop /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
