'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ScrollText, ShoppingBag, User, Eye, Search } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useTranslation } from '@/lib/use-translation';
import { useAccessibility } from '@/lib/accessibility-context';
import SpeakButton from '@/components/ui/SpeakButton';

export default function BottomNav() {
    const pathname = usePathname();
    const { getCartCount } = useCart();
    const { t } = useTranslation();
    const { settings } = useAccessibility();
    const cartCount = getCartCount();

    const navItems = [
        { name: t('nav.home'), icon: Home, path: '/', description: 'Go to Home page. See restaurants and food options.' },
        { name: t('nav.search'), icon: Search, path: '/search', description: 'Search for restaurants and food.' },
        { name: t('nav.orders'), icon: ScrollText, path: '/orders', description: 'View your orders and order history.' },
        { name: t('nav.cart'), icon: ShoppingBag, path: '/cart', badge: cartCount, description: `Your shopping cart. ${cartCount > 0 ? `${cartCount} items in cart.` : 'Cart is empty.'}` },
        { name: t('nav.account'), icon: User, path: '/account', description: 'Your account settings and profile.' },
        { name: t('nav.accessibility'), icon: Eye, path: '/accessibility', description: 'Accessibility settings. Adjust text size, colors, and audio options.' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-2xl">
            <div className="max-w-7xl mx-auto px-2">
                <div className="flex items-center justify-around h-20">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <div key={item.name} className="relative flex flex-col items-center justify-center flex-1 h-full">
                                {/* Audio Assistance Speaker Button */}
                                {settings.audioAssistance && (
                                    <div className="absolute -top-2 right-0 z-50">
                                        <SpeakButton
                                            text={item.description}
                                            size="sm"
                                        />
                                    </div>
                                )}
                                <Link
                                    href={item.path}
                                    className="flex flex-col items-center justify-center w-full h-full group"
                                >
                                    <div className="relative">
                                        {/* Icon Container with Active Background */}
                                        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive
                                            ? 'bg-[#FF6B00]/10'
                                            : 'group-hover:bg-gray-100'
                                            }`}>
                                            <Icon
                                                size={24}
                                                strokeWidth={2}
                                                className={`${isActive
                                                    ? 'text-[#FF6B00]'
                                                    : 'text-[#6C757D] group-hover:text-[#212529]'
                                                    } transition-colors duration-200`}
                                            />
                                        </div>

                                        {/* Cart Badge */}
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1.5 border-2 border-white shadow-lg">
                                                {item.badge > 99 ? '99+' : item.badge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Label */}
                                    {!((settings as any)?.iconOnlyMode) && (
                                        <span
                                            className={`text-[10px] font-semibold mt-1 ${isActive
                                                ? 'text-[#FF6B00]'
                                                : 'text-[#6C757D] group-hover:text-[#212529]'
                                                } transition-colors duration-200`}
                                        >
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
