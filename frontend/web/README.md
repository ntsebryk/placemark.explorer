# web frontend

React + Vite + TypeScript frontend for places and groups.

## Environment

Copy `.env.example` to `.env`.

- `VITE_API_BASE_URL`: API base path (default `/api`)
- `VITE_DEV_PROXY_TARGET`: local places-service target for dev proxy (default `http://localhost:8082`)

## Run

```bash
npm install
npm run dev
```

## Routes

- `/` dashboard
- `/places` places list
- `/places/new` create place
- `/places/:id` place detail
- `/places/near` near search
- `/groups` groups list
- `/groups/new` create group
- `/groups/:id` group detail + membership
- `/map` map placeholder
