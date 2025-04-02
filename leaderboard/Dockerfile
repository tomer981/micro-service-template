FROM node:22.14.0-alpine3.21
LABEL authors="tomer_avivi"
EXPOSE 3000
WORKDIR /app

RUN npm install -g nodemon

ARG NODE_ENV
ARG PORT
ARG HOST
ARG DISABLE_HELMET
ARG JET_LOGGER_MODE
ARG JET_LOGGER_FILEPATH
ARG JET_LOGGER_TIMESTAMP
ARG JET_LOGGER_FORMAT
ARG MONGO_URI
ARG RABBITMQ_URI
ARG MONGO_INITDB_ROOT_USERNAME
ARG MONGO_INITDB_ROOT_PASSWORD

RUN env_file="config/.env.${NODE_ENV}" && \
    mkdir -p "config" && \
    touch "$env_file" && \
    echo "NODE_ENV=$NODE_ENV" >> "$env_file" && \
    echo "PORT=$PORT" >> "$env_file" && \
    echo "MONGO_INITDB_ROOT_USERNAME=$MONGO_INITDB_ROOT_USERNAME" >> "$env_file" && \
    echo "MONGO_INITDB_ROOT_PASSWORD=$MONGO_INITDB_ROOT_PASSWORD" >> "$env_file" && \
    echo "HOST=$HOST" >> "$env_file" && \
    echo "MONGO_URI=$MONGO_URI" >> "$env_file" && \
    echo "DISABLE_HELMET=$DISABLE_HELMET" >> "$env_file" && \
    echo "JET_LOGGER_MODE=$JET_LOGGER_MODE" >> "$env_file" && \
    echo "JET_LOGGER_FILEPATH=$JET_LOGGER_FILEPATH" >> "$env_file" && \
    echo "JET_LOGGER_TIMESTAMP=$JET_LOGGER_TIMESTAMP" >> "$env_file" && \
    echo "JET_LOGGER_FORMAT=$JET_LOGGER_FORMAT" >> "$env_file"


COPY package*.json ./
COPY tsconfig*.json ./
COPY eslint.config.ts ./
COPY config.ts ./
COPY scripts/build.ts ./scripts/


RUN npm install
COPY src /app/src
ENV NODE_ENV=$NODE_ENV

RUN npm run build

CMD ["npm", "run", "dev:hot"]
#CMD ["tail", "-f", "/dev/null"]
