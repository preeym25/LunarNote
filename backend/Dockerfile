# ==============================================================================
# Dockerfile for LunarNote Backend API
# Official Node.js 20 LTS Alpine Image
# Production-ready, non-root user execution
# ==============================================================================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Set default production environment variables
ENV NODE_ENV=production \
    PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source code
COPY . .

# Set proper ownership for non-root user
RUN chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose backend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start application using existing production start script
CMD ["npm", "start"]
