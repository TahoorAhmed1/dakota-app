# Tier Pricing Removal Spec (Tier 1 Only)

## Goal
Ensure all pricing workflows are explicitly Tier 1-only and remove any remaining Tier 2/3/4 assumptions from UI, API payloads, and admin mental model.

## Current State
1. No explicit Tier 2/3/4 columns exist in prisma/schema.prisma pricing models.
2. Quote flow currently displays "Tier 1" summary text in Step 3.
3. Legacy concern is mostly business-process language and potential historical custom code pathways.

## Scope
- In scope:
  - UI labels and admin docs that imply multi-tier pricing.
  - API contracts that might still reference tiered structures.
  - Seed/config import payloads with tier-like assumptions.
- Out of scope:
  - Rewriting discount logic unrelated to tiering.
  - Repricing business rules beyond Tier 1 selection.

## Technical Changes
1. Data model
- Keep current base-rate model:
  - WeekBaseRate.baseRate (3-day base)
  - CampWeekPricing.baseRate (package-level base)
- No Tier 2/3/4 fields added anywhere.

2. API contracts
- Ensure no tier2/tier3/tier4 keys are accepted or emitted.
- Continue returning tier-neutral pricing rows by camp/week/package.

3. UI
- Admin pricing screens should refer to "Base Rate" or "Tier 1 Rate" only.
- Remove any dormant labels/options for additional tiers.

4. Migration safety checks
- Search all code for tier2/tier3/tier4 aliases and remove dead paths.
- Confirm quote calculation still uses selected camp/week/package base rate only.

## Validation Plan
1. Type checks: yarn tsc --noEmit.
2. Build checks: yarn next build.
3. Functional checks:
- Admin updates a week price and sees it reflected in quote output.
- Quote flow still supports package differences and discounts.

## Rollback Plan
- If regressions occur, restore previous UI labels first (no schema rollback needed unless new fields are introduced).

## Completion Criteria
1. No Tier 2/3/4 references remain in production code paths.
2. Admin can only edit Tier 1/base price paths.
3. Quote output and booking behavior remain correct.
