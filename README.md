# Product Marketplace

A full-stack Product Marketplace where businesses can list and manage products with role-based access control and a structured approval workflow. Built with Django REST Framework on the backend and Next.js on the frontend.

---

## What Was Implemented

### Backend (Django REST Framework)

#### Authentication
- JWT-based authentication using `djangorestframework-simplejwt`
- Access tokens (30-minute lifetime) and refresh tokens (7-day lifetime)
- Token refresh endpoint so sessions stay alive without re-login

#### Business & Multi-Tenancy
- Every user belongs to exactly one **Business**
- All data (products, users) is scoped to the business — no cross-business data leakage
- Registering creates a new Business and an Admin user in one step

#### Role-Based Access Control (RBAC)
- Four roles: **Admin**, **Editor**, **Approver**, **Viewer**
- Permissions enforced at the API level using custom DRF permission classes
- Role logic lives on the `User` model (`is_admin()`, `can_manage_products()`, `can_approve_products()`)

#### Product Approval Workflow
- Products move through states: `Draft → Pending Approval → Approved` (or `Rejected → Draft`)
- State transitions are exposed as dedicated action endpoints (`/submit/`, `/approve/`, `/reject/`)
- Only **Approved** products are visible on the public endpoint

#### API Endpoints
- `POST /api/accounts/register/` — register business + admin
- `POST /api/accounts/token/` — login
- `POST /api/accounts/token/refresh/` — refresh access token
- `GET /api/accounts/me/` — current user info
- `GET|POST /api/accounts/users/` — list/create users (admin only)
- `GET|PATCH|DELETE /api/accounts/users/{id}/` — user detail (admin only)
- `GET /api/accounts/roles/` — list available roles
- `GET /api/products/public/` — approved products (unauthenticated)
- `GET|POST /api/products/manage/` — list/create products (authenticated)
- `GET|PATCH|DELETE /api/products/manage/{id}/` — product detail
- `POST /api/products/manage/{id}/submit/` — submit for approval
- `POST /api/products/manage/{id}/approve/` — approve product
- `POST /api/products/manage/{id}/reject/` — reject product

#### Seed Data
- Management command (`python manage.py seed_data`) seeds two businesses with users across all roles and sample products in various states

---

### Frontend (Next.js + Tailwind CSS)

#### Pages & Features
- **Public homepage** — hero section, product grid (approved only), features section, CTA, footer
- **Login** — JWT login with error handling
- **Register** — creates a business + admin account in one form
- **Dashboard** — stat cards (total/approved/pending/draft), quick action links, recent products list
- **Products management** — full table with status filter tabs (All/Draft/Pending/Approved), create/edit/submit/approve/reject/delete actions per role
- **Users management** — admin-only; inline create form, delete with confirmation

#### UI & Design
- Polished blue design system built entirely with Tailwind CSS utility classes
- Custom global component classes (`btn-primary`, `input-field`, `label`, `card`) defined in `globals.css`
- Active navigation link highlighting via `usePathname`
- Role badges and product status badges as reusable components
- Fully responsive — mobile hamburger menu, responsive grids
- Image optimization via Next.js `<Image>` with `remotePatterns` configured for Unsplash

#### Auth & State
- `AuthContext` — React Context wrapping the whole app, manages `user`, `isAuthenticated`, `login`, `logout`
- Tokens stored in `localStorage`; Axios interceptor attaches `Authorization: Bearer` header on every request
- Automatic token refresh on 401 responses via Axios response interceptor
- `ProtectedRoute` component guards all dashboard pages

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend framework | Django + Django REST Framework | 4.2+ |
| Authentication | SimpleJWT | latest |
| Database | SQLite3 | — |
| CORS | django-cors-headers | latest |
| Frontend framework | Next.js (App Router) | 14.2.35 |
| UI language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.1 |
| HTTP client | Axios | 1.13.5 |

---

## Prerequisites

Install these before anything else:

### Python (3.10 or higher)
- **Windows:** Download from https://www.python.org/downloads/ — check **"Add Python to PATH"** during install
- **Mac:** `brew install python`
- **Linux:** `sudo apt update && sudo apt install python3 python3-pip python3-venv`

Verify: `python3 --version`

### Node.js (18 or higher)
- **All platforms:** https://nodejs.org/ (LTS version)
- **Mac:** `brew install node`
- **Linux:** `sudo apt install nodejs npm`

Verify: `node --version` and `npm --version`

