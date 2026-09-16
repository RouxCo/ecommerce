# Lumina — Modern Full-Stack Ecommerce

A clean, production-style ecommerce app built with **Next.js 15**, **Prisma**, **Auth.js**, **Stripe**, and **Tailwind CSS**. Perfect for portfolios and learning.

## Features

- Product catalog with images, categories, stock & featured flags
- Shopping cart (persistent per user)
- Stripe Checkout (test mode)
- User authentication (register / login) with role-based access
- Admin panel — create, edit, delete products
- Order history
- Responsive, modern UI

## Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Framework    | Next.js 15 (App Router)     |
| Language     | TypeScript                  |
| Styling      | Tailwind CSS v4             |
| Database     | Prisma + SQLite             |
| Auth         | Auth.js (NextAuth v5)       |
| Payments     | Stripe Checkout             |
| Validation   | Zod                         |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="paste-a-long-random-string-here"   # openssl rand -base64 32
AUTH_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_test_..."               # from Stripe Dashboard → Developers → API keys
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Database setup

```bash
npx prisma db push
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@example.com   | admin123  |
| User  | user@example.com    | user123   |

## Stripe Test Cards

Use any of these in Stripe Checkout:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

Any future expiry + any CVC.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login & register
│   ├── admin/products          # Admin CRUD
│   ├── api/                    # Route handlers
│   ├── cart/
│   ├── orders/
│   ├── product/[id]/
│   └── page.tsx                # Home / catalog
├── components/
│   ├── admin/
│   ├── cart/
│   ├── layout/
│   ├── products/
│   └── ui/                     # Button, Input, Card...
└── lib/
    ├── auth.ts
    ├── prisma.ts
    ├── stripe.ts
    └── utils.ts
```

## Useful Commands

```bash
npm run db:studio     # Visual database browser
npm run db:seed       # Re-seed products + users
npx prisma db push    # Sync schema changes
```

## Next Steps / Ideas

- Add product image upload (Uploadthing or S3)
- Order status management in admin
- Search & filters
- Wishlist
- Switch SQLite → PostgreSQL (Neon / Supabase) for production
- Deploy to Vercel

---

Built as a learning / portfolio project.
