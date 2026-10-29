# Link-in-Bio Page Builder

A full-stack link-in-bio platform that lets creators build customizable public landing pages (`/u/<handle>`), manage links with drag-and-drop reordering, enforce strict server-side scheduling, and track 30-day analytics.

## Live Demo & Repository

- **Repository:** Public GitHub repository (created for this assignment)
- **Demo Profile URL:** `http://localhost:3000/u/johndoe`
- **Dashboard URL:** `http://localhost:3000/dashboard`

## Tech Stack

- **Framework:** Next.js (App Router, React 19 / Server & Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Database & ORM:** SQLite via Prisma ORM (zero-config local persistence, production-ready for PostgreSQL)
- **Drag & Drop:** `@hello-pangea/dnd`
- **Testing:** Vitest

## Getting Started

### 1. Prerequisites
- Node.js 20+ installed
- npm installed

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd link-in-bio
npm install --legacy-peer-deps

### Critical Implementation Details

1. **Server-Side Link Scheduling:**
   - Visibility checks run entirely on the server via Prisma `lte` and `gte` filters comparing against `new Date()`.
   - Inactive, past, and future links are never serialized into the API response or sent to the client browser.
   - Verified via automated unit tests in `tests/backend.test.ts`.

2. **Handle Validation & Reserved Word Protection:**
   - Validates character patterns (`^[a-z0-9_-]+$`) and minimum/maximum length constraints (3–30 chars).
   - Blocks reserved routing identifiers (`admin`, `api`, `auth`, `dashboard`, `root`, etc.).
   - Database enforces a strict `@unique` constraint index on `handle` to prevent collisions.
