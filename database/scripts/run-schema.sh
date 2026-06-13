#!/bin/bash

set -e

set -a
source .env
set +a

echo "🚀 Importing schema.sql..."

mysql \
  -h "$DB_HOST" \
  -P "$DB_PORT" \
  -u "$DB_USER" \
  -p"$DB_PASSWORD" \
  "$DB_NAME" < database/dumps/schema.sql

echo "✅ Schema imported successfully."