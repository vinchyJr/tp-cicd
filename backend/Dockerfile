# Stage 1 — builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src/ src/

# Stage 2 — production
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]
