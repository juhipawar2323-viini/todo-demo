# TaskMaster — Production-Ready Full-Stack Todo Application

> A robust, secure, and modern full-stack Todo application built strictly with **React.js**, **Node.js/Express (MVC Architecture)**, and **Supabase PostgreSQL** secured with **Row Level Security (RLS)**.

---

## 1. Project Overview

TaskMaster is an enterprise-grade full-stack task management platform. It enforces a strict separation of concerns:
- The **React frontend** communicates exclusively through a custom REST API.
- The **Node.js/Express backend** implements the Model-View-Controller (MVC) architectural pattern.
- The **Supabase PostgreSQL database** protects multi-tenant data using native Row Level Security (RLS) policies and bcrypt password hashing.
- Under **no circumstances** does the React client have direct access to the database or privileged Supabase credentials.

---

## 2. Technologies Used

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React.js (v18) | Pure React with Hooks and Context API |
| **Routing** | React Router DOM (v6) | Declarative client-side routing & Protected Routes |
| **Styling** | Vanilla CSS | Custom Glassmorphic Design System with HSL palettes & dark mode |
| **Icons** | Lucide React | Modern, lightweight SVG iconography |
| **Backend** | Node.js (v24) & Express.js (v4) | RESTful API adhering to MVC pattern |
| **Database** | Supabase PostgreSQL 17 | Relational database with automated timestamps & UUID keys |
| **Security** | Supabase RLS | Strict Row Level Security policies per user |
| **Auth** | Custom JWT + bcryptjs | Token-based authentication, salted password hashing |
| **Environment** | dotenv | Strictly segregated `.env` configurations |

---

## 3. Architecture

```text
                           TASKMASTER ARCHITECTURE
                                      │
        ┌─────────────────────────────┴─────────────────────────────┐
        │                                                           │
        ▼                                                           ▼
  frontend-todo                                               backend-todo
  (React Client)                                          (Node.js + Express)
  Port: 3000                                                  Port: 5000
        │                                                           │
        │ HTTP REST Requests (Authorization: Bearer <JWT>)           │
        └─────────────────────────────┬─────────────────────────────┘
                                      ▼
                           EXPRESS MVC ARCHITECTURE
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
   Middleware                     Routes                       Controllers
   - authMiddleware               - /api/auth                  - authController
   - errorMiddleware              - /api/todos                 - todoController
   - cors & body-parser           - /api/health                     │
                                                                    ▼
                                                                Services
                                                                - authService
                                                                - todoService
                                                                    │
                                                                    ▼
                                                                  Models
                                                                - userModel
                                                                - todoModel
                                                                    │
                                                                    ▼
                                                           Supabase PostgreSQL
                                                           - users (RLS)
                                                           - todos (RLS)
```

---

## 4. Folder Structure

```text
todo-fullstack/
│
├── frontend-todo/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.js
│   │   │   ├── Loading.js
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── TodoForm.js
│   │   │   ├── TodoItem.js
│   │   │   └── TodoList.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useTodos.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   └── TodosPage.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── todoService.js
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   └── tokenStorage.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── webpack.config.js
│
├── backend-todo/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── todoController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── todoModel.js
│   │   │   └── userModel.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── index.js
│   │   │   └── todoRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── todoService.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── response.js
│   │   ├── app.js
│   │   └── server.js
│   ├── test_api.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 5. Supabase Setup

1. The project uses an existing Supabase PostgreSQL instance:
   - **Project URL:** `https://wicascsluggzcvynzvom.supabase.co`
2. Tables and extensions are provisioned via Supabase SQL migrations.
3. UUID generation is handled by `gen_random_uuid()`.
4. Automated triggers update `updated_at` timestamps on row modifications.

---

## 6. Database Schema

### `public.users` Table
Stores authenticated user accounts. Plaintext passwords are **NEVER** stored.

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_users_email ON public.users(email);
```

### `public.todos` Table
Stores individual user tasks with strict foreign-key referencing to `public.users`.

```sql
CREATE TABLE public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_todos_user_id ON public.todos(user_id);
```

---

## 7. Row Level Security (RLS) Policies

Row Level Security is enabled on all tables:
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
```

### Policies on `public.todos`
- **SELECT:** `Users can view own todos`
  - `USING (user_id = auth.uid())`
- **INSERT:** `Users can create own todos`
  - `WITH CHECK (user_id = auth.uid())`
- **UPDATE:** `Users can update own todos`
  - `USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())`
- **DELETE:** `Users can delete own todos`
  - `USING (user_id = auth.uid())`
- **SERVICE ROLE:** `Service role has full access to todos`
  - `TO service_role USING (true) WITH CHECK (true)`

### Policies on `public.users`
- **SELECT:** `Users can view own profile`
  - `USING (id = auth.uid())`
- **UPDATE:** `Users can update own profile`
  - `USING (id = auth.uid())`
- **INSERT:** `Allow user registration`
  - `TO public WITH CHECK (true)`
- **SERVICE ROLE:** `Service role has full access to users`
  - `TO service_role USING (true) WITH CHECK (true)`

---

## 8. Environment Variables

