// ClickStream Integration Utilities

const CLICKSTREAM_URL =
  process.env.NEXT_PUBLIC_CLICKSTREAM_URL ||
  "https://clickstream-six.vercel.app";

interface ConversionPayload {
  ref: string;
  orderId: string;
  orderTotal: number;
}

interface ConversionResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

/**
 * Get the affiliate referral ID from cookie or URL parameter.
 * Priority: cookie > URL param (for cross-domain scenarios where
 * ClickStream redirects with ?ref=xxx and the merchant site sets
 * its own cookie via AffiliateCookieSetter).
 */
export function getAffiliateRef(): string | null {
  if (typeof document === "undefined") return null;

  // First check cookie (set by AffiliateCookieSetter from URL param)
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "cs_ref" && value) {
      return value;
    }
  }

  // Fallback: check URL parameter (in case cookie hasn't been set yet)
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      return ref;
    }
  }

  return null;
}

/**
 * Track a conversion with ClickStream
 * @param payload - Conversion data
 * @returns Promise with the response
 */
export async function trackConversion(
  payload: ConversionPayload
): Promise<ConversionResponse> {
  try {
    const response = await fetch(`${CLICKSTREAM_URL}/api/conversions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("[ClickStream] Conversion tracked successfully:", data);
      return { success: true, message: "Conversion tracked" };
    } else {
      console.error("[ClickStream] Conversion tracking failed:", data.error);
      return { error: data.error };
    }
  } catch (error) {
    console.error("[ClickStream] Conversion tracking error:", error);
    return { error: "Failed to track conversion" };
  }
}

/**
 * Track conversion for an order (with duplicate prevention)
 * @param orderId - Unique order identifier
 * @param orderTotal - Total order amount
 * @returns Promise indicating success or failure
 */
export async function trackOrderConversion(
  orderId: string,
  orderTotal: number
): Promise<boolean> {
  // Get affiliate reference
  const ref = getAffiliateRef();

  if (!ref) {
    console.log("[ClickStream] No affiliate referral found, skipping tracking");
    return false;
  }

  // Check if already tracked (prevent duplicates)
  const trackedKey = `cs_tracked_${orderId}`;
  if (localStorage.getItem(trackedKey)) {
    console.log("[ClickStream] Conversion already tracked for order:", orderId);
    return true;
  }

  // Track the conversion
  const result = await trackConversion({
    ref,
    orderId,
    orderTotal,
  });

  if (result.success) {
    // Mark as tracked
    localStorage.setItem(trackedKey, "true");
    return true;
  }

  return false;
}

/**
 * Clear the affiliate referral and discount cookies (optional, after conversion)
 */
export function clearAffiliateRef(): void {
  if (typeof document === "undefined") return;
  document.cookie = "cs_ref=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "cs_discount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
