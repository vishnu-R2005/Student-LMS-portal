# Full-Stack LMS (Django + React)

Production-ready Learning Management System with role-based JWT auth, course lifecycle management, enrollments, and learner progress tracking.

## Project Structure

- `lms_backend/` - Django settings and root URLs
- `accounts/` - custom user model, auth/profile/user APIs
- `courses/` - course/module/lesson/report APIs
- `enrollments/` - enrollment + progress + dashboard APIs
- `lms-frontend/` - React + Vite + Tailwind + Framer Motion app

## 1) Backend Setup

```bash
python -m pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## 2) Models Included

- `CustomUser` with roles (`admin`, `instructor`, `student`) and profile fields (`avatar`, `bio`)
- `Course` with approval workflow (`pending`, `approved`, etc.)
- `Module`, `Lesson` for structured learning content
- `Enrollment` for learner subscriptions
- `Progress` for lesson completion
- `ContentReport` for moderation workflow

## 3) APIs

Base: `http://127.0.0.1:8000/api`

- Auth
  - `POST /auth/register/`
  - `GET/PATCH /auth/profile/`
  - `POST /token/`
  - `POST /token/refresh/`
- Courses
  - `GET /courses/` (search/filter/paginated)
  - `GET /courses/{id}/`
  - `POST /courses/` (instructor/admin)
  - `POST /courses/{id}/approve/` (admin)
  - `POST /courses/{id}/report/` (authenticated)
  - `GET /courses/my_courses/` (instructor/admin)
- Content
  - `CRUD /modules/` (instructor/admin)
  - `CRUD /lessons/` (instructor/admin)
- Enrollment/Progress
  - `CRUD /enrollments/` (student)
  - `GET /enrollments/dashboard/` (student dashboard data)
  - `CRUD /progress/` (student)
  - `POST /progress/mark_complete/`
- Admin Moderation
  - `GET /users/` (admin)
  - `CRUD /reports/` (admin)

## 4) Frontend Setup

```bash
cd lms-frontend
npm install
copy .env.example .env
npm run dev
```

## 5) UI Pages

- Landing page (animated hero)
- Login/Register
- Course catalog with search/filter and loading skeletons
- Course detail with enroll CTA
- Student dashboard with progress bars and recent activity
- Video page with complete lesson action
- Instructor panel to create and monitor courses
- Protected routes and role checks
- Dark mode toggle

## 6) Deployment Notes

### Backend (Django)

- Environment-ready via `.env`
- Switch DB to PostgreSQL with:
  - `USE_POSTGRES=True`
  - `POSTGRES_*` vars in `.env`
- Static handling middleware included (`whitenoise`)
- Gunicorn installed for Linux servers:

```bash
gunicorn lms_backend.wsgi:application --bind 0.0.0.0:8000
```

### Frontend (React)

- Set `VITE_API_BASE_URL` in `.env` to deployed backend API URL
- Build for production:

```bash
npm run build
```

- Serve `dist/` through Nginx, Vercel, Netlify, or any static host.

## 7) Execution Plan Coverage

1. Backend setup - complete  
2. Models - complete  
3. APIs - complete  
4. Auth system - complete  
5. Frontend setup - complete  
6. UI pages - complete  
7. Integration - complete  
8. Deployment guide - complete
