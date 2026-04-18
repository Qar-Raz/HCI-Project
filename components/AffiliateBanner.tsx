'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Tag, Gift } from 'lucide-react';

export function AffiliateBanner() {
    const [discountPercent, setDiscountPercent] = useState<number | null>(null);
    const [hasAffiliateCookie, setHasAffiliateCookie] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            console.log('[AffiliateBanner] All cookies:', document.cookie);

            // Read the cs_ref and cs_discount cookies
            const cookies = document.cookie.split(';');
            let hasRef = false;
            let discount: number | null = null;

            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'cs_ref' && value) {
                    hasRef = true;
                    console.log('[AffiliateBanner] Found cs_ref cookie:', value);
                }
                if (name === 'cs_discount' && value) {
                    const num = parseFloat(value);
                    if (!isNaN(num) && num > 0) {
                        discount = num;
                        console.log('[AffiliateBanner] Found cs_discount cookie:', num);
                    }
                }
            }

            if (hasRef) {
                setTimeout(() => {
                    setDiscountPercent(discount);
                    setHasAffiliateCookie(true);
                    setIsVisible(true);
                }, 0);
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
    if (discountPercent !== null && discountPercent > 0) {
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
                            <span className="text-sm font-bold">{discountPercent}% OFF</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm hidden md:block">
                            You save {discountPercent}% on your order!
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
