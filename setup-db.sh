#!/bin/bash

echo "Setting up Pyörävahti database..."

# Check if psql is installed
if ! command -v psql &> /dev/null
then
    echo "PostgreSQL client (psql) is not installed."
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt install postgresql postgresql-contrib"
    echo "  Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Create database
echo "Creating database 'bicyai'..."
createdb bicyai 2>/dev/null || {
    echo "Database 'bicyai' already exists or there was an error creating it."
    echo "If the database doesn't exist, please create it manually:"
    echo "  createdb bicyai"
}

echo "Database setup complete!"
echo "Please update your .env file with the correct DATABASE_URL if needed."
echo "Then run: yarn prisma:migrate"