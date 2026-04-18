'use client';

import { useEffect } from 'react';

/**
 * Reads `ref` and `discount` URL parameters (set by ClickStream's click engine
 * redirect) and stores them as first-party cookies on the merchant site's domain.
 * This is necessary because ClickStream sets cookies on its own domain which
 * are not readable cross-domain.
 */
export function AffiliateCookieSetter() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        const discount = params.get('discount');

        if (ref) {
            // Set cs_ref cookie (30 days, same as ClickStream)
            document.cookie = `cs_ref=${ref}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
            console.log('[AffiliateCookieSetter] Set cs_ref cookie from URL param:', ref);
        }

        if (discount) {
            // Set cs_discount cookie (30 days)
            document.cookie = `cs_discount=${discount}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
            console.log('[AffiliateCookieSetter] Set cs_discount cookie from URL param:', discount);
        }

        // Clean up URL parameters so they don't persist in browser history
        if (ref || discount) {
            const url = new URL(window.location.href);
            url.searchParams.delete('ref');
            url.searchParams.delete('discount');
            window.history.replaceState({}, '', url.toString());
        }
    }, []);

    return null; // This component renders nothing
}