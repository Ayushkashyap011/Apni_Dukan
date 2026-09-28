# 🚀 APNI DUKAN — Production Deployment Guide

## 1. Local Production Quickstart via Docker Compose

Run the entire full-stack application (Django + React + PostgreSQL + Redis + Gunicorn + Nginx) with a single command:

```bash
docker-compose up --build
```

Access services:
- **Frontend App**: `http://localhost/`
- **Backend REST API**: `http://localhost:8000/api/v1/`
- **Swagger Documentation**: `http://localhost:8000/api/docs/`

---

## 2. Manual Standalone Deployment

### Backend Setup (Gunicorn + PostgreSQL)
1. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Configure `.env` variables:
   ```ini
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   POSTGRES_DB=apnidukan_prod
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_HOST=your-rds-or-pg-host
   ```
3. Run migrations and seed data:
   ```bash
   python manage.py migrate
   python scripts/seed_data.py
   python manage.py collectstatic --noinput
   ```
4. Start WSGI server via Gunicorn:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
   ```

### Frontend Deployment (Nginx / Vercel / Netlify)
1. Build production static bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the generated `frontend/dist/` directory to your Nginx web root or static hosting platform.
