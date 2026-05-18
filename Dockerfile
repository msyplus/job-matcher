# Stage 1: Build frontend
FROM node:24-alpine AS client-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:24-alpine AS server-builder
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Stage 3: Production
FROM node:24-alpine
WORKDIR /app

# Copy server dependencies
COPY --from=server-builder /app/server/package.json /app/server/package-lock.json ./
RUN npm ci --production

# Copy server dist
COPY --from=server-builder /app/server/dist ./server/dist

# Copy client dist
COPY --from=client-builder /app/client/dist ./client/dist

# Copy .env (create a default if not exists)
COPY server/.env .env 2>/dev/null || echo "PORT=3000" > .env

# Create data directory for SQLite
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/jobmatcher.db

EXPOSE 3000
CMD ["node", "server/dist/main.prod.js"]
