# Job Tracker

A full-stack app for tracking job applications. Built to replace a rudimentary spreadsheet with an intuitive UI and features.

## Features

- Track applications: company, role, location, status, salary (as listed), job posting URL
- Track interview rounds per application (type, date, outcome). Any number of rounds per role allowed
- More to be added in future development

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** PostgreSQL

## Project Structure

```
job-tracker/
  client/      # React frontend (in progress)
  server/      # Express backend
    db/
      schema.sql   # database schema
      index.js     # Postgres connection pool
    index.js        # Express app entry point
```

## Setup

### 1. Database

Create a PostgreSQL database named `job_tracker`, then run the schema:

```bash
psql -U postgres -h localhost -d job_tracker -f server/db/schema.sql
```

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

## Status

Under active development.
