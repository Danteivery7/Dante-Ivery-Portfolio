# Open Circuit Solutions

Open Circuit Solutions is a React + FastAPI portfolio site for Dante Ivery. The frontend lives in `frontend/`, the API lives in `api/` and `backend/`, and the repository is configured to deploy directly to Vercel with a static frontend plus a Python serverless API.

## Deploying To Vercel

1. Import the repository into Vercel.
2. Keep the repository root as the project root.
3. Add these environment variables in Vercel:
   - `MONGO_URL`
   - `DB_NAME`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_TOKEN_SALT`
   - `SMTP_SERVER`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `CORS_ORIGINS`
4. Deploy.

## Important Notes

- `MONGO_URL` must be a remote MongoDB connection string such as MongoDB Atlas. `localhost` will not work on Vercel.
- The frontend defaults to same-origin API requests, so `REACT_APP_BACKEND_URL` is optional for the Vercel deployment in this repo.
- Edit mode now uses backend authentication and bearer tokens. Content and portfolio write endpoints are protected.
- If the database is not configured, the site still renders default hero/about content, but editing and project persistence require MongoDB.

## Local Setup

1. Copy `backend/.env.example` to `backend/.env` and fill in the values.
2. Copy `frontend/.env.example` to `frontend/.env` if you need local frontend overrides.
3. Install frontend dependencies with `npm install --prefix frontend`.
4. Run the frontend with `npm --prefix frontend start`.

The backend API is exposed through `backend/server.py`, and Vercel uses `api/index.py` as the serverless entrypoint.
