#!/bin/bash

# Function to create environment files
generate_env_file() {
    SERVICE_NAME=$1
    mkdir -p "$SERVICE_NAME/config"
    ENV_FILE="$SERVICE_NAME/config/.env.development"
    touch "$ENV_FILE"

    # Environment
    echo "NODE_ENV=development" > "$ENV_FILE"

    # Server
    echo "PORT=3000" >> "$ENV_FILE"
    echo "HOST=localhost" >> "$ENV_FILE"

    # Setup jet-logger
    echo "JET_LOGGER_MODE=CONSOLE" >> "$ENV_FILE"
    echo "JET_LOGGER_FILEPATH=jet-logger.log" >> "$ENV_FILE"
    echo "JET_LOGGER_TIMESTAMP=TRUE" >> "$ENV_FILE"
    echo "JET_LOGGER_FORMAT=LINE" >> "$ENV_FILE"

    # Mongo
    echo "MONGO_URI=mongodb://mongo:27017/db" >> "$ENV_FILE"
    echo "MONGO_INITDB_ROOT_USERNAME=root" >> "$ENV_FILE"
    echo "MONGO_INITDB_ROOT_PASSWORD=example" >> "$ENV_FILE"

    # Additional configurations for specific services
    if [ "$SERVICE_NAME" == "log-management" ]; then
        echo "RABBITMQ_URI=rabbitmq" >> "$ENV_FILE"
        echo "RABBITMQ_QUEUE_LOGS=log_queue" >> "$ENV_FILE"
    fi
}

# List of services
SERVICES=("game-score" "leaderboard" "log-management" "player-management")

# Loop through services and generate environment files
for SERVICE in "${SERVICES[@]}"; do
    generate_env_file "$SERVICE"
done

echo "Environment setup complete!"
