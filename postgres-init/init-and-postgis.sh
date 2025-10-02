#!/bin/bash
set -e

# Create databases
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d postgres <<-EOSQL
  CREATE DATABASE auth_db;
  CREATE DATABASE recipient_db;
  CREATE DATABASE donation_db;
  CREATE DATABASE donor_db;
  CREATE DATABASE inventory_db;
EOSQL

# Enable PostGIS in both
for db in recipient_db donation_db donor_db auth_db inventory_db; do
  echo "Enabling PostGIS in database: $db"
  psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$db" -c "CREATE EXTENSION IF NOT EXISTS postgis;"
done

