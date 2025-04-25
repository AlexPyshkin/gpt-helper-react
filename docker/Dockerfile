# Билд образа для фронта
#FROM node:20-alpine AS builder
#
#WORKDIR /app

## Копируем package.json и lock-файл для установки зависимостей
#COPY package.json pnpm-lock.yaml ./
#
## Устанавливаем зависимости (без dev-зависимостей, если нужно)
#RUN npm install
#
## Копируем исходники (кроме того, что в .dockerignore)
#COPY . .
#
## Собираем фронтенд
#RUN npm run build
## Копируем исходники (кроме того, что в .dockerignore)
#COPY . .

# Финальный образ
FROM nginx:alpine

# Копируем собранный фронт
#COPY --from=builder /app/dist /usr/share/nginx/html
COPY ../dist /usr/share/nginx/html

# Копируем nginx-конфиг если есть
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Копируем собранный фронт (dist) в стандартную папку nginx
#COPY dist /usr/share/nginx/html

# Копируем свой nginx.conf (если нужен прокси /graphql)
#COPY nginx.conf /etc/nginx/nginx.conf
#
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]