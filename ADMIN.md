# Admin Portal Documentation

## Overview

The admin portal provides a complete web-based interface for managing all calculator configuration, pricing, and discount rules without direct database access.

## Quick Start

### Access Points

- **Login Page**: `http://localhost:3000/admin/login`
- **Dashboard**: `http://localhost:3000/admin` (after login)

### Authentication

1. If `ADMIN_API_KEY` environment variable is set:
   - Enter your API key on the login page to authenticate
   - The key is stored in browser localStorage for the session

2. If `ADMIN_API_KEY` is not set:
   - Leave the API key field empty and sign in
   - No authentication needed in development mode

## Navigation

The admin sidebar provides quick access to all sections:

- **Dashboard** - Overview of all configuration items
- **Camps** - Manage hunting camps
- **Hunt Weeks** - Manage hunting weeks and seasons
- **Packages** - Manage trip package types (e.g., 3N/2D, 4N/3D)
- **Pricing** - Configure base rates and volume discount rules
- **Discounts** - Manage discount codes and categories

## Features by Section

### Dashboard

Shows key statistics:
- Number of active camps
- Number of hunt weeks
- Package types available
- Total pricing rules
- Volume discount tiers
- Discount codes

Quick action buttons for immediate navigation to management sections.

### Camps Management

**Add New Camp:**
1. Enter camp name (e.g., "Faulkton Camp")
2. Enter slug (URL-friendly, e.g., "faulkton-camp")
3. Set display order (numeric value for sorting)
4. Click "Add Camp"

**Edit Existing Camp:**
1. Modify fields in the camp row
2. Use checkbox to toggle active status
3. Click "Save All Changes"

**Delete Camp:**
1. Click the "Delete" button in the camp row
2. Confirm deletion in the prompt
3. Click "Save All Changes" to commit

**Fields:**
- `name`: Display name of the camp
- `slug`: URL-friendly identifier
- `displayOrder`: Sorting priority (lower = earlier in list)
- `active`: Whether camp appears in public calculator

### Hunt Weeks Management

**Add New Week:**
1. Enter week label (e.g., "Week 1")
2. Enter season label (e.g., "2026 Season")
3. Select start date
4. Select end date
5. Click "Add Week"

**Edit Existing Week:**
1. Modify any fields in the week row
2. Toggle active status with checkbox
3. Click "Save All Changes"

**Fields:**
- `label`: Display name (e.g., "Week 1")
- `seasonLabel`: Season grouping (e.g., "2026 Season")
- `startDate`: First day of hunt (YYYY-MM-DD)
- `endDate`: Last day of hunt (YYYY-MM-DD)
- `active`: Whether week appears in calculator

### Packages Management

**Add New Package:**
1. Enter nights count (e.g., 3)
2. Enter days count (e.g., 2)
3. Toggle active status
4. Click "Add Package"

**Edit/Delete:**
1. Modify fields in rows or click "Delete"
2. Click "Save All Changes"

**Fields:**
- `nights`: Number of nights (3, 4, 5, etc.)
- `days`: Number of days (2, 3, 4, etc.)
- `active`: Whether package is available

### Pricing Management

This section has two subsections:

#### Pricing Matrix

**Add Pricing Rule:**
1. Select a camp from dropdown
2. Select a hunt week from dropdown
3. Select a package (e.g., "3N/2D")
4. Enter base rate (e.g., 1399)
5. Enter minimum group size (e.g., 4)
6. Click "Add Pricing Rule"

**Edit/Delete Rules:**
1. Modify `baseRate` or `minGroupSize` in table rows
2. Click "Delete" to remove
3. Click "Save All Changes"

**Important:**
- Each camp/week/package combination can only have ONE pricing rule
- `baseRate`: Price per person for the package
- `minGroupSize`: Minimum hunters to create a booking (affects revenue floor calculation)

#### Volume Discount Rules

**Add Volume Rule:**
1. Enter minimum hunters (e.g., 4)
2. Enter maximum hunters (e.g., 5)
3. Enter discount per hunter (e.g., 20)
4. Click "Add Rule"