### Git
- **Windows:** https://git-scm.com/downloads
- **Mac:** `brew install git`
- **Linux:** `sudo apt install git`

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/DaphneDana/Baisoft-marketplace.git
cd Product-marketplace-baisoft
```

### 2. Set up the backend

```bash
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate it:
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows (Command Prompt)
venv\Scripts\Activate.ps1       # Windows (PowerShell)

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed sample data (test users, businesses, products)
python manage.py seed_data
```

### 3. Set up the frontend

Open a **new terminal** (keep the backend terminal open):

```bash
cd frontend
npm install
```

---

## Running the Project

You need **two terminals running simultaneously**.

### Terminal 1 — Backend

```bash
cd backend
source venv/bin/activate    # Mac/Linux  |  venv\Scripts\activate  (Windows)
python manage.py runserver
```

Backend API available at: **http://localhost:8000**

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

App available at: **http://localhost:3000**

Open **http://localhost:3000** in your browser.

---

## Test Accounts

All test account passwords are `password123`

| Username | Role | Business | Permissions |
|---|---|---|---|
| `acme_admin` | Admin | Acme Corp | Full access to everything |
| `acme_editor` | Editor | Acme Corp | Create and edit products |
| `acme_approver` | Approver | Acme Corp | Approve or reject products |
| `acme_viewer` | Viewer | Acme Corp | View only |
| `globex_admin` | Admin | Globex Inc | Full access (own business) |

---

## How It Works

### Roles & Permissions

| Role | Create/Edit Products | Approve/Reject | Manage Users | View Products |
|------|---------------------|----------------|--------------|---------------|
| Admin | Yes | Yes | Yes | Yes |
| Editor | Yes | No | No | Yes |
| Approver | No | Yes | No | Yes |
| Viewer | No | No | No | Yes |

### Product Approval Workflow

```
Draft  →  [Editor/Admin submits]  →  Pending Approval
                                           |
                          ┌────────────────┴────────────────┐
                          ↓                                  ↓
                       Approved                           Rejected
                  (visible publicly)                  (back to Draft)
```

- Products are created as **Draft** by Editors or Admins
- The author submits the draft for review
- An Approver or Admin then approves or rejects it
- Only **Approved** products appear on the public homepage

### Business Isolation

Every user belongs to exactly one business. Users can only see and manage data belonging to their own business. An Acme Corp admin cannot see Globex Inc products or users, and vice versa. This is enforced at the queryset level in the backend — not just the frontend.

---

## Tech Decisions & Assumptions

### SQLite for the database
SQLite was chosen for simplicity in development and local setup. No separate database server is required. For a production deployment, this would be swapped for PostgreSQL.

### JWT stored in localStorage
Tokens are stored in `localStorage` for simplicity. In a production app, `httpOnly` cookies would be more secure against XSS. The tradeoff was accepted here in favour of straightforward implementation.

### Single shared `api.ts` Axios instance
All API calls go through one Axios instance with a request interceptor (attaches the token) and a response interceptor (handles 401s and triggers token refresh). This keeps auth logic in one place rather than duplicated across every page.

### No email verification on registration
It was assumed the register flow goes straight to an active account. Email verification was not part of the requirements.

### Roles are fixed at the database level
The four roles (Admin, Editor, Approver, Viewer) are seeded into the database. Roles cannot be created or deleted via the API — only assigned to users. This was a deliberate simplification to avoid a full role-management UI.

### Business-scoped user management
Admins can only create/delete users within their own business. There is no super-admin concept across businesses.

### Image URL field instead of file upload
Products use an `image_url` field pointing to an external image rather than a file upload system. This avoids the need for media file storage configuration (e.g. AWS S3) in a local development context.

### Frontend uses Next.js App Router
The project uses the Next.js 14 App Router (`/src/app`) rather than the older Pages Router. All dashboard pages are client components (`'use client'`) since they depend heavily on React state and browser APIs (localStorage for tokens).

---

## Known Limitations

- **No pagination UI** — the API supports `results`/pagination fields but the frontend displays all items at once. This would be a problem with large datasets.
- **No search or sorting** — the products and users tables have no search bar or column sorting. The products page has status filter tabs but no text search.
- **No role editing** — users can be created and deleted but their role cannot be changed after creation. This would need a PATCH endpoint and an edit UI.
- **No password reset flow** — there is no forgot password or reset password feature.
- **SQLite is not production-ready** — the database file is local; concurrent writes and large datasets would require PostgreSQL.
- **No email notifications** — the approval workflow does not send any notifications when a product is submitted, approved, or rejected.
- **No image upload** — products require an external image URL. There is no file upload or image hosting integration.
- **CORS is open to localhost:3000 only** — the backend CORS configuration only allows requests from `http://localhost:3000`. Changing the frontend port requires updating Django settings.

---

## Project Structure

```
Product-marketplace-baisoft/
├── backend/
│   ├── accounts/           # User, Business, Role models + auth endpoints
│   ├── products/           # Product model + CRUD + approval workflow
│   ├── marketplace/        # Django settings, root URL config
│   ├── manage.py
│   ├── db.sqlite3          # Local SQLite database (gitignored in production)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   │   ├── page.tsx             # Public homepage
│   │   │   ├── login/               # Login page
│   │   │   ├── register/            # Register page
│   │   │   └── dashboard/           # All protected dashboard pages
│   │   ├── components/     # Reusable UI components (Navbar, ProductCard, etc.)
│   │   ├── context/        # AuthContext (global auth state)
│   │   └── lib/            # Axios API client
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── package.json
└── README.md
```

---

## Troubleshooting

**`python3 not found`** — Try `python` instead of `python3` (common on Windows)

**`No module named django`** — Virtual environment is not activated. Run `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)

**Port already in use** — Another process is on port 8000 or 3000:
```bash
python manage.py runserver 8001    # use a different backend port
```
If you change the backend port, update `frontend/src/lib/api.ts` to match.

**CORS error in browser console** — The backend must be running on port 8000. Check that both servers are running and the backend URL in `api.ts` matches.

**Blank dashboard / no data loading** — Check that the backend is running and the database is migrated. If you skipped `seed_data`, the dashboard will show zeros — that's expected until products are created.
