#!/usr/bin/env bash
set -euo pipefail

APP_HOME="/home/ubuntu/app"
cd "$APP_HOME"

# 1) 환경변수 로딩 (/etc/environment 호환)
if [ -f /etc/environment ]; then
  # shellcheck disable=SC2046
  export $(grep -v '^#' /etc/environment | xargs -d '\n' -I {} bash -lc 'echo {}' | xargs)
fi
if [ -f "$APP_HOME/.env" ]; then
  export $(grep -v '^#' "$APP_HOME/.env" | xargs)
fi

# 필수: DOCKER_USERNAME / DOCKER_PASSWORD 는 EC2에 미리 저장
: "${DOCKER_USERNAME:?DOCKER_USERNAME not set}"
: "${DOCKER_PASSWORD:?DOCKER_PASSWORD not set}"

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

IMAGE="seonghooni0327/myapp:latest"

# 2) 최신 이미지 pull
docker pull "$IMAGE"

# 3) 컨테이너 무중단 근사치 업데이트 (compose up -d)
docker compose -f "$APP_HOME/docker-compose.yml" up -d

# 4) 쓰지 않는 이미지/볼륨 정리(용량 문제 예방)
docker system prune -af

echo "Deploy done."
