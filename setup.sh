#!/bin/bash

echo "Setting up Pyörävahti development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start Docker containers
echo "Starting PostgreSQL and MailDev containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Install dependencies
echo "Installing dependencies..."
yarn install

# Run Prisma migrations
echo "Running Prisma migrations..."
yarn prisma:migrate

echo "Setup complete!"
echo "You can now start the development server with: yarn dev"
echo "Access the application at: http://localhost:3000"
echo "Access MailDev at: http://localhost:1080"