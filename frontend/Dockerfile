# ==============================================================================
# Multi-stage Dockerfile for LunarNote Frontend
# Stage 1: Build the React/Vite application
# Stage 2: Serve production build using lightweight Nginx Alpine
# ==============================================================================

# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy application source code
COPY . .

# Build argument for backend API URL (defaults to /api/v1 for reverse proxy)
ARG VITE_BACKEND_URL=/api/v1
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build the production bundle
RUN npm run build

# ---- Production Server Stage ----
FROM nginx:alpine

# Remove default nginx static assets and configuration
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static bundle from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
