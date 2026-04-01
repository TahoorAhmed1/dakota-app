# UGUIDE Quote + Booking Backend

This project now includes a full Prisma + Supabase backend for quote calculation, storage, quick quotes, admin-editable calculator data, and PDF export.

## What Is Implemented

- Prisma schema for camps, weeks, packages, pricing rows, discount rules, quotes, hunters, contact, and newsletter
- Central pricing engine used by APIs
- Minimum revenue behavior (quotes never blocked)
- Quick quote API for cheapest qualifying option
- Quote submit API with database persistence
- PDF download API for submitted quotes
- Admin config API for updating calculator data
- Frontend integration for Quote-Reserve page to load all options from API

## 1) Environment Setup

1. Copy .env.example to .env.local
2. Set DATABASE_URL to your Supabase Postgres connection string
3. Optionally set ADMIN_API_KEY to protect admin routes
4. Optionally set CONTACT_WEBHOOK_URL and QUOTE_WEBHOOK_URL for automations

## 2) Install + Generate

Run:

npm install
npm run prisma:generate

## 3) Create DB Tables

Run once after setting DATABASE_URL:

npx prisma migrate dev --name init_quote_backend

## 4) Seed Starter Data

Run:

npm run prisma:seed

This seeds:

- 5 camps
- 9 weeks
- 3 package types
- volume discount tiers
- baseline discount rules
- pricing rows for all camp/week/package combinations

## 5) New APIs

Public APIs:

- GET /api/calculator/config
- POST /api/quote/calculate
- POST /api/quick-quote
- POST /api/quote
- GET /api/quote/:quoteId/pdf

Admin API:

- GET /api/admin/calculator/config
- PUT /api/admin/calculator/config

If ADMIN_API_KEY is set, include header:

x-admin-key: your-key

## 6) AdminPortal

Access the admin panel at `http://localhost:3000/admin/login`

**Admin Features:**
- Visual management of all camps, weeks, packages
- Real-time pricing matrix editor
- Volume and individual discount configuration
- No database direct access needed
- All changes saved atomically to database

**Setup:**
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/login`
3. Leave API key empty (or enter if ADMIN_API_KEY is set)
4. Manage calculator data from dashboard

Full admin documentation available in [ADMIN.md](./ADMIN.md)

## 7) Quote Page Integration

The Quote-Reserve page now:

- loads camps/weeks/packages/rules from /api/calculator/config
- submits normalized quote data to /api/quote
- shows returned quote number
- offers direct PDF download link from returned endpoint

## Business Rules Applied

- Quotes are always allowed, regardless of availability markers
- Minimum group is treated as minimum revenue, not a hard block
- Discounts stack in sequence (volume, early bird, individual/junior)
- Sales tax is applied after discounts
- Deposit rate is date-based:
  - before May 1: 25%
  - May 1 to Aug 31: 50%
  - Sep 1 onward: 100%

## Notes

- Contact and newsletter submissions are now persisted in the database
- Quote webhook forwarding is optional and controlled by QUOTE_WEBHOOK_URL
- Contact webhook forwarding is optional and controlled by CONTACT_WEBHOOK_URL
