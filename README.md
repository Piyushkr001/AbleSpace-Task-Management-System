# Taskora — AbleSpace Task Management System

A full-stack task management application built with production-oriented architecture, reliable workspace isolation, responsive interactivity, and clear workflow management. Built as part of the **AbleSpace Full Stack Developer Technical Assessment**.

---

## 🚀 Overview

Taskora provides workspace-scoped task and project management with support for structured task membership, planning projects, tracking statuses through Kanban Board and List views, organizing tasks with custom colored labels, and managing subtask hierarchies.

### Key Capabilities
- **Dual Authentication**: Instant passwordless **Guest Login** (with automatic session reuse and secure HttpOnly cookie persistence) alongside **Clerk Google OAuth**.
- **Interactive Kanban Board & List Views**: Task tracking across 5 core statuses (`Backlog`, `To Do`, `In Progress`, `Completed`, `On Hold`).
- **Project Workspaces**: Full project lifecycle management, task assignments, and live task count metrics.
- **Dynamic Colored Labels**: Workspace-isolated labels with custom 6-character hex color swatches and instant inline creation.
- **Hierarchical Subtasks & Relationships**: Circular dependency prevention, self-parenting guards, and relational cascading.
- **Advanced Filtering & Search**: Instant debounced search combined with task filtering by status, priority, assignee and label, alongside dedicated project-scoped task views.
- **Workspace-Scoped Data Access**: Backend resource operations are scoped to the authenticated workspace to prevent direct cross-workspace resource access through supported APIs.
- **Theme Persistence**: Theme initialization is configured to minimize incorrect-theme flashing during hydration across Light, Dark, and System modes.
- **Rate-Limiting & Security**: Throttled public endpoints, DTO validation with strict transformation/whitelisting, and sanitized API responses.

---

## 🌐 Live Demo & Deployment

- **Live Application Frontend**: `https://your-production-app.vercel.app` *(Manual Action: Replace with deployed frontend URL)*
- **Live Backend API**: `https://your-production-api.onrender.com/api` *(Manual Action: Replace with deployed backend API URL)*

---

## 📸 Screenshots

```text
[Insert actual screenshot – Kanban Board View with Backlog and Columns]
[Insert actual screenshot – Task List View with Filters]
[Insert actual screenshot – Task Detail View with Subtasks and Labels]
[Insert actual screenshot – Projects Overview and Detail View]
```

---

## 🏗️ Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 (App Router)              │
│       Tailwind CSS + Shadcn UI + TanStack Query v5     │
└───────────────────────────┬────────────────────────────┘
                            │ (REST API via Axios)
                            ▼
┌────────────────────────────────────────────────────────┐
│                      NestJS 11                         │
│   UnifiedAuthGuard (Guest JWT Cookie + Clerk Bearer)   │
│   ThrottlerModule + Global ValidationPipes + DTOs      │
└───────────────────────────┬────────────────────────────┘
                            │ (Prisma Client ORM)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                   │
│        (Workspaces, Users, Projects, Tasks, Labels)    │
└────────────────────────────────────────────────────────┘
```

### Workspace Tenancy Model
Taskora provisions and operates on **one workspace per authenticated principal**. All queries and mutations (tasks, projects, labels, members) strictly enforce workspace boundaries on the server side using the resolved workspace ID of the requesting user.

---

## 💻 Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js 16.3 (App Router with Turbopack)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS + Shadcn UI primitives
- **State & Caching**: TanStack React Query v5 with targeted invalidation
- **HTTP Client**: Centralized Axios API client with normalized API error handling
- **Theming**: `next-themes` (Dark / Light / System)
- **Icons**: Lucide React + Phosphor Icons (`@phosphor-icons/react`)

### Backend (`/server`)
- **Framework**: NestJS 11
- **Language**: TypeScript 5.x
- **Database & ORM**: PostgreSQL + Prisma ORM 6
- **Security & Rate Limiting**: `@nestjs/throttler`, `@nestjs/jwt`, `cookie-parser`
- **Validation**: `class-validator` + `class-transformer`
- **Testing**: Bun Test suite for focused backend service unit tests

---

## 📂 Project Structure

```text
.
├── client/                     # Next.js Frontend Application
│   ├── app/                    # App Router routes ((auth), (workspace), etc.)
│   ├── components/             # Reusable UI components, Auth boundaries, theme
│   ├── features/
│   │   ├── auth/               # Auth API, components, and state
│   │   ├── labels/             # Label management, LabelBadge, and hooks
│   │   ├── projects/           # Projects CRUD, ProjectPicker, and hooks
│   │   ├── tasks/              # Tasks board/list views, dialogs, details
│   │   └── workspace/          # Workspace navigation, header, and sidebar
│   ├── hooks/                  # Custom React hooks (useApiAuth, useMobile)
│   └── lib/                    # API client, Axios configuration, utils
│
├── server/                     # NestJS Backend API
│   ├── prisma/                 # Prisma schema and migrations
│   ├── src/
│   │   ├── auth/               # Dual auth service, guards, controllers
│   │   ├── config/             # Environment validation and configuration
│   │   ├── labels/             # Labels controller, service, DTOs
│   │   ├── projects/           # Projects controller, service, DTOs
│   │   ├── tasks/              # Tasks controller, service, DTOs
│   │   ├── users/              # User management and guest transactions
│   │   └── workspaces/         # Workspace boundary resolution
│   └── test/                   # Focused backend service unit tests (Bun test)
│
└── docs/                       # Product understanding & technical documentation
    └── AbleSpace-Take-Data-Product-Analysis.md
