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
  --routines \
  --triggers \
  "$DB_NAME" \
  > database/dumps/full-dump.sql

echo "Full database exported successfully."