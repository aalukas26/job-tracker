# Job Tracker

A full-stack app for tracking job applications. Built to replace a rudimentary spreadsheet with a relational database, a REST API, and a React UI.

## Features

- Track applications: company, role, location, status, salary (as listed), job posting URL
- Update an application's status (applied, interviewing, offer, rejected, accepted) from a dropdown
- Track interview rounds per application, any number of rounds per role, added dynamically
- Full editing of interview details (type, date, outcome, notes) and deletion of individual rounds
- Form validation on required fields, with user-facing error messages if a request fails

## Tech Stack

- **Frontend:** React (Vite), plain CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

## Project Structure

```
job-tracker/
  client/                # React frontend
    src/
      App.jsx            # applications list, create/delete/status-update logic
      Interviews.jsx      # per-application interview list, create/edit/delete logic
      App.css, index.css # styling
  server/                # Express backend
    db/
      schema.sql         # database schema
      index.js           # Postgres connection pool
    index.js              # Express app entry point + all API routes
```

## Setup

### 1. Database

Create a PostgreSQL database named `job_tracker`, then run the schema:

```bash
psql -U postgres -h localhost -d job_tracker -f server/db/schema.sql
```

Optionally, load sample data so you have something to look at right away:

```bash
psql -U postgres -h localhost -d job_tracker -f server/db/seed.sql
```

(Note: this clears and resets the `applications`/`interviews` tables, so only run it on a fresh database, not one you're already tracking real applications in.)

### 2. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` with your database credentials:

```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_tracker
```

Then run:

```bash
npm run dev
```

The server starts on `http://localhost:3001`.

### 3. Frontend

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## API

| Method | Route | Description |
|---|---|---|
| GET | `/api/applications` | List all applications |
| POST | `/api/applications` | Create an application |
| PATCH | `/api/applications/:id` | Update an application's status |
| DELETE | `/api/applications/:id` | Delete an application |
| GET | `/api/applications/:id/interviews` | List interviews for an application |
| POST | `/api/applications/:id/interviews` | Add an interview round |
| PATCH | `/api/interviews/:id` | Update an interview |
| DELETE | `/api/interviews/:id` | Delete an interview |

## Status

Core features complete: full CRUD for applications and interviews, error handling, and input validation. Not yet deployed, runs locally. Automated tests not yet added.
