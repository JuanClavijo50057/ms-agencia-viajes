# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build -- --ignore-ts-errors

# Stage 2: Production
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Copy built application from builder
COPY --from=builder /app/build ./

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3333

# Use dumb-init to run the application
ENTRYPOINT ["dumb-init"]

# Start the application
CMD ["node", "server.js"]
