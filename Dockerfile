# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma folder
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install deps
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy build output & dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Set production env
ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "run", "start:docker"]
