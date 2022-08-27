#!/bin/bash

set -euo pipefail

PG_USER=app
PG_PASSWORD=app121
PG_HOST=localhost
PG_PORT_CONTAINER=5432 # Within the container, PG runs on the standard port
PG_PORT=5440           # On the host, we default to a non-standard port to not clash with local PG
PG_DB=api
PG_CONTAINER_NAME=parker_postgres
PG_DATA_VOLUME=pg_data

while getopts ":u:w:h:p:d:c:v:" arg; do
    case $arg in
    u) PG_USER=$OPTARG ;;
    w) PG_PASSWORD=$OPTARG ;;
    h) PG_HOST=$OPTARG ;;
    p) PG_PORT=$OPTARG ;;
    d) PG_DB=$OPTARG ;;
    c) PG_CONTAINER_NAME=$OPTARG ;;
    v) PG_DATA_VOLUME=$OPTARG ;;
    *)
        echo "usage: $0 [-v] [-r]" >&2
        exit 1
        ;;
    esac
done

PG_URL="postgres://$PG_USER:$PG_PASSWORD@$PG_HOST:$PG_PORT_CONTAINER/$PG_DB?sslmode=disable"

if [ "$(docker ps -q -f name="$PG_CONTAINER_NAME")" ]; then
    echo "Postgres container already running"
    exit 0
fi

# Ensure we have a local volume for storing Postgres data, so we don't lose it between runs
docker volume create "$PG_DATA_VOLUME"

# If DB is already running, shut it down
docker rm -f "$PG_CONTAINER_NAME" >/dev/null 2>&1 || true

# Start the DB
docker run --name "$PG_CONTAINER_NAME" \
    -v "$PG_DATA_VOLUME":/var/lib/postgresql/data \
    -e POSTGRES_USER="$PG_USER" \
    -e POSTGRES_PASSWORD="$PG_PASSWORD" \
    -e POSTGRES_DB="$PG_DB" \
    -p "$PG_PORT":"$PG_PORT_CONTAINER" \
    -d postgres:14.5

# Wait for the DB to come up before letting the script finish
DB_UP=0
while [ $DB_UP -eq 0 ]; do
    echo 'Waiting for DB to come up ...'
    DB_UP=$(docker exec -t "$PG_CONTAINER_NAME" /bin/bash -c 'psql '"$PG_URL"' -c "SELECT 1"' >/dev/null 2>&1 && echo 1 || echo 0)
    if [ "$DB_UP" -eq 1 ]; then
        echo 'DB is up'
    else
        sleep 1
    fi
done
