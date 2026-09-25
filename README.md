# Noor Herbal Enterprises

Noor Herbal Enterprises is a Pakistan-based herbal products storefront built with Next.js, Neon PostgreSQL, and NextAuth credentials authentication.

## Requirements

- Node.js 20 or newer
- npm
- A Neon PostgreSQL database

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env.local`. Add values from your own Neon and Cloudinary accounts; `.env.local` is ignored by Git and must never be committed. Generate a strong `AUTH_SECRET` locally:

   ```bash
   openssl rand -base64 32
   ```

   Required local variables are `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` should be `http://localhost:3000` locally.

3. In the Neon console, choose the intended database and copy its pooled Postgres connection string into `DATABASE_URL`. Then apply the migrations. Do not run this command against a database you have not chosen deliberately:

   ```bash
   npm run db:migrate
   ```

4. Create the four initial categories and first administrator. This creates no products, prices, or stock, and never replaces an existing admin password:

   ```bash
   npm run db:seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

Open <http://localhost:3000>. The administrator sign-in is at `/admin/login`.

## Catalogue management

After signing in, use `/admin/categories` to create, edit, publish/unpublish, or delete empty collections. Use `/admin/products` to create, edit, publish/unpublish, or delete products, variants, PKR prices, stock, images, and publication status. Products require at least one image, one priced variant, and stock information. Product uploads are checked on the server, require useful alt text, and store Cloudinary URL/public-ID metadata. JFIF uploads are rejected with instructions to convert them to JPG, PNG, or WebP.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

The app uses Pakistani rupees (`PKR`), Pakistan locale formatting (`en-PK`), and Pakistan as the default order country. Shipping remains configurable; no fixed shipping price is assumed by the schema or seed data.

## Production

There is no custom `vercel.json`; Vercel detects this as a standard Next.js app. Add these environment variables in Vercel Project Settings -> Environment Variables:

- `DATABASE_URL` — Neon Console -> Project -> Connection Details (pooled Postgres URL).
- `AUTH_SECRET` — generate with `openssl rand -base64 32` or a password manager.
- `ADMIN_EMAIL` — the one administrator email address.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary Console -> Product Environment Credentials.
- `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` — the deployed site URL.

`ADMIN_PASSWORD` is required only while running `npm run db:seed` to create the first admin. It is not needed by the running app after that step. Run migrations from a controlled local/CI environment before deployment; do not run seed or migrations automatically during a Vercel build.
