#!/bin/bash

set -a
source .env
set +a

OUTPUT_FILE="database/dumps/seeder.sql"

TABLES=("centres" "roles" "product_categories")

echo "-- Seeder generated on $(date)" > $OUTPUT_FILE
echo "SET FOREIGN_KEY_CHECKS=0;" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

for TABLE in "${TABLES[@]}"; do
  echo "-- ===============================" >> $OUTPUT_FILE
  echo "-- Seed data for $TABLE" >> $OUTPUT_FILE
  echo "-- ===============================" >> $OUTPUT_FILE

  mysqldump \
    -h "$DB_HOST" \
    -u "$DB_USER" \
    -p"$DB_PASS" \
    "$DB_NAME" \
    "$TABLE" \
    --no-create-info \
    --skip-triggers \
    --complete-insert \
    --compact >> $OUTPUT_FILE

  echo "" >> $OUTPUT_FILE
done

echo "SET FOREIGN_KEY_CHECKS=1;" >> $OUTPUT_FILE

echo "Seeder created: $OUTPUT_FILE"