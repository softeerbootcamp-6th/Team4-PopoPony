#!/bin/bash

APP_DIR="/home/ubuntu/app"
cd "$APP_DIR"

DEFAULT_CONF="/etc/nginx/nginx.conf"

IS_BLUE=$(docker ps --format "{{.Names}}" | grep -w blue)
IS_GREEN=$(docker ps --format "{{.Names}}" | grep -w green)

# 상태 출력
echo "현재 상태: BLUE=${IS_BLUE:+ON}, GREEN=${IS_GREEN:+ON}"

# 1. 둘 다 안 떠 있을 경우 => blue 실행
if [ -z "$IS_BLUE" ] && [ -z "$IS_GREEN" ]; then
  echo "### 상태: 둘 다 꺼져 있음 => BLUE 실행 ###"
  TARGET=blue
  TARGET_PORT=8081
  TARGET_CONF="/etc/nginx/nginx.blue.conf"
  OTHER=green

# 2. blue만 떠 있을 경우 => green 실행
elif [ -n "$IS_BLUE" ] && [ -z "$IS_GREEN" ]; then
  echo "### 상태: BLUE만 떠 있음 => GREEN 실행 ###"
  TARGET=green
  TARGET_PORT=8082
  TARGET_CONF="/etc/nginx/nginx.green.conf"
  OTHER=blue

# 3. green만 떠 있을 경우 => blue 실행
elif [ -z "$IS_BLUE" ] && [ -n "$IS_GREEN" ]; then
  echo "### 상태: GREEN만 떠 있음 => BLUE 실행 ###"
  TARGET=blue
  TARGET_PORT=8081
  TARGET_CONF="/etc/nginx/nginx.blue.conf"
  OTHER=green

# 4. 둘 다 떠 있음 => 에러 또는 선택적으로 처리
else
  echo "ERROR: BLUE와 GREEN 컨테이너가 둘 다 실행 중입니다."
  echo "동시 실행은 허용되지 않으므로 스크립트를 종료합니다."
  exit 1
fi

# 공통 로직
echo "1. Build and start $TARGET container"
docker compose build $TARGET
docker compose up -d $TARGET

SERVER_ADDRESS="http://localhost:$TARGET_PORT/actuator/health"
echo "2. Health check ($SERVER_ADDRESS)"
while true; do
  sleep 3
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $SERVER_ADDRESS)
  if [ "$RESPONSE" -eq 200 ]; then
    echo "Health check passed"
    break
  else
    echo "Waiting for $TARGET to be healthy... (HTTP $RESPONSE)"
  fi
done

echo "3. Reload nginx"
sudo cp $TARGET_CONF $DEFAULT_CONF
sudo nginx -s reload

echo "4. Stop $OTHER container"
docker compose stop $OTHER
