#!/bin/bash

set -eo pipefail

PG_USER=dev_admin
PG_PASSWORD=dev_admin_password
PG_CONTAINER_NAME=parker_postgres_dev
DB_URL="postgres://$PG_USER:$PG_PASSWORD@$PG_HOST:$PG_PORT_CONTAINER/$PG_DB?sslmode=disable"

docker exec -t "$PG_CONTAINER_NAME" /bin/bash -c "pg_dump --column-inserts --inserts --quote-all-identifiers --no-owner --disable-dollar-quoting ""$DB_URL""" >fixtures.sql
