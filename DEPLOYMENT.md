# LMS Deployment Runbook

This document is the final pre-deploy checklist for Render, Railway, AWS, and DigitalOcean.

## 1) Required Environment Variables

Backend (`.env` or platform env):

- `DJANGO_SECRET_KEY` (strong, random, required when `DEBUG=False`)
- `DEBUG=False`
- `ALLOWED_HOSTS=api.yourdomain.com`
- `CSRF_TRUSTED_ORIGINS=https://app.yourdomain.com,https://api.yourdomain.com`
- `CORS_ALLOWED_ORIGINS=https://app.yourdomain.com`
- `USE_POSTGRES=True`
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`
- `SECURE_SSL_REDIRECT=True`
- `SECURE_HSTS_SECONDS=31536000`
- `SESSION_COOKIE_SAMESITE=Lax`
- `CSRF_COOKIE_SAMESITE=Lax`

Frontend (`lms-frontend/.env.production`):

- `VITE_API_BASE_URL=https://api.yourdomain.com/api`

## 2) Backend Commands

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py test lms_backend learning accounts
gunicorn lms_backend.wsgi:application --config gunicorn.conf.py
```

## 3) Frontend Commands

```bash
cd lms-frontend
npm ci
npm run build
```

Deploy `lms-frontend/dist` to static hosting or serve through Nginx.

## 4) Nginx / Reverse Proxy

- Use `deploy/nginx.conf.example` as template.
- Proxy `/api/` and `/admin/` to Gunicorn service.
- Serve built frontend assets and route SPA fallback to `/index.html`.
- Configure TLS certificates (Let's Encrypt or managed provider TLS).

## 5) Smoke Test Checklist

Run after deploy:

- `GET /api/health/` returns `200` and `{"status":"ok"}`
- Login works with `POST /api/token/`
- Token refresh works with `POST /api/token/refresh/`
- Student cannot access admin analytics (`/api/learning/analytics/admin/` => `403`)
- Admin can access admin analytics (`200`)
- Student dashboard and instructor dashboard load from frontend
- Admin dashboard and users page load from frontend

## 6) Platform-Specific Notes

- **Render/Railway**: set `Start Command` to `gunicorn lms_backend.wsgi:application --config gunicorn.conf.py`.
- **AWS ECS / DigitalOcean Apps**: reuse `Dockerfile` + `docker-entrypoint.sh`.
- Ensure persistent media storage (cloud volume or S3-compatible bucket) if user-uploaded files are required.

## 7) Zero-Downtime Safety

- Run DB backups before migration.
- Apply migrations before switching traffic.
- Validate smoke tests before promoting release.
- Keep previous release revision available for rollback.
