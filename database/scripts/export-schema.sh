#!/bin/bash

set -a
source .env
set +a

mkdir -p database/dumps

mysqldump \
  -h "$DB_HOST" \
  -P "$DB_PORT" \
  -u "$DB_USER" \
  -p"$DB_PASSWORD" \
  --no-data \
  --routines \
  --triggers \
  "$DB_NAME" \
  > database/dumps/schema.sql

echo "Schema exported successfully."