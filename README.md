# Taskora — AbleSpace Task Management System

A modern, production-ready, full-stack Task Management System engineered for high performance, deterministic multi-tenant workspace isolation, and seamless user interaction. Built as part of the **AbleSpace Full Stack Developer Technical Assessment**.

---

## 🚀 Overview

Taskora provides teams and individual educators with an intuitive, real-time workspace to manage tasks, plan projects, track statuses through Kanban and List views, organize tasks with custom colored labels, manage subtask hierarchies, and collaborate efficiently.

### Key Capabilities
- **Dual Authentication**: Instant passwordless **Guest Login** (with automatic session reuse and secure HttpOnly cookie persistence) alongside **Clerk Google OAuth**.
- **Interactive Kanban Board & List Views**: Real-time task status tracking (`Backlog`, `To Do`, `In Progress`, `Completed`, `On Hold`).
- **Project Workspaces**: Full project lifecycle management, task assignments, and live task count metrics.
- **Dynamic Colored Labels**: Workspace-isolated labels with custom color swatches and instant inline creation.
- **Hierarchical Subtasks & Relationships**: Circular dependency prevention, self-parenting guards, and relational cascading.
- **Advanced Filtering & Search**: Instant debounced search combined with multi-criteria status, priority, assignee, label, and project filtering.
- **Strict Multi-Tenant Isolation**: Server-side workspace scoping ensuring zero cross-tenant data leakage.
- **Theme Persistence**: Complete Light / Dark theme support with no theme flashing.
- **Rate-Limiting & Security**: Throttled public endpoints, DTO validation, and sanitized API responses.

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

---

## 💻 Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js 16.3 (App Router with Turbopack)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS + Shadcn UI primitives
- **State & Caching**: TanStack React Query v5 with targeted invalidation
- **HTTP Client**: Axios with unified error interceptors
- **Theming**: `next-themes` (Dark / Light / System)
- **Icons**: Lucide React + Phosphor Icons

### Backend (`/server`)
- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database & ORM**: PostgreSQL + Prisma ORM 6
- **Security & Rate Limiting**: `@nestjs/throttler`, `@nestjs/jwt`, `cookie-parser`
- **Validation**: `class-validator` + `class-transformer`
- **Testing**: Bun Test suite for high-value unit & integration testing

---

## 📂 Project Structure

```text
.
├── client/                     # Next.js Frontend Application
│   ├── app/                    # App Router routes ((auth), (workspace), etc.)
│   ├── components/             # Reusable UI components & Auth boundaries
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
│   │   ├── labels/             # Labels controller and service
│   │   ├── projects/           # Projects controller and service
│   │   ├── tasks/              # Tasks controller, service, DTOs
│   │   ├── users/              # User management and guest transactions
│   │   └── workspaces/         # Workspace boundary resolution
│   └── test/                   # Automated unit test suite (Bun test)
│
└── docs/                       # Product understanding & technical documentation
    └── AbleSpace-Take-Data-Product-Analysis.md
```

---

## 🗄️ Database Schema & Entities

- **User**: Represents guest users (`isGuest: true`) or Clerk-authenticated users with profile metadata.
- **Workspace**: Root tenancy boundary. Every resource (Task, Project, Label, Member) strictly belongs to a Workspace.
- **WorkspaceMember**: Connects Users to Workspaces with roles (`OWNER`, `MEMBER`).
- **Project**: Groups related tasks within a workspace and computes total task counts.
- **Task**: Main entity supporting:
  - `title`, `description`, `status` (`BACKLOG`, `TODO`, `DOING`, `COMPLETED`, `ON_HOLD`)
  - `priority` (`NONE`, `URGENT`, `HIGH`, `MEDIUM`, `LOW`)
  - `startDate`, `dueDate` (with `startDate <= dueDate` validation)
  - `projectId`, `reporterId`, `parentTaskId` (with circular dependency prevention)
- **Label**: Custom tags with name and hex `color` assigned to tasks via `TaskLabel`.

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/guest` | Create or reuse guest session (Rate-limited) | Public |
| `POST` | `/api/auth/sync` | Sync Clerk user with PostgreSQL database | Clerk Bearer |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Guest / Clerk |
| `POST` | `/api/auth/logout` | Clear guest session cookie | Guest / Clerk |
| `GET` | `/api/tasks` | List tasks (supports search, filter by status, priority, etc.) | Required |
| `POST` | `/api/tasks` | Create a new task | Required |
| `GET` | `/api/tasks/:id` | Get task details by ID | Required |
| `PATCH` | `/api/tasks/:id` | Update task properties | Required |
| `DELETE` | `/api/tasks/:id` | Delete a task | Required |
| `GET` | `/api/projects` | List workspace projects with task counts | Required |
| `POST` | `/api/projects` | Create a project | Required |
| `PATCH` | `/api/projects/:id` | Update project name / description | Required |
| `DELETE` | `/api/projects/:id` | Delete project (sets task projectId to null) | Required |
| `GET` | `/api/labels` | List workspace labels | Required |
| `POST` | `/api/labels` | Create a custom label with color | Required |

---

## ⚙️ Local Development Setup

### Prerequisites
- [Bun](https://bun.sh) (v1.1+) or Node.js (v20+)
- PostgreSQL database instance (local or hosted, e.g. Neon / Supabase)

### 1. Backend Setup (`/server`)

```bash
cd server
bun install

# Configure environment variables (create .env from .env.example)
cp .env.example .env

# Generate Prisma Client & Run Migrations
bun run prisma:generate
bun run prisma:migrate

# Run automated tests
bun test

# Start backend development server (Port 5001)
bun run start:dev
```

### 2. Frontend Setup (`/client`)

```bash
cd client
bun install

# Configure environment variables (create .env.local from .env.example)
cp .env.example .env.local

# Start Next.js development server (Port 3000)
bun dev
```

Visit **`http://localhost:3000`** in your browser to interact with Taskora.

---

## 🧪 Testing

The backend includes automated tests covering:
- **Authentication**: Guest session creation, session token reuse, user retrieval, unauthorized guards.
- **Task Management**: Workspace isolation, valid date ranges, parent cycle prevention, status/priority mutations.
- **Projects**: Workspace-scoped CRUD, task count calculations, cascade safety.
- **Labels**: Unique label constraints per workspace, alphabetical sorting, color assignment.

To run the test suite:
```bash
cd server && bun test
```

---

## 🎨 Theme & Responsiveness

- **Persistent Theming**: Supports Light, Dark, and System modes stored in `localStorage` without flash of unstyled content.
- **Responsive Layout**: Validated from 375px (iPhone SE) to 1920px (Desktop Display) with smooth horizontal Kanban scrolling, responsive dialogs, and mobile drawers.

---

## 📄 Part 2: Product Understanding Analysis

For Part 2 of the assessment focusing on the AbleSpace **"Take Data"** IEP workflow and UX optimization recommendations, please refer to the dedicated analysis:
👉 [**AbleSpace Take Data Product Analysis**](docs/AbleSpace-Take-Data-Product-Analysis.md)
