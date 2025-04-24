#!/bin/bash

# Прерываем выполнение при ошибке
set -e

# Определяем путь к проекту относительно расположения скрипта
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_PATH="$SCRIPT_DIR"

# Имя фронтенд-приложения
APP_NAME="gpt-helper-webapp"

# Данные для Docker Hub из переменных среды
DOCKER_USERNAME=${DOCKER_USERNAME:?Ошибка: переменная среды DOCKER_USERNAME не установлена}
DOCKER_PASSWORD=${DOCKER_PASSWORD:?Ошибка: переменная среды DOCKER_PASSWORD не установлена}
DOCKER_REPO="$DOCKER_USERNAME/$APP_NAME"

# Параметры для SSH
REMOTE_USER="biffi"
REMOTE_HOST="192.168.6.28"
REMOTE_DIR="/home/$REMOTE_USER/workspace/docker/services/$APP_NAME"

echo "Начинаем сборку фронтенд приложения '$APP_NAME' в Docker Hub репозиторий '$DOCKER_REPO'..."

# Устанавливаем зависимости и билдим фронтенд
cd "$PROJECT_PATH"
pnpm install
pnpm run build

# Логинимся в Docker Hub
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

# Собираем Docker-образ
docker buildx build --platform linux/amd64 -f "$PROJECT_PATH/docker/Dockerfile" -t "$DOCKER_REPO:latest" "$PROJECT_PATH"

# Пушим образ в Docker Hub
docker push "$DOCKER_REPO:latest"

# Копируем деплой-файлы на сервер
echo "Копируем деплой файлы на удалённый сервер..."

cp -r "$PROJECT_PATH/docker/." "/Users/alex_pyshkin/All/repo/Infrastructure/docker/services/$APP_NAME/"
scp -r "$PROJECT_PATH/docker/." "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

echo "Фронтенд сборка завершена, образ залит и файлы скопированы на сервер!"
