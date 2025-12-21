# Use an official Node image that supports multi-arch (works on macOS and Linux)
FROM node:22-slim
# Install NGINX, Tini, and other required tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    ca-certificates \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy only package manifests first to take advantage of cached dependency installation
COPY package.json bun.lock ./



# Install pnpm using corepack
# Install bun
RUN npm install --global bun@latest

# Ensure bun is on PATH (usually already is after npm -g)
ENV PATH="/usr/local/bin:${PATH}"

# Install dependencies with bun
RUN bun install


# Copy the rest of the application (including .env)
COPY . .

# Accept build args for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ENV

# Set environment variables for build time
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Debug: Show env vars being used
RUN echo "Building with NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"

# Build the Next.js application
RUN bun run build

# Copy NGINX configuration
RUN mkdir -p /etc/nginx/sites-available \
    && mkdir -p /etc/nginx/sites-enabled \
    && ln -s /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/

COPY nginx.conf /etc/nginx/sites-available/app.conf

# Expose required ports
EXPOSE 3000 80 443

# Use a script to start both NGINX and your Node app
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Change CMD to use the script
CMD ["/start.sh"]
