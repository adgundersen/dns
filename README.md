# crimata-dns

Small internal API for provisioning DNS on `crimata.com` via Cloudflare — used to give each new Crimata customer a free subdomain, and optionally point a custom domain at their instance.

## What it does

- `GET /domains/check?domain=` — check domain availability
- `POST /domains` — create a subdomain for a customer, and optionally register + point a custom domain
- `DELETE /domains/:recordId` — remove a DNS record

Built with [Fastify](https://fastify.dev/) + TypeScript, talking to the Cloudflare API.

## Running it

```
cp .env.example .env   # fill in Cloudflare API token, account ID, zone ID
npm install
npm run dev
```

The included `Dockerfile` builds and runs the compiled version (`npm run build` then `node dist/index.js`).

