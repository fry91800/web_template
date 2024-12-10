#!/bin/bash

# Set environment variables
DB_NAME="postgres"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"
DUMP_FILE="./dump.sql"
export PGPASSWORD="posert" 
# Step 1: Drop the existing database
echo "Dropping the existing database: $DB_NAME"
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "DROP DATABASE IF EXISTS $DB_NAME;"

# Step 2: Recreate the database
echo "Creating a new database: $DB_NAME"
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE $DB_NAME;"

# Step 3: Load the dump into the new database
echo "Loading data from dump: $DUMP_FILE"
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f $DUMP_FILE

echo "Database load complete."
