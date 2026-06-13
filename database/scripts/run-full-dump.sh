#!/bin/bash

set -e

set -a
source .env
set +a

echo "🚀 Importing full-dump.sql..."

mysql \
  -h "$DB_HOST" \
  -P "$DB_PORT" \
  -u "$DB_USER" \
  -p"$DB_PASSWORD" \
  "$DB_NAME" < database/dumps/full-dump.sql

echo "✅ Full database imported successfully."