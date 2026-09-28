#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "===> Installing Python Dependencies..."
pip install -r backend/requirements.txt

echo "===> Running Database Migrations..."
python backend/manage.py migrate --noinput

echo "===> Seeding 28 Products & Categories..."
python backend/scripts/seed_data.py

echo "===> Collecting Static Files for Whitenoise..."
python backend/manage.py collectstatic --noinput

echo "===> Build completed successfully!"
