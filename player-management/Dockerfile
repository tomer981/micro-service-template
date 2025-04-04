FROM node:22.14.0-alpine3.21 AS builder
LABEL authors="tomer_avivi"

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY eslint.config.ts ./
COPY scripts/build.ts ./scripts/

RUN npm install

COPY src ./src

RUN npm run build

FROM node:22.14.0-alpine3.21 AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --only=production

CMD ["npm", "run", "start"]
