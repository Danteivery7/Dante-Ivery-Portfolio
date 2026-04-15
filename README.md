# Open Circuit Solutions

Open Circuit Solutions is a React portfolio site for Dante Ivery, ready to deploy on Netlify with:
- a Create React App frontend in `frontend/`
- Netlify Functions in `frontend/netlify/functions/`
- MongoDB-backed editable content and portfolio storage
- Netlify Blobs persistence when MongoDB is not configured
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

Optional but recommended if you are not using MongoDB:
- `NETLIFY_BLOBS_SITE_ID`
- `NETLIFY_BLOBS_TOKEN`

## Important Notes

- If `MONGO_URL` is set, the site stores edits and portfolio data in MongoDB.
- If `MONGO_URL` is not set, the site stores edits in Netlify Blobs.
- Netlify Blobs using only the built-in function runtime works in `eventual` consistency mode, which is permanent but can briefly lag across browsers and locations.
- If you want Netlify Blobs with `strong` consistency, add `NETLIFY_BLOBS_SITE_ID` and `NETLIFY_BLOBS_TOKEN` in Netlify so the function can use the Netlify API-backed store path.
- `MONGO_URL` must be a remote MongoDB connection string such as MongoDB Atlas. `localhost` will not work on Netlify.
- The frontend uses same-origin `/api/*` calls, and Netlify rewrites those to the bundled function automatically.
- Edit mode uses backend authentication and bearer tokens. Content and portfolio write endpoints are protected.
- Default login is `danteivery` / `1234` unless you override it with `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Netlify.

## Local Setup

1. Copy [backend/.env.example](/Users/danteivery/Documents/My Portfolio/backend/.env.example) to `backend/.env` if you want a local reference for the required variables.
2. Copy [frontend/.env.example](/Users/danteivery/Documents/My Portfolio/frontend/.env.example) to `frontend/.env` if you need local frontend overrides.
3. Install frontend dependencies with `npm install --prefix frontend`.
4. Run the frontend with `npm --prefix frontend start`.

The Netlify production API lives in [frontend/netlify/functions/api.js](/Users/danteivery/Documents/My Portfolio/frontend/netlify/functions/api.js). The original FastAPI version remains in [backend/server.py](/Users/danteivery/Documents/My Portfolio/backend/server.py) as a reference implementation and uses the same default credentials.
