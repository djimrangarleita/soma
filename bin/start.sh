CONTAINER_NAME=$1

if [ -z "$CONTAINER_NAME" ]; then
    docker compose --env-file .env.local up -d
else
    docker compose --env-file .env.local up -d "$CONTAINER_NAME"
fi