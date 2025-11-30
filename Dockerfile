# -----------------------------
# Build stage
# -----------------------------
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# -----------------------------
# Production stage
# -----------------------------
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -S nginx_user && adduser -S -G nginx_user nginx_user

# Create required directories and fix permissions
RUN mkdir -p /var/cache/nginx /var/run/nginx /var/log/nginx && \
    chown -R nginx_user:nginx_user /var/cache/nginx /var/run/nginx /var/log/nginx /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

# Switch to non-root user
USER nginx_user

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]