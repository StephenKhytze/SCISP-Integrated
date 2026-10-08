#!/bin/bash
set -e

echo "⏳ Waiting for MySQL to be ready..."
until php -r "new PDO('mysql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}');" 2>/dev/null; do
  echo "  MySQL not ready yet — retrying in 3s..."
  sleep 3
done
echo "✅ MySQL is ready!"

# If no .env exists, copy from .env.example
if [ ! -f /var/www/html/.env ]; then
  echo "📄 No .env found — copying from .env.example..."
  cp /var/www/html/.env.example /var/www/html/.env
fi

# Inject the DB & Mail environment variables into .env from docker-compose
sed -i "s|DB_DATABASE=.*|DB_DATABASE=${DB_DATABASE}|" .env
sed -i "s|DB_HOST=.*|DB_HOST=${DB_HOST}|" .env
sed -i "s|DB_PORT=.*|DB_PORT=${DB_PORT}|" .env
sed -i "s|DB_USERNAME=.*|DB_USERNAME=${DB_USERNAME}|" .env
sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${DB_PASSWORD}|" .env
sed -i "s|MAIL_MAILER=.*|MAIL_MAILER=${MAIL_MAILER}|" .env
sed -i "s|MAIL_HOST=.*|MAIL_HOST=${MAIL_HOST}|" .env
sed -i "s|MAIL_PORT=.*|MAIL_PORT=${MAIL_PORT}|" .env
sed -i "s|MAIL_USERNAME=.*|MAIL_USERNAME=${MAIL_USERNAME}|" .env
sed -i "s|MAIL_PASSWORD=.*|MAIL_PASSWORD=${MAIL_PASSWORD}|" .env
sed -i "s|MAIL_ENCRYPTION=.*|MAIL_ENCRYPTION=${MAIL_ENCRYPTION}|" .env
sed -i "s|MAIL_FROM_ADDRESS=.*|MAIL_FROM_ADDRESS=\"${MAIL_FROM_ADDRESS}\"|" .env
sed -i "s|MAIL_FROM_NAME=.*|MAIL_FROM_NAME=\"${MAIL_FROM_NAME}\"|" .env
sed -i "s|APP_URL=.*|APP_URL=http://localhost:8000|" .env

echo "🔑 Generating application key..."
php artisan key:generate --force

echo "📦 Running storage link..."
php artisan storage:link --force 2>/dev/null || true

echo "🗄️ Running migrations and seeders..."
php artisan migrate:fresh --seed --force

echo "🚀 Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=8000
