#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "===> Installing Python Dependencies..."
pip install -r requirements.txt

echo "===> Running Database Migrations..."
python manage.py migrate --noinput

echo "===> Seeding 28 Products & Categories..."
python scripts/seed_data.py

echo "===> Collecting Static Files for Whitenoise..."
python manage.py collectstatic --noinput

echo "===> Build completed successfully!"
