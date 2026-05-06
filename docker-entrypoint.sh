#!/bin/sh
set -e

ROLE="${1:-web}"

python manage.py migrate --noinput

if [ "$ROLE" = "web" ]; then
  exec gunicorn lms_backend.wsgi:application \
    --config gunicorn.conf.py
fi

exec "$@"
