FROM node:22.14.0-alpine3.21 AS builder
LABEL authors="tomer_avivi"

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY src ./src

RUN npm install --only=production
CMD ["tail", "-f", "/dev/null"]

#FROM node:22.14.0-alpine3.21 AS runtime
#
#WORKDIR /app
#
#COPY --from=builder /app/dist ./dist
#COPY --from=builder /app/package*.json ./
#
#
#CMD ["npm", "run", "start"]
