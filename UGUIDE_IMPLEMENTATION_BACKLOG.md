# UGUIDE Implementation Backlog

## Epic 1: Availability-First Public Experience
1. Redesign availability page as primary conversion surface.
2. Keep 5-camp x 9-week slot grid with status + base 3-day price.
3. Add mobile-first filtering and clearer CTA paths to Quote/Reserve and Contact.
4. Preserve status semantics: Open/Available, Pending, Reserved.

Acceptance:
- Public users can quickly identify open slots and start booking in <= 2 clicks.

## Epic 2: Annual Roll-Forward Admin Workflow
1. Add a guided "Roll Season Forward" flow.
2. Batch update week midpoint/start/end/check-in/check-out fields.
3. Batch update Tier 1 pricing only.
4. Decommission Tier 2/3/4 controls and logic.

Acceptance:
- Admin can roll year N to N+1 without code edits.

## Epic 3: Camp x Week Controls
1. Build admin tool for per-camp/per-week min and capacity overrides.
2. Support package constraints by camp/week in UI.
3. Add bulk update operations for common annual changes.

Acceptance:
- No custom code deployment needed for camp-week package/min/cap updates.

## Epic 4: Schedule Operations
1. Improve Schedule module editing speed for Camp x Week matrix.
2. Add hover-text editing UX and status update workflow.
3. Add lightweight change history/audit metadata.

Acceptance:
- Admin can update slot status and hover text in-season with low friction.

## Epic 5: Quote/Reserve Modernization
1. Ensure Step 1 season/week date picklists are data-driven from portal weeks.
2. Preserve discount logic from Discounts page.
3. Keep deposit-rate behavior (25/50/100%) and clearly surface due milestones.

Acceptance:
- Quote results remain accurate while admin can manage season/week options from data.

## Epic 6: Payments and Compliance
1. Keep PayPal integration for online booking.
2. Preserve check/Venmo informational workflow.
3. Add clearer payment milestones and waiver status visibility (May 1 / Aug 31).

Acceptance:
- Group leads can see required payment/waiver state without manual spreadsheet cross-checking.

## Epic 7: Replace Spreadsheet Dependency
1. Add group roster management per camp/week booking.
2. Track deposits and waivers per hunter in-system.
3. Provide exports for reconciliation and seasonal reporting.

Acceptance:
- Manual camp spreadsheets become optional, not required.

## Epic 8: Output Template Pass
1. Inventory all current message outputs (quote, booking, contact, admin notifications).
2. Move to configurable templates.
3. Reword content after final UX flow decisions.

Acceptance:
- Text outputs can be edited without code changes.

## Recommended Delivery Sequence
1. Epic 5 (Step 1 done), then Epic 2.
2. Epic 3 + Epic 4.
3. Epic 1 redesign.
4. Epic 6 + Epic 7.
5. Epic 8 final content pass.
