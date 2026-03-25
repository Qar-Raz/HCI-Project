'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Tag, Gift } from 'lucide-react';

interface AffiliateData {
    linkId: string;
    reward: number;
    type: 'PPC' | 'PPS';
}

export function AffiliateBanner() {
    const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);
    const [hasAffiliateCookie, setHasAffiliateCookie] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            console.log('[AffiliateBanner] All cookies:', document.cookie);

            // Read the cs_ref cookie
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'cs_ref' && value) {
                    console.log('[AffiliateBanner] Raw cookie value:', value);

                    try {
                        // Try to parse as JSON first
                        let cleanValue = value;

                        // Remove surrounding quotes if present
                        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
                            cleanValue = cleanValue.slice(1, -1);
                        }

                        // Try parsing as JSON
                        const parsed = JSON.parse(decodeURIComponent(cleanValue));

                        // Check if it's the new format with reward/type
                        if (parsed.linkId && parsed.reward !== undefined && parsed.type) {
                            const data: AffiliateData = parsed;
                            // Defer state updates to avoid cascading renders
                            setTimeout(() => {
                                setAffiliateData(data);
                                setHasAffiliateCookie(true);
                                setIsVisible(true);
                                console.log('[AffiliateBanner] Discount data:', data);
                            }, 0);
                        } else {
                            // Old format - just show fallback banner
                            console.log('[AffiliateBanner] Old format detected, showing fallback banner');
                            setTimeout(() => {
                                setHasAffiliateCookie(true);
                                setIsVisible(true);
                            }, 0);
                        }
                    } catch (e) {
                        // Not JSON - show fallback banner
                        console.log('[AffiliateBanner] Cookie is not JSON, showing fallback banner');
                        setTimeout(() => {
                            setHasAffiliateCookie(true);
                            setIsVisible(true);
                        }, 0);
                    }
                    break;
                }
            }
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible || !hasAffiliateCookie) {
        return null;
    }

    // If we have discount data, show the discount banner
    if (affiliateData) {
        const discountDisplay = affiliateData.type === 'PPS'
            ? `${affiliateData.reward}% OFF`
            : `$${affiliateData.reward.toFixed(2)} OFF`;

        return (
            <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 py-3 relative">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Gift className="w-5 h-5" />
                            <span className="font-semibold">Affiliate Discount Active!</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                            <Tag className="w-4 h-4" />
                            <span className="text-sm font-bold">{discountDisplay}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm hidden md:block">
                            You save {discountDisplay} on your order!
                        </span>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback banner when cookie exists but no discount data
    return (
        <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 py-3 relative">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        <span className="font-semibold">Affiliate Link Applied!</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm">Special offer active</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm hidden md:block">
                        You are eligible for special discounts through our affiliate program!
                    </span>
                    <button
                        onClick={handleDismiss}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}