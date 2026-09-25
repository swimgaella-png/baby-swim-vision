FROM node:22-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build frontend
RUN npm run build

# Environment settings
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["npx", "tsx", "server.ts"]
