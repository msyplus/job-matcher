# Stage 1: Build frontend
FROM node:24-alpine AS client-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:24-alpine AS server-builder
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Production
FROM node:24-alpine
WORKDIR /app

COPY --from=server-builder /app/server/package.json /app/server/package-lock.json ./
RUN npm ci --production

COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=client-builder /app/client/dist ./client/dist

RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/jobmatcher.db

EXPOSE 3000
CMD ["node", "server/dist/main.prod.js"]
