# Open Circuit Solutions

Open Circuit Solutions is a React portfolio site for Dante Ivery, ready to deploy on Netlify with:
- a Create React App frontend in `frontend/`
- Netlify Functions in `frontend/netlify/functions/`
- MongoDB-backed editable content and portfolio storage
- SMTP-powered contact form delivery

## Deploying To Netlify

1. Import the repository into Netlify.
2. Let Netlify use the repo root. The included [netlify.toml](/Users/danteivery/Documents/My Portfolio/netlify.toml) points the build to `frontend/`.
3. Add these environment variables in Netlify:
   - `MONGO_URL`
   - `DB_NAME`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_TOKEN_SALT`
   - `SMTP_SERVER`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
4. Deploy.

## Important Notes

- `MONGO_URL` must be a remote MongoDB connection string such as MongoDB Atlas. `localhost` will not work on Netlify.
- The frontend uses same-origin `/api/*` calls, and Netlify rewrites those to the bundled function automatically.
- Edit mode uses backend authentication and bearer tokens. Content and portfolio write endpoints are protected.
- If the database is not configured, the site still renders default hero/about content, but editing and portfolio persistence require MongoDB.

## Local Setup

1. Copy [backend/.env.example](/Users/danteivery/Documents/My Portfolio/backend/.env.example) to `backend/.env` if you want a local reference for the required variables.
2. Copy [frontend/.env.example](/Users/danteivery/Documents/My Portfolio/frontend/.env.example) to `frontend/.env` if you need local frontend overrides.
3. Install frontend dependencies with `npm install --prefix frontend`.
4. Run the frontend with `npm --prefix frontend start`.

The Netlify production API lives in [frontend/netlify/functions/api.js](/Users/danteivery/Documents/My Portfolio/frontend/netlify/functions/api.js). The original FastAPI version remains in [backend/server.py](/Users/danteivery/Documents/My Portfolio/backend/server.py) as a reference implementation.
