#!/bin/bash
echo "🔥 Cleaning up old deployment files..."
rm -f /home/ubuntu/app/docker-compose.yml
rm -f /home/ubuntu/app/Dockerfile
rm -f /home/ubuntu/app/deploy.sh
rm -f /home/ubuntu/app/cleanup.sh
rm -f /home/ubuntu/app/server-0.0.1-SNAPSHOT.jar
rm -f /home/ubuntu/app/.env
rm -f /home/ubuntu/app/appspec.yml
echo "🔥 Clean up complete!"
