# DeadLock League Frontend

React/Vite frontend for the DeadLock League tournament platform.

## Scripts

- `npm run dev` - local Vite dev server
- `npm run build` - TypeScript check and production build
- `npm run preview` - preview production build

## API

The frontend uses HTTP contracts from `src/shared/api/contracts` and calls the backend through `src/shared/api/repositories`.

Set `VITE_API_BASE_URL` to the FastAPI service URL. Default: `http://localhost:8000`.

Backend implementation requirements are documented in `BACKEND_REQUIREMENTS.md`.
