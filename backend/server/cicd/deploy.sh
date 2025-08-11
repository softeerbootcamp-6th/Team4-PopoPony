#!/bin/bash

APP_DIR="/home/ubuntu/app"
cd "$APP_DIR"

DEFAULT_CONF="/etc/nginx/nginx.conf"

IS_BLUE=$(docker ps --format "{{.Names}}" | grep -w blue)
IS_GREEN=$(docker ps --format "{{.Names}}" | grep -w green)

echo "현재 상태: BLUE=${IS_BLUE:+ON}, GREEN=${IS_GREEN:+ON}"

if [ -z "$IS_BLUE" ] && [ -z "$IS_GREEN" ]; then
  TARGET=blue
  TARGET_PORT=8081
  TARGET_CONF="/etc/nginx/nginx.blue.conf"
  OTHER=green
elif [ -n "$IS_BLUE" ] && [ -z "$IS_GREEN" ]; then
  TARGET=green
  TARGET_PORT=8082
  TARGET_CONF="/etc/nginx/nginx.green.conf"
  OTHER=blue
elif [ -z "$IS_BLUE" ] && [ -n "$IS_GREEN" ]; then
  TARGET=blue
  TARGET_PORT=8081
  TARGET_CONF="/etc/nginx/nginx.blue.conf"
  OTHER=green
else
  echo "ERROR: BLUE와 GREEN 컨테이너가 둘 다 실행 중입니다."
  exit 1
fi

echo "1. Build image (only if not exists)"
if ! docker image inspect myapp:latest > /dev/null 2>&1; then
  docker build -t myapp:latest .
fi

echo "2. Start $TARGET container (using EC2 environment variables)"
export SPRING_PROFILE=prod
export DB_URL="$DB_URL"
export DB_USERNAME="$DB_USERNAME"
export DB_PASSWORD="$DB_PASSWORD"

docker compose up -d --build $TARGET

SERVER_ADDRESS="http://localhost:$TARGET_PORT/actuator/health"
echo "3. Health check ($SERVER_ADDRESS)"
for i in {1..20}; do
  sleep 3
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $SERVER_ADDRESS)
  if [ "$RESPONSE" -eq 200 ]; then
    echo "Health check passed"
    break
  else
    echo "Waiting for $TARGET to be healthy... (HTTP $RESPONSE)"
  fi
done

echo "4. Reload nginx"
sudo cp $TARGET_CONF $DEFAULT_CONF
sudo nginx -s reload

echo "5. Stop and remove $OTHER container"
docker compose stop $OTHER
docker compose rm -v -f $OTHER

echo "6. Clean up unused Docker resources"
docker image prune -f
docker container prune -f
docker network prune -f