**Edit/Delete:**
1. Modify values in rows
2. Click "Delete" to remove
3. Click "Save All Changes"

**Example Setup:**
```
4-5 hunters: $20 discount per hunter
6-7 hunters: $40 discount per hunter
8+ hunters: $60 discount per hunter
```

**Important:**
- Rules are applied based on total hunter count
- Highest discount that applies is used
- Discounts are applied AFTER base rate calculation

### Discounts Management

**Add New Discount Code:**
1. Enter code (e.g., "MILITARY")
2. Enter label (e.g., "Military Discount")
3. Select type:
   - **FIXED**: Subtract dollar amount (e.g., $125 off)
   - **PERCENT**: Subtract percentage (e.g., 5% off base)
4. Enter amount (125 for fixed, 5 for percent)
5. Select category:
   - **INDIVIDUAL**: Applied to adult hunters
   - **JUNIOR**: Applied to youth hunters
6. Toggle active status
7. Click "Add Discount"

**Edit/Delete:**
1. Modify fields in rows
2. Click "Delete" to remove
3. Click "Save All Changes"

**Example Codes:**
- MILITARY: $125 fixed (Individual)
- VETERAN: $100 fixed (Individual)
- SENIOR: 5% off (Individual)
- JUNIOR: 50% off (Junior)

## Saving Changes

**Important:** All modifications (add, edit, delete) must be saved by clicking the **"Save All Changes"** button at the bottom of the page.

When you click save:
1. All changes are validated
2. The entire configuration is sent to the backend API
3. The database is updated atomically (all-or-nothing)
4. Success confirmation appears

If an error occurs:
1. Error message displays at top of page
2. No changes are saved to database
3. Fix the issue and try again

## Environment Variables

Set these in `.env.local`:

```env
# Optional: Add admin authentication layer
ADMIN_API_KEY=your-secret-key-here

# Optional: Webhooks to notify external systems
CONTACT_WEBHOOK_URL=https://hook.site/your-id
QUOTE_WEBHOOK_URL=https://hook.site/your-id
```

If `ADMIN_API_KEY` is not set, the admin portal works in open mode (authentication disabled).

## Best Practices

1. **Test Changes Carefully**
   - Changes apply immediately to the calculator
   - Test on a staging environment first

2. **Maintain Data Consistency**
   - Ensure every camp has pricing for each week/package combo
   - Volume rules should cover all expected group sizes

3. **Keep Descriptions Clear**
   - Use descriptive camp names and codes
   - Make discount codes easy to remember

4. **Regular Backups**
   - Database is the source of truth
   - Consider regular PostgreSQL backups for safety

5. **Monitor Usage**
   - Check quote submissions to ensure pricing is correct
   - Adjust discounts based on booking patterns

## Troubleshooting

### Can't Access Admin Portal
1. Ensure dev server is running (`npm run dev`)
2. Navigate to `http://localhost:3000/admin/login`
3. If API key is set, verify you're entering it correctly

### Changes Don't Save
1. Check browser console for error messages
2. Verify all required fields are filled
3. Look for validation error messages on the page
4. Check network tab to see API response

### Pricing Not Updating in Calculator
1. Ensure you clicked "Save All Changes"
2. Refresh the calculator page (quote-reserve)
3. Check that camp/week/package combination has pricing rule

### Can't Add Pricing Rule
1. Verify you've selected all three dropdowns (camp, week, package)
2. Check that base rate is greater than 0
3. Try adding without a minimum group size (defaults to 0)

## API Integration

The admin panel uses these endpoints:

- `GET /api/admin/calculator/config` - Fetch current configuration
- `PUT /api/admin/calculator/config` - Update entire configuration (atomic transaction)

Both endpoints check for `x-admin-key` header if `ADMIN_API_KEY` is set.

## Security Notes

- Admin portal should be behind authentication in production
- Never commit `ADMIN_API_KEY` to version control
- Use HTTPS in production
- Consider IP whitelisting for admin access
- Regularly audit who has access to admin credentials