```

---

## 🗄️ Database Schema & Entities

- **User**: Represents guest users (`isGuest: true`) or Clerk-authenticated users with profile metadata.
- **Workspace**: Root tenancy boundary. Every resource (Task, Project, Label, Member) belongs to a Workspace.
- **WorkspaceMember**: Connects Users to Workspaces with roles (`OWNER`, `MEMBER`).
- **Project**: Groups related tasks within a workspace and calculates task counts.
- **Task**: Core entity supporting:
  - `title` (max 255 chars), `description` (max 2000 chars)
  - `status` (`BACKLOG`, `TODO`, `DOING`, `COMPLETED`, `ON_HOLD`)
  - `priority` (`NONE`, `URGENT`, `HIGH`, `MEDIUM`, `LOW`)
  - `startDate`, `dueDate` (with `startDate <= dueDate` validation)
  - `projectId`, `reporterId`, `parentTaskId` (with circular dependency prevention)
- **Label**: Custom tags with name and 6-character hex `color` assigned to tasks via `TaskLabel`.

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health check | Public |
| `POST` | `/api/auth/guest` | Create or reuse guest session (Rate-limited) | Public |
| `POST` | `/api/auth/sync` | Sync Clerk user with PostgreSQL database | Clerk Bearer |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Guest / Clerk |
| `POST` | `/api/auth/logout` | Clear guest session cookie | Public |
| `GET` | `/api/tasks` | List top-level tasks (`parentTaskId = null` by default; pass `?parentTaskId=<id>` for subtasks; supports search & filters) | Required |
| `POST` | `/api/tasks` | Create a new task | Required |
| `GET` | `/api/tasks/:id` | Get task details by ID | Required |
| `PATCH` | `/api/tasks/:id` | Update task properties | Required |
| `DELETE` | `/api/tasks/:id` | Delete a task | Required |
| `GET` | `/api/projects` | List workspace projects with top-level task counts | Required |
| `POST` | `/api/projects` | Create a project | Required |
| `GET` | `/api/projects/:id` | Get project details by ID | Required |
| `PATCH` | `/api/projects/:id` | Update project name / description | Required |
| `DELETE` | `/api/projects/:id` | Delete project (disconnects associated tasks) | Required |
| `GET` | `/api/labels` | List workspace labels | Required |
| `POST` | `/api/labels` | Create a custom label with hex color | Required |
| `PATCH` | `/api/labels/:id` | Update label name / hex color | Required |
| `DELETE` | `/api/labels/:id` | Delete label | Required |
| `GET` | `/api/workspaces/me/members` | List members of current workspace | Required |

> **Task Query Behavior Note**: `GET /api/tasks` queries top-level tasks (`parentTaskId: null`) by default so that Kanban and List views render primary work items. Subtasks are fetched deterministically by querying `GET /api/tasks?parentTaskId=<taskId>`.

---

## 🔐 Authentication & Guest Login Flow

1. **Guest Login**: When a user clicks *"Continue as Guest"*, the backend creates (or safely reuses an unexpired) guest account and provisions a default workspace. It signs a JWT and sets an `HttpOnly`, `SameSite=Lax` (or `None` for cross-origin HTTPS production) cookie.
2. **Clerk Authentication**: When signed in via Clerk, the frontend sends the Clerk Bearer token in the `Authorization` header. The backend verifies the token and synchronizes the user profile.
3. **Unified Guard**: `UnifiedAuthGuard` transparently handles both authentication schemes, ensuring seamless access across API routes.

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/taskora?schema=public"
CLIENT_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-at-least-32-chars-long"
JWT_EXPIRES_IN="7d"
COOKIE_NAME="taskora_guest_session"
CLERK_SECRET_KEY="sk_test_..."
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:5001/api"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/tasks"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/tasks"
```

