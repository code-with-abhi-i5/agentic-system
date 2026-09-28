FROM node:20-slim

# Install Chromium and required font/runtime libraries for Puppeteer in headless Linux
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Point Puppeteer to the installed system Chromium binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production \
    PORT=5000

WORKDIR /app

# Copy dependency manifests from backend directory
COPY backend/package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy all backend source code
COPY backend/ ./

EXPOSE 5000

CMD ["node", "src/server.js"]
