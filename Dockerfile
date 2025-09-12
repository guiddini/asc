# Use Node.js 18 Alpine as base image
FROM node:18-alpine

WORKDIR /app

# Build-time args (set these when you run `docker build`)
ARG VITE_APP_API_URL
ARG VITE_APP_HTTP_API_URL
ARG VITE_APP_STORAGE_URL
ARG VITE_APP_ENCRYPTION_KEY
ARG VITE_APP_BASE_LAYOUT_CONFIG_KEY
ARG VITE_APP_I18N_CONFIG_KEY

# Make them available as env vars during build (Vite picks up VITE_* at build time)
ENV VITE_APP_API_URL=${VITE_APP_API_URL}
ENV VITE_APP_HTTP_API_URL=${VITE_APP_HTTP_API_URL}
ENV VITE_APP_STORAGE_URL=${VITE_APP_STORAGE_URL}
ENV VITE_APP_ENCRYPTION_KEY=${VITE_APP_ENCRYPTION_KEY}
ENV VITE_APP_BASE_LAYOUT_CONFIG_KEY=${VITE_APP_BASE_LAYOUT_CONFIG_KEY}
ENV VITE_APP_I18N_CONFIG_KEY=${VITE_APP_I18N_CONFIG_KEY}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the built application
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the application using serve
CMD ["serve", "-s", "dist", "-l", "3000"]
