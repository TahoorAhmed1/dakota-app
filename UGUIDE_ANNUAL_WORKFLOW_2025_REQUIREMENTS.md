# UGUIDE Annual Workflow Requirements (Captured 2025-01-10)

## 1. Business Snapshot
- UGUIDE has operated for 20 years as of 2024.
- Current scale: about 360 hunters per year.
- Operating structure: 5 pheasant camps, about 30-35 groups annually.
- Weekly capacity model: 1 group per camp per week.
- Core offering: private land + lodging packages, 3 or 4 day hunts, 4 or 5 night stays.
- Brand foundation: quality habitat and wild-reared pheasants.

## 2. Core Domain Model (Business Terms)
- Camp: private land + lodging entity managed by landowner; UGUIDE manages booking and annual operations.
- Season Week: one hunt window tied to dates, pricing, and per-camp availability.
- Slot: Camp x Week inventory cell with status (`Available`, `Pending`, `Reserved`).
- Group: booking party coordinated through one lead.
- Quote/Reserve: pricing and reservation workflow for guests and admin.
- Waitlist/First Right of Refusal (FROR): annual incremental re-booking process tied to season progression.

## 3. Annual Operational Cycle

### 3.1 Pre-Season Setup (before South Dakota opener, 3rd Saturday in October)
1. Update Weeks module for next season:
- Set each week midpoint date for the next year.
- Update Tier 1 price.
- Update lodging and hunting start/end/check-in/check-out fields.
2. Disable/remove obsolete tiered pricing behavior:
- Tier 2, Tier 3, Tier 4 are no longer used.
3. Update camp-level fields in Camp module:
- Lodging price-related field.
- Camp minimum and camp maximum values as needed.

### 3.2 In-Season Operations
1. Frequent updates in Schedule module by Camp x Week.
2. Maintain slot statuses: `A` (Available), `R` (Reserved), `Pending`.
3. Maintain hover text per slot for richer availability context.

### 3.3 Booking + Payment Milestones
- Booking/re-booking deposit: 25%.
- Additional 25% due by May 1.
- Remainder due by Aug 31.
- Waivers due by Aug 31.
- Online deposit logic currently supports 25/50/100% based on time of year.

## 4. Product Priorities

### Priority 1: Availability-First Experience
- Availability page is primary conversion and booking surface.
- New site design should center around this page.
- Must clearly present 5 camps x 9 weeks = 45 slots with status and base 3-day pricing.
- Contact page remains key lead intake path.
- Reserving Next Year page must clearly explain waitlist + FROR and dynamic season progression.

### Priority 2: Admin Usability for Annual Roll Forward
- Fast, safe yearly roll-forward for Weeks and pricing.
- Remove dead complexity from unused tier pricing.
- Add user-friendly tooling for camp package/minimum/capacity updates by camp and week (replace dependence on custom code).

### Priority 3: Quote/Reserve Accuracy + Flexibility
- Quote engine must continue to support discounts and package options.
- Step 1 hunt year/date picker currently hard-coded and should be admin-managed.
- Preserve online reservation + payment integration.

### Priority 4: Operational Recordkeeping Improvements
- Current process depends on separate camp spreadsheets and manual roster/deposit/waiver tracking.
- System should progressively replace spreadsheet dependency with per-camp group records and status tracking.

## 5. Functional Requirements by Module

### 5.1 Weeks Module (Admin)
Required:
- Clone/roll-forward season weeks from year N to N+1.
- Batch edit week midpoint dates.
- Batch edit Tier 1 pricing.
- Batch edit lodging/hunt/check-in/check-out dates.
- Validation to prevent overlapping or invalid week ranges.

Change:
- Decommission Tier 2/3/4 in UI and logic.

### 5.2 Camps Module (Admin)
Required:
- Update camp lodging field annually.
- Update camp minimum and maximum constraints.
- New UI tool for per-camp, per-week package rules and constraints (currently custom coded externally).

### 5.3 Schedule Module (Admin)
Required:
- Grid view by Camp x Week.
- Status updates (`Available`, `Pending`, `Reserved`).
- Hover text management per slot.
- Bulk actions for status/hover edits.
- Audit trail for slot changes (who, when, what changed).

### 5.4 Availability Page (Public)
Required:
- Primary UX focus.
- Display slot status and base 3-day pricing.
- Support clear filtering and mobile readability.
- Link actions to Quote/Reserve and Contact.

### 5.5 Quote/Reserve Tool
Required:
- Accurate group cost output with discounts.
- Step 1 year/date options sourced from admin-managed data (not hard-coded list).
- Online booking flow with integrated payment decision logic.

### 5.6 Payments
Required:
- Keep PayPal integration.
- Continue support for non-integrated methods (check, Venmo) in informational flow.
- Clear due-date schedule and balance visibility for group leads.

### 5.7 Contact + Lead Workflow
Required:
- Preserve and improve lead capture.
- Support manual follow-up and assignment to group lead.

### 5.8 Waivers + Compliance
Required:
- Track waiver due date and submission state by hunter and group.
- Surface Aug 31 deadline status in admin dashboards.

### 5.9 System Outputs (Templates)
Required:
- Inventory all text outputs (quote, booking confirmation, contact notifications, etc.).
- Move toward configurable templates.
- Reword content during final UX/content phase once flows are finalized.

## 6. Data/Schema Direction (High-Level)
- `Season` entity with year + status.
- `Week` entity with midpoint/start/end/checkin/checkout and Tier 1 price.
- `Camp` entity with lodging cost, min/max defaults.
- `CampWeekConfig` entity for per-camp/per-week overrides (minimums, capacities, package settings).
- `Slot` entity for status + hover text + references to camp/week.
- `GroupBooking` entity for group lead + booking state.
- `PaymentPlan` / `PaymentInstallment` for 25/25/remainder schedule.
- `Waiver` entity at hunter level with due/submitted status.

## 7. Migration + Rollout Strategy

### Phase 1: Stabilize and Simplify
- Remove tier pricing complexity (Tier 2/3/4).
- Make Quote Step 1 date options data-driven.
- Harden availability/schedule status updates.

### Phase 2: Admin Productivity
- Build camp-week configuration tool (min/capacity/package overrides).
- Add bulk week roll-forward and batch pricing/date edits.

### Phase 3: Workflow Consolidation
- Add group roster, payment, and waiver tracking to reduce spreadsheet dependency.
- Introduce templated system outputs.

### Phase 4: UX Overhaul
- Redesign around Availability-first journey while preserving familiar functionality users like.

## 8. Acceptance Criteria (Initial)
1. Admin can roll forward all season weeks in one guided workflow.
2. Admin can update Tier 1 pricing and key dates without touching code.
3. Admin can manage per-camp/per-week minimums and capacities in UI.
4. Public availability grid accurately reflects 45 slots and status states.
5. Quote Step 1 year/date options are managed from portal data.
6. Booking/payment schedule reflects deposit milestones and due dates.
7. System supports tracking waiver completion by due date.

## 9. Open Questions for Implementation
1. Exact rules for when online deposit is 25% vs 50% vs 100%.
2. Whether FROR needs explicit state machine statuses in data model.
3. Required role/permission levels for editing pricing, schedule, and payment records.
4. Whether legacy spreadsheets must be imported, or only replaced going forward.
5. Which current output templates are mandatory on day one of the redesign.

## 10. Notes
- This document captures workflow and requirements from UGUIDE operational guidance dated 2025-01-10.
- It is intended as a living product/engineering reference for portal and website overhaul planning.
