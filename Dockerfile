FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci
COPY . .

COPY . .

RUN npm install -g pm2
RUN npm run build

RUN npx prisma generate

ENV NODE_OPTIONS="--no-deprecation"
ENV NODE_ENV=production


EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]