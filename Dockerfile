# Use Node.js 20 LTS as base image
FROM node:20-slim

# Install pnpm globally with the specific version required
RUN npm install -g pnpm@10.24.0

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the project
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 4444

# Start the server
CMD ["pnpm", "run", "serve"]
