# EdTech Learning Task Manager – Server

Node.js + Express + MongoDB backend for the EdTech Learning Task Manager.

## Setup

1. Copy `.env.example` to `.env` and update the values:

   - `MONGO_URI` – your MongoDB connection string
   - `JWT_SECRET` – any strong secret string
   - `PORT` – (optional) defaults to 5000

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

All API responses on error follow:

```json
{ "success": false, "message": "..." }
```
