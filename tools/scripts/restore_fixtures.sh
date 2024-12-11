#!/bin/bash

set -eo pipefail

pg_user=dev_admin
pg_password=dev_admin_password
pg_container_name=parker_postgres_dev
pg_host=localhost
pg_port=5432
pg_db="$1"
db_url="postgres://$pg_user:$pg_password@$pg_host:$pg_port/$pg_db?sslmode=disable"
filename="fixtures-$pg_db-$RANDOM.sql"

docker cp ./fixtures.sql "$pg_container_name:/tmp/$filename"
docker exec -t "$pg_container_name" /bin/bash -c "PAGER='' psql ""$db_url"" -f /tmp/$filename"
docker exec -t "$pg_container_name" /bin/bash -c "rm /tmp/$filename"
