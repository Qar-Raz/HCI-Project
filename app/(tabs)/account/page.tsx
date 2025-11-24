'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import {
    User,
    MapPin,
    CreditCard,
    Heart,
    Tag,
    Bell,
    HelpCircle,
    FileText,
    Shield,
    LogOut,
    ChevronRight,
    Star,
    Award,
    Sparkles,
    Settings,
    Globe,
    Moon,
    Sun,
    LogIn,
    UserPlus
} from 'lucide-react';
import Card from '@/components/ui/Card';

export default function AccountPage() {
    const router = useRouter();
    const { user: clerkUser } = useUser();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const accountLinks = [
        {
            section: 'Account',
            items: [
                {
                    icon: User,
                    label: 'Edit Profile',
                    href: '#',
                    description: 'Manage your personal information',
                    gradient: 'from-blue-500 to-blue-600'
                },
                {
                    icon: MapPin,
                    label: 'Saved Addresses',
                    href: '/location',
                    description: 'Manage delivery locations',
                    gradient: 'from-green-500 to-green-600'
                },
                {
                    icon: CreditCard,
                    label: 'Payment Methods',
                    href: '#',
                    description: 'Manage cards and payment options',
                    gradient: 'from-purple-500 to-purple-600'
                },
                {
                    icon: Heart,
                    label: 'Favorites',
                    href: '/favorites',
                    description: 'Your saved restaurants and dishes',
                    gradient: 'from-pink-500 to-pink-600'
                }
            ]
        },
        {
            section: 'Rewards & Offers',
            items: [
                {
                    icon: Tag,
                    label: 'My Offers',
                    href: '#',
                    description: 'View exclusive deals and discounts',
                    gradient: 'from-orange-500 to-orange-600',
                    badge: '3 New'
                },
                {
                    icon: Award,
                    label: 'Loyalty Rewards',
                    href: '#',
                    description: 'Earn points with every order',
                    gradient: 'from-yellow-500 to-yellow-600'
                }
            ]
        },
        {
            section: 'Preferences',
            items: [
                {
                    icon: Bell,
                    label: 'Notifications',
                    href: '#',
                    description: 'Manage notification preferences',
                    gradient: 'from-indigo-500 to-indigo-600'
                },
                {
                    icon: Globe,
                    label: 'Language & Region',
                    href: '#',
                    description: 'Change language and currency',
                    gradient: 'from-teal-500 to-teal-600'
                },
                {
                    icon: Settings,
                    label: 'App Settings',
                    href: '#',
                    description: 'Customize your experience',
                    gradient: 'from-gray-500 to-gray-600'
                }
            ]
        },
        {
            section: 'Help & Legal',
            items: [
                {
                    icon: HelpCircle,
                    label: 'Help Center',
                    href: '#',
                    description: 'Get support and answers',
                    gradient: 'from-cyan-500 to-cyan-600'
                },
                {
                    icon: FileText,
                    label: 'Terms & Conditions',
                    href: '#',
                    description: 'Read our terms of service',
                    gradient: 'from-slate-500 to-slate-600'
                },
                {
                    icon: Shield,
                    label: 'Privacy Policy',
                    href: '#',
                    description: 'How we protect your data',
                    gradient: 'from-emerald-500 to-emerald-600'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-24">
            {/* Premium Header with Gradient */}
            <div className="relative bg-gradient-to-r from-[#FF6B00] via-[#FF8C3A] to-[#FF6B00] shadow-xl overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                <div className="relative max-w-screen-xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="animate-pulse" size={28} />
                            My Account
                        </h1>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 group"
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? (
                                <Sun size={20} className="text-white group-hover:rotate-180 transition-transform duration-300" />
                            ) : (
                                <Moon size={20} className="text-white group-hover:rotate-12 transition-transform duration-300" />
                            )}
                        </button>
                    </div>
                    <p className="text-white/90 text-sm font-medium">Manage your profile and preferences</p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 -mt-8">
                {/* Show Login/Signup for non-authenticated users */}
                <SignedOut>
                    <div className="relative group mb-8">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B00] via-pink-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <Card className="relative bg-white border-2 border-orange-100">
                            <div className="p-8 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                    <User size={48} className="text-white" strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Sign in to Your Account
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Join FoodPapa to track your orders, save favorites, and unlock exclusive rewards!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <SignInButton mode="modal">
                                        <button
                                            className="px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        >
                                            <LogIn size={20} />
                                            Sign In
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button
                                            className="px-8 py-4 bg-white border-2 border-[#FF6B00] text-[#FF6B00] font-bold rounded-xl hover:bg-[#FF6B00] hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        >
                                            <UserPlus size={20} />
                                            Create Account
                                        </button>
                                    </SignUpButton>
                                </div>
                                <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Heart size={16} className="text-pink-500" />
                                        <span>Save Favorites</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award size={16} className="text-yellow-500" />
                                        <span>Earn Rewards</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-orange-500" />
                                        <span>Track Orders</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </SignedOut>
                
                <SignedIn>
                    {/* Premium Profile Card */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B00] via-pink-500 to-purple-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <Card className="relative bg-white border-2 border-orange-100">
                            <div className="p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    {/* Premium Avatar with Ring */}
                                    <div className="relative">
                                        <div className="absolute -inset-2 bg-gradient-to-r from-[#FF6B00] via-pink-500 to-purple-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#FF6B00] via-[#FF8C3A] to-pink-500 rounded-full flex items-center justify-center ring-4 ring-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                            {clerkUser?.imageUrl ? (
                                                <img src={clerkUser.imageUrl} alt={clerkUser.fullName || 'User'} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User size={48} className="text-white" strokeWidth={2.5} />
                                            )}
                                        </div>
                                        {/* Premium Badge */}
                                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 ring-4 ring-white shadow-lg">
                                            <Star size={16} className="text-white fill-white" />
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FF6B00] to-pink-500 bg-clip-text text-transparent">
                                                {clerkUser?.fullName || clerkUser?.firstName || 'User'}
                                            </h2>
                                            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                                PRO
                                            </span>
                                        </div>
                                        <p className="text-[#6C757D] mb-4 font-medium">{clerkUser?.primaryEmailAddress?.emailAddress || ''}</p>

                                        {/* Stats Row */}
                                        <div className="flex items-center justify-center sm:justify-start gap-6 text-sm">
                                            <div className="text-center sm:text-left">
                                                <p className="font-bold text-[#FF6B00] text-lg">24</p>
                                                <p className="text-[#6C757D] text-xs">Orders</p>
                                            </div>
                                            <div className="w-px h-8 bg-gray-200"></div>
                                            <div className="text-center sm:text-left">
                                                <p className="font-bold text-purple-500 text-lg">1,250</p>
                                                <p className="text-[#6C757D] text-xs">Points</p>
                                            </div>
                                            <div className="w-px h-8 bg-gray-200"></div>
                                            <div className="text-center sm:text-left">
                                                <p className="font-bold text-green-500 text-lg">Gold</p>
                                                <p className="text-[#6C757D] text-xs">Tier</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] hover:from-[#FF8C3A] hover:to-[#FF6B00] text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                            aria-label="Edit your profile"
                                            onClick={() => router.push('/user-profile')}
                                        >
                                            <Settings size={18} />
                                            Edit Profile
                                        </button>
                                        <div className="flex items-center justify-center">
                                            <UserButton afterSignOutUrl="/" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </SignedIn>
                {/* End of authentication check */}

                {/* Account Sections */}
                <div className="mt-8 space-y-8">
                    {accountLinks.map((section, sectionIndex) => (
                        <div key={section.section} className="animate-fade-in" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
                                <h3 className="text-sm font-bold text-[#212529] uppercase tracking-wider px-4 py-2 bg-orange-50 rounded-full border-2 border-orange-100">
                                    {section.section}
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {section.items.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={item.href}
                                            className="group relative bg-white border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                            aria-label={`${item.label}: ${item.description}`}
                                        >
                                            {/* Gradient Background on Hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="relative flex items-start gap-4">
                                                {/* Icon with Gradient Background */}
                                                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                                    <Icon size={24} className="text-white" strokeWidth={2.5} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-[#212529] group-hover:text-[#FF6B00] transition-colors">
                                                            {item.label}
                                                        </h4>
                                                        {item.badge && (
                                                            <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full animate-pulse">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-[#6C757D] mb-2 line-clamp-1">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {/* Arrow Icon */}
                                                <ChevronRight
                                                    size={20}
                                                    className="text-[#6C757D] group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                                                />
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium Logout Button */}
                <div className="mt-8 relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                    <Card className="relative border-2 border-red-100 hover:border-red-200 transition-colors">
                        <button
                            className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-all duration-300 text-red-500 group"
                            aria-label="Logout from your account"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <LogOut size={24} className="text-white" strokeWidth={2.5} />
                                </div>
                                <div className="text-left">
                                    <span className="font-bold text-lg block">Logout</span>
                                    <span className="text-sm text-red-400">Sign out of your account</span>
                                </div>
                            </div>
                            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </Card>
                </div>

                {/* App Info Footer */}
                <div className="mt-12 text-center space-y-2 pb-4">
                    <div className="flex items-center justify-center gap-2 text-[#6C757D]">
                        <Sparkles size={16} className="text-[#FF6B00]" />
                        <p className="text-sm font-medium">Made with love for food lovers</p>
                        <Sparkles size={16} className="text-[#FF6B00]" />
                    </div>
                    <p className="text-[#6C757D] text-xs">Version 1.0.0 • © 2025 FoodPapa</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}
