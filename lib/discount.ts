/**
 * Read the affiliate discount percentage from the cs_discount cookie.
 * Returns null if no discount cookie is found.
 */
export function getAffiliateDiscount(): number | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "cs_discount" && value) {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
  }
  return null;
}

/**
 * Calculate the discount amount from the affiliate discount percentage.
 * @param subtotal - The order subtotal before discount
 * @param discountPercent - The discount percentage (from cs_discount cookie)
 * @returns The discount amount in currency
 */
export function calculateAffiliateDiscount(
  subtotal: number,
  discountPercent: number | null
): number {
  if (!discountPercent || discountPercent <= 0) return 0;
  return Math.round(subtotal * (discountPercent / 100));
}

/**
 * Format the affiliate discount for display.
 * @param discountPercent - The discount percentage
 * @returns A display string like "10% OFF" or empty string
 */
export function formatAffiliateDiscount(
  discountPercent: number | null
): string {
  if (!discountPercent || discountPercent <= 0) return "";
  return `${discountPercent}% OFF`;
}
