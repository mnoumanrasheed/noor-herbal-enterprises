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

2. Copy `.env.example` to `.env.local` and fill in `DATABASE_URL`, `AUTH_SECRET`, and the admin credentials. Use a strong random `AUTH_SECRET`, such as the output of `openssl rand -base64 32`.

   Add the server-only `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` values to enable validated catalogue image uploads from the admin screens. Never expose the API secret to the browser.

3. Apply the database migrations:

   ```bash
   npm run db:migrate
   ```

4. Seed the initial categories and administrator:

   ```bash
   npm run db:seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

Open <http://localhost:3000>. The administrator sign-in is at `/admin/login`.

## Catalogue management

After signing in, use `/admin/categories` to create and order visible collections, and `/admin/products` to create or edit products, variants, PKR prices, stock, images, and publication status. Product uploads are checked on the server and stored with Cloudinary metadata and required alt text. Hiding a category or product preserves its records and removes it from the storefront; categories are not deleted, so products are never orphaned.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

The app uses Pakistani rupees (`PKR`), Pakistan locale formatting (`en-PK`), and Pakistan as the default order country. Shipping remains configurable; no fixed shipping price is assumed by the schema or seed data.

## Production

Set the production site URL in `NEXT_PUBLIC_SITE_URL` and configure the required environment variables in the hosting provider. Run migrations before starting the application with `npm run start`.
