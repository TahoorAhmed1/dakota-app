FROM node:22-bookworm-slim

WORKDIR /app

COPY . .

RUN npm ci
RUN npx prisma generate
RUN npm run build
RUN npm install -g pm2

ENV NODE_ENV=production

EXPOSE 80 443
CMD ["pm2-runtime", "ecosystem.config.js"]