### Backend Configuration (`backend-todo/.env`)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://wicascsluggzcvynzvom.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
JWT_SECRET=your_jwt_secret_key_minimum_32_characters_here
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration (`frontend-todo/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

> **Security Note:** `.env` files are excluded from Git via `.gitignore`. Placeholders are documented in `.env.example`.

---

## 9. Backend Installation & Setup

1. Open a terminal and navigate to `backend-todo`:
   ```bash
   cd backend-todo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file (if not already created):
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   *The backend will start on `http://localhost:5000`.*

---

## 10. Frontend Installation & Setup

1. Open a second terminal and navigate to `frontend-todo`:
   ```bash
   cd frontend-todo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start React application:
   ```bash
   npm start
   ```
   *The application will open on `http://localhost:3000`.*

---

## 11. API Documentation

All API responses follow the standard JSON contract:
- **Success:** `{ "success": true, "message": "...", "data": {...} }`
- **Error:** `{ "success": false, "message": "..." }`

### Health Check
- **`GET /api/health`**
  - **Auth:** None
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Todo API is running",
      "data": { "status": "healthy", "timestamp": "...", "uptime": 12.3 }
    }
    ```

### Authentication Endpoints
- **`POST /api/auth/register`**
  - **Body:** `{ "name": "Vinay", "email": "vinay@example.com", "password": "Password123" }`
  - **Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": { "id": "...", "name": "Vinay", "email": "vinay@example.com", "created_at": "..." },
        "token": "<JWT>"
      }
    }
    ```
- **`POST /api/auth/login`**
  - **Body:** `{ "email": "vinay@example.com", "password": "Password123" }`
  - **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "user": { "id": "...", "name": "Vinay", "email": "vinay@example.com" },
        "token": "<JWT>"
      }
    }
    ```
- **`GET /api/auth/me`**
  - **Headers:** `Authorization: Bearer <token>`
  - **Response (200 OK):** `{ "success": true, "data": { "user": {...} } }`

### Todo Endpoints (All require `Authorization: Bearer <token>`)
- **`POST /api/todos`**
  - **Body:** `{ "title": "Learn React", "description": "Practice Hooks" }`
  - **Response (201 Created):** `{ "success": true, "data": { "todo": {...} } }`
- **`GET /api/todos`**
  - **Response (200 OK):** `{ "success": true, "data": { "todos": [...] } }`
- **`GET /api/todos/:id`**
  - **Response (200 OK):** `{ "success": true, "data": { "todo": {...} } }`
- **`PUT /api/todos/:id`**
  - **Body:** `{ "title": "Updated Title", "completed": true }`
  - **Response (200 OK):** `{ "success": true, "data": { "todo": {...} } }`
- **`DELETE /api/todos/:id`**
  - **Response (200 OK):** `{ "success": true, "message": "Todo deleted successfully" }`

---

## 12. Automated API Verification

Run the included automated backend test suite covering 13 end-to-end security and CRUD assertions:
```bash
cd backend-todo
node test_api.js
```

Assertions validated:
1. Health check availability (`200 OK`)
2. User registration and safe JWT issuance (`201 Created`)
3. Duplicate registration conflict prevention (`409 Conflict`)
4. Password verification and user login (`200 OK`)
5. Profile retrieval via `/api/auth/me` (`200 OK`)
6. Creating a todo automatically tied to authenticated user (`201 Created`)
7. Fetching todos scoped to the owner (`200 OK`)
8. Creating a separate User B
9. Cross-user isolation: User B cannot read User A's todo (`404 Not Found`)
10. Cross-user isolation: User B cannot modify User A's todo (`404 Not Found`)
11. Cross-user isolation: User B cannot delete User A's todo (`404 Not Found`)
12. Updating todo by owner (`200 OK`)
13. Deleting todo by owner (`200 OK`)

---

## 13. Security Considerations & Hardening

1. **Password Hashing:** Passwords are never stored or logged in plain text. Salted bcrypt hashes (`10` salt rounds) are strictly used.
2. **Never Return Hashes:** Queries to the database strip the `password` column before returning responses to the user.
3. **No Direct Supabase Access in Frontend:** Frontend has zero knowledge of Supabase keys; all communication flows through Express.
4. **No Service-Role Key in Frontend:** The privileged `SUPABASE_SERVICE_ROLE_KEY` is confined entirely to the Node server.
5. **CORS Hardening:** Express CORS only whitelists the designated frontend origin.
6. **Input Validation:** Required field checks, regex email validations, and type assertions prevent malformed inputs.
7. **Centralized Error Handling:** Database error codes are translated into user-friendly messages without exposing database internals or stack traces.

---

## 14. Production Deployment Instructions

### Backend Deployment (e.g. Render, Railway, AWS ECS)
1. Push repository to GitHub.
2. In your hosting platform, create a new Web Service pointing to `backend-todo/`.
3. Set Build Command: `npm install`
4. Set Start Command: `node src/server.js`
5. Configure Environment Variables in the hosting dashboard:
   - `PORT=5000` (or host-provided port)
   - `NODE_ENV=production`
   - `SUPABASE_URL=https://<project-ref>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
   - `JWT_SECRET=<strong-random-key>`
   - `FRONTEND_URL=https://<your-frontend-domain>.com`

### Frontend Deployment (e.g. Vercel, Netlify)
1. Connect repository to Vercel/Netlify.
2. Set Root Directory: `frontend-todo`
3. Set Build Command: `npm run build`
4. Set Output Directory: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL=https://<your-backend-domain>.com/api`
6. For single-page app rewrites, configure rewrites so all routes serve `index.html`.
