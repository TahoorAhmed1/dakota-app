FROM node:20-bookworm-slim

WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy full source
COPY . .

# Install PM2 globally (if you really need it)
RUN npm install -g pm2

# Generate Prisma client BEFORE build
RUN npx prisma generate

# Build Next.js / backend
RUN npm run build

# Environment
ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-deprecation"

EXPOSE 3000

# Start app
CMD ["pm2-runtime", "ecosystem.config.js"]