---

## 🛠️ Local Development Setup

### Prerequisites
- **Runtime**: [Bun](https://bun.sh) (v1.x) is recommended/required for the documented installation and test workflow. Node.js (v20+) may be used for compatible production runtime environments.
- **Database**: PostgreSQL database instance (local or hosted, e.g. Neon / Supabase)

### 1. Backend Setup (`/server`)

```bash
cd server
bun install

# Configure environment variables
cp .env.example .env

# Generate Prisma Client & Run Migrations
bun run prisma:generate
bun run prisma:migrate

# Run tests
bun test

# Start development server
bun run start:dev
```

### 2. Frontend Setup (`/client`)

```bash
cd client
bun install

# Configure environment variables
cp .env.example .env.local

# Start Next.js development server
bun dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🗃️ Database Setup & Prisma Commands

- **Development Migration**:
  ```bash
  bun run prisma:migrate
  # (Executes prisma migrate dev)
  ```
- **Production Migration**:
  ```bash
  bun run prisma:migrate:deploy
  # (Executes prisma migrate deploy)
  ```
- **Generate Client**:
  ```bash
  bun run prisma:generate
  # (Executes prisma generate)
  ```
- **Prisma Studio**:
  ```bash
  bun run prisma:studio
  # (Opens Prisma Studio at http://localhost:5555)
  ```

---

## 🧪 Running Tests

The backend includes focused backend service unit tests covering:
- **Authentication**: Guest session creation/reuse, user lookup, Clerk synchronization, and logout behavior.
- **Tasks**: Task domain rules, relationship validation, date rules (`startDate <= dueDate`), parent cycle prevention, and update behavior.
- **Projects**: Workspace-scoped Project service CRUD and top-level task counts.
- **Labels**: Creation, duplicate handling, update/delete, and workspace isolation.

```bash
cd server
bun test
```

---

## 🎨 Theme Support & Responsive Design

- **Persistent Theming**: Full Light, Dark, and System mode support stored in `localStorage` without layout shifts or flashing.
- **Responsive Layout**: Tested across mobile (375px–430px), tablet (768px–1024px), and desktop (1280px–1920px) viewports with horizontal Kanban board scrolling and responsive modal dialogs.

---

## 🚀 Production Deployment & Database Migrations

### Backend Deployment (e.g. Render / Railway / Fly.io)
1. Build Command: `bun run build` (which runs `prisma generate && nest build`).
2. Release Command / Pre-deploy: `bun run prisma:migrate:deploy`.
3. Start Command: `bun run start:prod` (or `node dist/main`).
4. Ensure `NODE_ENV=production`, `CLIENT_URL` matches your frontend domain, and database URL is securely provided.

### Frontend Deployment (e.g. Vercel)
1. Framework Preset: Next.js.
2. Build Command: `next build`.
3. Set environment variables: `NEXT_PUBLIC_API_URL` pointing to the production backend API endpoint and Clerk keys.

---

## 📐 Figma Deviations

```text
No intentional major deviations from the supplied Figma reference are currently known.
The implementation follows the supplied navigation structure, Kanban column states, task card metadata layout, project detail cards, and theme specifications.
```

---

## ⚠️ Known Limitations

- **Board Column Ordering**: Tasks in Kanban board columns are ordered by creation timestamp; manual drag-and-drop ordering is not implemented as it was not required in the verified design.
- **Single Active Workspace**: Taskora currently provisions and operates on one workspace per authenticated principal; UI workspace switching is not exposed.
- **Workspace Invitations**: Workspace invitation and member-management workflows are not exposed in the current assessment UI.
- **Label Editing**: Labels are created inline and assigned/removed from tasks; full label color/name updating is exposed via API but not in a dedicated standalone settings page.

---

## 📄 Part 2: Product Understanding Analysis

For Part 2 of the assessment focusing on the AbleSpace **"Take Data"** IEP workflow, please refer to:
👉 [**AbleSpace Take Data Product Analysis**](docs/AbleSpace-Take-Data-Product-Analysis.md)
