# Saba Deployment Guide

This app deploys as a Next.js application on Vercel with Neon Postgres, Prisma migrations, Cloudinary uploads, Chapa payments, Resend email, and optional Gemini AI.

## 1. Local Readiness

1. Copy `.env.example` to `.env` and fill real local values.
2. Install dependencies:

```bash
npm install
```

3. Apply migrations and seed demo data:

```bash
npm run prisma:migrate
npm run prisma:seed
```

4. Run checks:

```bash
npm run lint
npm test
npm run build
```

## 2. Neon Database

1. Create a Neon project and database.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Use a separate Neon branch or database for staging.
4. For production releases, run Prisma migrations with:

```bash
npm run prisma:deploy
```

Prisma recommends `prisma migrate deploy` for applying existing migrations in deployment environments; do not use `prisma migrate dev` in production.

## 3. Vercel

1. Import the repository into Vercel.
2. Add environment variables per environment: Production, Preview, and Development.
3. Set the build command to:

```bash
npm run prisma:deploy && npm run build
```

4. Set the install command to:

```bash
npm install
```

5. After the first successful deploy, run seed only for non-production demo environments:

```bash
npm run prisma:seed
```

Do not run demo seeding automatically in production unless you intentionally want demo users/products.

## 4. Cloudinary

1. Create a Cloudinary account and cloud.
2. Add `CLOUDINARY_URL` to Vercel environment variables.
3. Confirm product image upload works from the seller dashboard.
4. Keep Cloudinary credentials server-side only.

## 5. Chapa

1. Create a Chapa merchant account.
2. Add `CHAPA_SECRET_KEY` to Vercel.
3. Set `PAYMENT_PROVIDER=chapa` when live payment should be enabled.
4. Configure webhook/callback URLs:

```text
https://YOUR_DOMAIN/api/payments/chapa/webhook
https://YOUR_DOMAIN/api/payments/chapa/callback
```

5. Add `CHAPA_WEBHOOK_SECRET` if configured in the Chapa dashboard.
6. Test payment in Chapa test mode before switching live credentials.

## 6. Resend Email

1. Create a Resend API key.
2. Add `RESEND_API_KEY`.
3. Add `EMAIL_FROM`.
4. In production, verify your sending domain and replace `onboarding@resend.dev`.

## 7. Gemini AI

1. Add `GEMINI_API_KEY`.
2. Keep `GEMINI_MODEL=gemini-2.5-flash`.
3. AI routes are optional and fall back if the provider is unavailable.

## 8. Required Environment Variables

Required for production:

```text
DATABASE_URL
JWT_SECRET
NEXT_PUBLIC_APP_URL
CLOUDINARY_URL
PAYMENT_PROVIDER
CHAPA_SECRET_KEY
RESEND_API_KEY
EMAIL_FROM
GEMINI_API_KEY
```

Recommended:

```text
CHAPA_WEBHOOK_SECRET
GEMINI_MODEL
GEMINI_VISION_MODEL
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_NAME
```

## 9. Release Checklist

1. Merge code.
2. Confirm migrations are committed.
3. Deploy to staging with staging env vars.
4. Run smoke tests: register, login, browse, add to cart, checkout, admin verification.
5. Deploy to production.
6. Confirm `npm run prisma:deploy` ran successfully in the Vercel build log.
7. Test Chapa callback/webhook and Cloudinary upload.

References:
- Prisma Vercel deployment: https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel
- Neon Prisma migrations: https://neon.com/docs/guides/prisma-migrations
- Cloudinary Next.js setup: https://cloudinary.com/documentation/nextjs_integration
- Chapa webhooks: https://developer.chapa.co/integrations/webhooks
