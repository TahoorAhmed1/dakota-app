# UGUIDE Requirements to Code Map

## Pricing + Weeks
- Weeks admin UI: app/admin/weeks/page.tsx
- Weeks API: app/api/admin/weeks/route.ts
- Single week API: app/api/admin/weeks/[id]/route.ts
- Week data model: prisma/schema.prisma (model HuntWeek)

## Quote/Reserve
- Quote UI: app/(routes)/quote-reserve/page.tsx
- Calculator config API: app/api/calculator/config/route.ts
- Calculator data assembly: lib/server/calculator-data.ts
- Quote engine + config mapping: lib/server/quote-engine.ts
- Quote persistence API: app/api/quote/route.ts
- Quote calculation API: app/api/quote/calculate/route.ts

## Camp / Week / Package Pricing
- Pricing model: prisma/schema.prisma (model CampWeekPricing)
- Admin pricing rows API: app/api/admin/pricing-rows/route.ts
- Single pricing row API: app/api/admin/pricing-rows/[id]/route.ts
- Admin availability APIs: app/api/admin/availability/route.ts, app/api/admin/availability/[id]/route.ts

## Camps
- Camps admin page: app/admin/camps/page.tsx
- Camps API: app/api/admin/camps/route.ts
- Camp by id API: app/api/admin/camps/[id]/route.ts
- Camp model: prisma/schema.prisma (model Camp)

## Discounts
- Discounts public page: app/(routes)/discounts/page.tsx
- Discount model: prisma/schema.prisma (model DiscountRule)
- Volume model: prisma/schema.prisma (model VolumeDiscountRule)
- Admin discounts API: app/api/admin/discounts/route.ts
- Admin volume rules APIs: app/api/admin/volume-rules/route.ts, app/api/admin/volume-rules/[id]/route.ts

## Waitlist / Contact
- Contact page: app/(routes)/contact/page.tsx
- Contact API: app/api/contact/route.ts
- Waitlist page: app/admin/waitlist/page.tsx
- Waitlist APIs: app/api/waitlist/route.ts, app/api/admin/waitlist/route.ts

## Payments + Deposit Logic
- Deposit logic source: lib/calculator-settings.ts
- Deposit evaluation in quote engine: lib/server/quote-engine.ts
- Quote step 4 payment flow references: app/(routes)/quote-reserve/page.tsx

## Admin Config Import/Export
- Admin calculator config API: app/api/admin/calculator/config/route.ts

## Notes on Current State
1. Tier 2/3/4 do not appear in active schema or quote pricing model; system is effectively Tier 1-centric now.
2. Quote Step 1 now uses portal-managed week records and includes week date ranges from HuntWeek data.
3. Remaining client requests are mostly workflow/UX/admin-productivity features rather than one-line bug fixes.
