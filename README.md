# Health AI BE

Built with the following technologies:

- NodeJS
- Keystone
- ExpressJS
- Prisma (Postgresql)

## Getting Started

1. Download the repo and extract to a folder
2. Run `yarn install`
3. Run `yarn dev:start`
4. If you have changes on the module schema (data types), run `yarn dev:commit` to pre-generate the migration script and commit to the backend

## Important Env Variables

```.env
BASE_URL= <frontend_url>

DATABASE_URL= <postgres_url>

GHL_CLIENTID= <ghl_app key>

GHL_CLIENTSECRET= <ghl_app secret>
```

## Deployment

To follow, currently deployed semi-manually using Docker and Caprover. Would generate a callable url for build trigger or request a new server for collaborative hosting
