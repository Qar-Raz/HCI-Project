# ClickStream Integration for FoodHub

This document explains how ClickStream affiliate marketing is integrated into the FoodHub food delivery app.

## Overview

FoodHub now supports ClickStream affiliate tracking, allowing:

- **PPC (Pay-Per-Click)**: Affiliates earn for each valid click through their referral links
- **PPS (Pay-Per-Sale)**: Affiliates earn commission on completed orders

## Files Modified/Created

### New Files

1. `middleware.ts` - Captures affiliate referral parameters
2. `lib/clickstream.ts` - ClickStream utility functions

### Modified Files

1. `app/checkout/page.tsx` - Added conversion tracking on order placement

## How It Works

### 1. Affiliate Link Click

When a user clicks an affiliate link like:

```
http://localhost:3001/?ref=clxyz123
```

The middleware captures the `ref` parameter and stores it in a cookie (`cs_ref`) for 30 days.

### 2. Order Placement

When the user places an order:

1. The checkout page reads the `cs_ref` cookie
2. The affiliate reference is stored with the order in localStorage
3. A conversion is tracked with ClickStream's API

### 3. Conversion Tracking

The conversion is sent to ClickStream at:

```
POST http://localhost:3000/api/conversions
{
  "ref": "clxyz123",
  "orderId": "ORD-1234567890",
  "orderTotal": 500.00
}
```

## Testing the Integration

### Prerequisites

1. ClickStream app running on `http://localhost:3000`
2. FoodHub app running on `http://localhost:3001`
3. A PPS campaign created on ClickStream with target URL: `http://localhost:3001`

### Test Steps

#### Step 1: Create a Campaign on ClickStream

1. Go to ClickStream (http://localhost:3000)
2. Sign in and select "I am a Merchant"
3. Go to Merchant Dashboard → Campaigns
4. Create a new PPS campaign:
   - Target URL: `http://localhost:3001`
   - Type: PPS
   - Reward: 5%
5. Deposit funds to your wallet

#### Step 2: Generate Affiliate Link

1. In ClickStream, sign in as an affiliate (or use another account)
2. Go to Affiliate Dashboard → Marketplace
3. Find your campaign and click "Generate Link"
4. Copy the generated link (e.g., `http://localhost:3000/r/clxyz123`)

#### Step 3: Test Click Tracking

1. Open the affiliate link in a browser
2. You should be redirected to FoodHub (`http://localhost:3001/?ref=clxyz123`)
3. Check browser cookies - you should see `cs_ref` with the link ID
4. Check ClickStream analytics - the click should be recorded

#### Step 4: Test Conversion Tracking

1. On FoodHub, add items to cart
2. Go to checkout
3. Place an order
4. Check browser console for `[ClickStream]` logs
5. Check ClickStream analytics - the conversion should be recorded

### Debug Mode

To see detailed logs, open browser console and look for:

```
[ClickStream] Affiliate referral captured: clxyz123
[ClickStream] Tracking conversion for order: ORD-1234567890
[ClickStream] Conversion tracked successfully: { success: true, message: 'Conversion recorded' }
```

## Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_CLICKSTREAM_URL=http://localhost:3000
```

## API Reference

### ClickStream Conversion API

**Endpoint**: `POST /api/conversions`

**Request**:

```json
{
  "ref": "string (required) - Affiliate link ID",
  "orderId": "string (required) - Unique order ID",
  "orderTotal": "number (required) - Order total amount"
}
```

**Response (Success)**:

```json
{
  "success": true,
  "message": "Conversion recorded"
}
```

**Response (Error)**:

```json
{
  "error": "Invalid link or campaign is not PPS/active"
}
```

## Troubleshooting

### Conversions not tracking

1. Check if `cs_ref` cookie exists in browser
2. Verify ClickStream is running on port 3000
3. Check browser console for errors
4. Ensure campaign is active and has funds

### Cookie not being set

1. Clear browser cookies and try again
2. Check middleware is running (look for console logs)
3. Verify URL has `?ref=xxx` parameter

### Duplicate conversions

The system prevents duplicates using localStorage. Each order ID is tracked only once.

## Code Structure

### middleware.ts

```typescript
// Captures ?ref=xxx from URL and stores in cookie
export default clerkMiddleware(async (auth, request) => {
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref) {
    response.cookies.set("cs_ref", ref, { maxAge: 30 days });
  }
});
```

### lib/clickstream.ts

```typescript
// Get affiliate reference from cookie
export function getAffiliateRef(): string | null;

// Track conversion with ClickStream
export async function trackOrderConversion(
  orderId,
  orderTotal
): Promise<boolean>;
```

### app/checkout/page.tsx

```typescript
// In handlePlaceOrder:
const affiliateRef = getAffiliateRef();
const newOrder = { ..., affiliateRef };

// Track conversion (fire and forget)
if (affiliateRef) {
  trackOrderConversion(orderId, total);
}
```

## Security Considerations

1. **Cookie Security**: `cs_ref` is set as `httpOnly` in production
2. **Duplicate Prevention**: localStorage prevents duplicate conversions
3. **Fraud Detection**: ClickStream validates clicks for duplicates (same IP within 24h)

## Future Enhancements

1. Add server-side conversion tracking for better reliability
2. Add affiliate performance dashboard in FoodHub
3. Support for geo-targeted campaigns
4. Real-time conversion notifications
