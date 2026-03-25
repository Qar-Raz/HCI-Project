interface AffiliateData {
  linkId: string;
  reward: number;
  type: "PPC" | "PPS";
}

export function getAffiliateData(): AffiliateData | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "cs_ref" && value) {
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export function calculateDiscount(
  subtotal: number,
  affiliateData: AffiliateData | null
): number {
  if (!affiliateData) return 0;

  if (affiliateData.type === "PPS") {
    // Percentage discount
    return subtotal * (affiliateData.reward / 100);
  } else {
    // Fixed amount discount (PPC)
    return affiliateData.reward;
  }
}

export function formatDiscountDisplay(
  affiliateData: AffiliateData | null
): string {
  if (!affiliateData) return "";

  if (affiliateData.type === "PPS") {
    return `${affiliateData.reward}% OFF`;
  } else {
    return `$${affiliateData.reward.toFixed(2)} OFF`;
  }
}
