'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Search, X, TrendingUp, Sparkles, ChevronRight, Mic, Star, Clock, Zap } from 'lucide-react';
import Input from '@/components/ui/Input';
import RestaurantCard from '@/components/shared/RestaurantCard';
import SpeakButton from '@/components/ui/SpeakButton';
import { restaurants, cuisineCategories } from '@/lib/data';
import { useTranslation } from '@/lib/use-translation';
import { useAccessibility } from '@/lib/accessibility-context';
import { useLocation } from '@/lib/location-context';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';

export default function Home() {
    const router = useRouter();
    const { t } = useTranslation();
    const { settings } = useAccessibility();
    const { currentAddress, locationUpdated, setLocationUpdated } = useLocation();
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const allRestaurantsRef = useRef<HTMLElement>(null);
    const [announceMessage, setAnnounceMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Scroll to all restaurants section
    const scrollToRestaurants = () => {
        allRestaurantsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setAnnounceMessage('Scrolled to all restaurants');
    };

    useEffect(() => {
        if (locationUpdated) {
            const newToast: ToastMessage = {
                id: Date.now().toString(),
                message: 'Location updated successfully',
                type: 'success'
            };
            setToasts(prev => [...prev, newToast]);
            setLocationUpdated(false);

            // Auto remove after 3s
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newToast.id));
            }, 3000);
        }
    }, [locationUpdated, setLocationUpdated]);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Filter restaurants based on search and cuisine
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter((restaurant) => {
            const matchesSearch = searchQuery === '' ||
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCuisine = !selectedCuisine ||
                restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase();

            return matchesSearch && matchesCuisine;
        });
    }, [searchQuery, selectedCuisine]);

    const popularRestaurants = useMemo(() =>
        filteredRestaurants.filter((r) => !r.isClosed).slice(0, 4),
        [filteredRestaurants]
    );

    const bestReviewed = useMemo(() =>
        filteredRestaurants.filter((r) => r.rating >= 4.7),
        [filteredRestaurants]
    );

    const handleCuisineClick = (cuisineName: string) => {
        setSelectedCuisine(selectedCuisine === cuisineName ? null : cuisineName);
        setAnnounceMessage(`${cuisineName} cuisine ${selectedCuisine === cuisineName ? 'deselected' : 'selected'}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedCuisine(null);
        setAnnounceMessage('All filters cleared');
        searchInputRef.current?.focus();
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            // Navigate to search page with search query
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const startVoiceSearch = () => {
        if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const newToast: ToastMessage = {
                id: Date.now().toString(),
                message: 'Speech recognition is not supported in this browser',
                type: 'error'
            };
            setToasts(prev => [...prev, newToast]);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            setAnnounceMessage(`Voice search: ${transcript}`);
        };

        recognition.onerror = () => {
            setIsListening(false);
            const newToast: ToastMessage = {
                id: Date.now().toString(),
                message: 'Voice search failed. Please try again.',
                type: 'error'
            };
            setToasts(prev => [...prev, newToast]);
        };

        try {
            recognition.start();
        } catch (error) {
            setIsListening(false);
            const newToast: ToastMessage = {
                id: Date.now().toString(),
                message: 'Could not start voice search',
                type: 'error'
            };
            setToasts(prev => [...prev, newToast]);
        }
    };

    const stopVoiceSearch = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    const skipToMainContent = () => {
        mainContentRef.current?.focus();
        mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const popularSearches = ['Pizza', 'Burger', 'Sushi', 'Italian'];

    // Generate announcement message for screen readers
    const resultCount = filteredRestaurants.length;
    const resultMessage = `Found ${resultCount} restaurant${resultCount !== 1 ? 's' : ''}${searchQuery ? ` matching "${searchQuery}"` : ''
        }${selectedCuisine ? ` in ${selectedCuisine}` : ''}`;

    return (
        <div className="min-h-screen bg-linear-to-b from-[#F8F9FA] to-[#E9ECEF]">
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                onClick={(e) => {
                    e.preventDefault();
                    skipToMainContent();
                }}
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#FF6B00] focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
            >
                Skip to main content
            </a>

            {/* Screen reader announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announceMessage || resultMessage}
            </div>

            {/* Header with Glass Effect */}
            <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-gray-100" role="banner">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    {/* Logo Row */}
                    <div className="flex items-center justify-between mb-3">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                {/* Logo Circle with Gradient */}
                                <div className="w-11 h-11 bg-linear-to-br from-[#FF6B00] via-[#FF7A1F] to-[#FF8C3A] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden">
                                    {/* Animated shine effect */}
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                                    {/* Icon */}
                                    <span className="text-2xl relative z-10" role="img" aria-label="FoodPapa logo">👨‍🍳</span>
                                </div>
                                {/* Decorative ring */}
                                <div className="absolute -inset-1 bg-linear-to-br from-[#FF6B00]/20 to-[#FF8C3A]/20 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold bg-linear-to-r from-[#FF6B00] to-[#FF8C3A] bg-clip-text text-transparent leading-none">
                                    {t('home.title')}
                                </h1>
                                <p className="text-[10px] text-[#6C757D] font-medium">{t('home.subtitle')}</p>
                            </div>
                        </div>

                        {/* Location & Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/location')}
                                className="flex items-center gap-2 group hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2 rounded-lg p-1.5 -m-1.5"
                                aria-label={`Your location: ${currentAddress}. Click to change location`}
                            >
                                <div className="p-1.5 bg-linear-to-br from-[#FF6B00] to-[#FF8C3A] rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300" aria-hidden="true">
                                    <MapPin size={16} className="text-white" />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-semibold text-[#212529] flex items-center gap-0.5">
                                        {t('home.yourLocation')}
                                        <ChevronRight size={12} className="text-[#6C757D]" aria-hidden="true" />
                                    </p>
                                    <p className="text-[10px] text-[#6C757D] max-w-[150px] truncate">{currentAddress}</p>
                                </div>
                            </button>
                            {(searchQuery || selectedCuisine) && (
                                <button
                                    onClick={clearSearch}
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all duration-300 animate-in focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    aria-label={`Clear all filters. Currently filtering by ${selectedCuisine || ''} ${searchQuery ? `and searching for ${searchQuery}` : ''}`}
                                >
                                    <X size={18} aria-hidden="true" />
                                    <span className="sr-only">Clear filters</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="relative" role="search">
                        <label htmlFor="restaurant-search" className="sr-only">
                            {t('home.searchPlaceholder')}
                        </label>
                        <div className="relative">
                            <Input
                                id="restaurant-search"
                                ref={searchInputRef}
                                placeholder={t('home.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                icon={<Search size={20} className="text-[#FF6B00]" aria-hidden="true" />}
                                aria-describedby={searchQuery ? 'search-hint' : undefined}
                                aria-autocomplete="list"
                                className="pr-12"
                            />
                            <button
                                onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2 ${isListening
                                    ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                                    : 'bg-gray-100 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white'
                                    }`}
                                aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                                title={isListening ? 'Stop voice search' : 'Start voice search'}
                            >
                                <Mic size={16} />
                            </button>
                        </div>
                        {searchQuery && (
                            <>
                                <span id="search-hint" className="sr-only">
                                    Press Enter to search, or click the X button to clear
                                </span>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setAnnounceMessage('Search cleared');
                                    }}
                                    className="absolute right-16 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                                    aria-label="Clear search input"
                                >
                                    <X size={18} className="text-[#6C757D]" aria-hidden="true" />
                                </button>
                            </>
                        )}

                        {/* Search Suggestions */}
                        {isSearchFocused && !searchQuery && (
                            <div
                                id="popular-searches"
                                role="listbox"
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 animate-in"
                            >
                                <p className="text-xs font-semibold text-[#6C757D] mb-3 flex items-center gap-2" id="popular-searches-label">
                                    <TrendingUp size={14} aria-hidden="true" />
                                    {t('home.popularSearches')}
                                </p>
                                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="popular-searches-label">
                                    {popularSearches.map((search) => (
                                        <button
                                            key={search}
                                            onClick={() => {
                                                setSearchQuery(search);
                                                setAnnounceMessage(`Searching for ${search}`);
                                            }}
                                            className="px-4 py-2 bg-linear-to-r from-[#FF6B00]/10 to-[#FF8C3A]/10 hover:from-[#FF6B00]/20 hover:to-[#FF8C3A]/20 text-[#FF6B00] rounded-full text-sm font-medium transition-all duration-300 border border-[#FF6B00]/20 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
                                            aria-label={`Search for ${search}`}
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Active Filters Display */}
                    {selectedCuisine && (
                        <div className="mt-2 flex items-center gap-2 animate-in" role="status" aria-live="polite">
                            <span className="text-[10px] font-medium text-[#6C757D]" id="active-filter-label">{t('home.filter')}</span>
                            <div className="px-2.5 py-1 bg-linear-to-r from-[#FF6B00] to-[#FF8C3A] text-white rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                                <span aria-labelledby="active-filter-label">{selectedCuisine}</span>
                                <button
                                    onClick={() => {
                                        setSelectedCuisine(null);
                                        setAnnounceMessage(`${selectedCuisine} filter removed`);
                                    }}
                                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-1 focus:ring-white"
                                    aria-label={`Remove ${selectedCuisine} filter`}
                                >
                                    <X size={12} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main
                id="main-content"
                ref={mainContentRef}
                className="max-w-7xl mx-auto px-4 py-6 space-y-6"
                tabIndex={-1}
                aria-label="Main content"
            >
                {/* Enhanced Promotional Banner - SUPER BEAUTIFUL */}
                <section
                    onClick={scrollToRestaurants}
                    className="relative h-52 md:h-56 bg-linear-to-br from-[#FF6B00] via-[#FF5722] to-[#E64A19] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer transform hover:scale-[1.02] hover:shadow-[0_25px_60px_-12px_rgba(255,107,0,0.5)] transition-all duration-500"
                    aria-labelledby="promo-heading"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && scrollToRestaurants()}
                    aria-label="Click to see all restaurants and get 30% off your first order"
                >
                    {/* Audio Assistance Speaker Button */}
                    {settings.audioAssistance && (
                        <div className="absolute top-3 right-3 z-40" onClick={(e) => e.stopPropagation()}>
                            <SpeakButton
                                text="Special Offer! Get 30% off on your first order today! Tap this banner to see all restaurants."
                                size="md"
                            />
                        </div>
                    )}

                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-black/10"></div>

                    {/* Animated Particles/Sparkles Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-4 left-[10%] w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                        <div className="absolute top-8 left-[30%] w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-300"></div>
                        <div className="absolute top-12 left-[50%] w-2 h-2 bg-yellow-200 rounded-full animate-ping delay-500 opacity-60"></div>
                        <div className="absolute top-6 left-[70%] w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
                        <div className="absolute bottom-16 left-[20%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping delay-1000 opacity-70"></div>
                        <div className="absolute bottom-8 left-[40%] w-2 h-2 bg-white rounded-full animate-pulse delay-200 opacity-50"></div>
                    </div>

                    {/* Floating Food Emojis */}
                    <div className="absolute inset-0 pointer-events-none">
                        <span className="absolute top-6 right-[15%] text-2xl opacity-30 animate-bounce delay-100">🍕</span>
                        <span className="absolute bottom-8 right-[25%] text-xl opacity-25 animate-bounce delay-300">🍟</span>
                        <span className="absolute top-16 right-[35%] text-lg opacity-20 animate-bounce delay-500">🌮</span>
                    </div>

                    {/* Glowing Orbs */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                    {/* Main Content */}
                    <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10">
                        <div className="text-white space-y-3 relative z-10 max-w-[60%] md:max-w-[50%]">
                            {/* Special Offer Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/25 backdrop-blur-md rounded-full text-xs md:text-sm font-bold border border-white/30 shadow-lg animate-pulse">
                                <Sparkles size={16} className="text-yellow-300 drop-shadow-glow" aria-hidden="true" />
                                <span className="text-yellow-100">{t('home.specialOffer')}</span>
                                <Sparkles size={16} className="text-yellow-300 drop-shadow-glow" aria-hidden="true" />
                            </div>

                            {/* Main Heading */}
                            <h2 id="promo-heading" className="text-4xl md:text-5xl lg:text-6xl font-black drop-shadow-2xl tracking-tight">
                                <span className="bg-linear-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">{t('home.getOff')}</span>
                            </h2>

                            {/* Subheading */}
                            <p className="text-lg md:text-xl font-semibold opacity-95 drop-shadow-md">
                                {t('home.firstOrder')} 🎉
                            </p>

                            {/* CTA Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    scrollToRestaurants();
                                }}
                                className="mt-2 bg-white text-[#FF6B00] px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-extrabold hover:bg-yellow-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-white/50 text-sm md:text-base group/btn"
                                aria-label="Order now and get 30% off your first order"
                            >
                                <Zap size={18} className="text-[#FF6B00] group-hover/btn:animate-pulse" />
                                <span>{t('home.orderNow')}</span>
                                <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                            </button>
                        </div>

                        {/* SUPER VISIBLE Burger Emoji with Glow Effect */}
                        <div className="relative flex items-center justify-center">
                            {/* Glowing Background Circle */}
                            <div className="absolute w-32 h-32 md:w-40 md:h-40 bg-yellow-400/40 rounded-full blur-2xl animate-pulse group-hover:bg-yellow-300/50 transition-all duration-500"></div>
                            <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-orange-300/50 rounded-full blur-xl animate-pulse delay-300"></div>

                            {/* Main Burger Emoji */}
                            <div className="relative text-7xl md:text-8xl lg:text-9xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 drop-shadow-2xl filter hover:drop-shadow-[0_0_30px_rgba(255,200,0,0.8)]" aria-hidden="true">
                                🍔
                            </div>

                            {/* Sparkle Effects Around Burger */}
                            <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
                            <div className="absolute -bottom-1 -left-3 text-xl animate-bounce delay-500">⭐</div>
                            <div className="absolute top-0 left-0 text-lg animate-ping delay-700 opacity-70">💫</div>
                        </div>
                    </div>

                    {/* Bottom Gradient Fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/20 to-transparent"></div>

                    {/* Click Indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:opacity-100 opacity-0 text-white/70 text-xs font-medium animate-bounce">
                        <span>Tap to explore</span>
                        <ChevronRight size={14} className="rotate-90" />
                    </div>
                </section>

                {/* Enhanced Cuisines Section */}
                <section className="fade-in" aria-labelledby="cuisines-heading">
                    <div className="flex items-center justify-between mb-4">
                        <h2 id="cuisines-heading" className="text-2xl font-bold text-[#212529] flex items-center gap-2">
                            {t('home.whatsOnMind')}
                            <span className="text-xl" aria-hidden="true">🤔</span>
                        </h2>
                    </div>
                    <div
                        className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 -mx-2 scrollbar-hide snap-x snap-mandatory"
                        role="group"
                        aria-label="Cuisine categories"
                    >
                        {cuisineCategories.map((cuisine, index) => (
                            <button
                                key={cuisine.id}
                                onClick={() => handleCuisineClick(cuisine.name)}
                                className={`relative flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group snap-start transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#FF6B00] focus:ring-offset-2 rounded-2xl p-2`}
                                style={{ animationDelay: `${index * 50}ms` }}
                                aria-pressed={selectedCuisine === cuisine.name}
                                aria-label={`${cuisine.name} cuisine. ${selectedCuisine === cuisine.name ? 'Currently selected' : 'Click to filter'}`}
                            >
                                {/* Audio Assistance Speaker Button */}
                                {settings.audioAssistance && (
                                    <div className="absolute -top-1 -right-1 z-40">
                                        <SpeakButton
                                            text={`${cuisine.name} food category. Tap to see ${cuisine.name} restaurants.`}
                                            size="sm"
                                        />
                                    </div>
                                )}
                                <div
                                    className={`relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 ${selectedCuisine === cuisine.name
                                        ? 'bg-linear-to-br from-[#FF6B00] to-[#FF8C3A] shadow-2xl'
                                        : 'bg-white group-hover:bg-linear-to-br group-hover:from-[#FF6B00]/10 group-hover:to-[#FF8C3A]/10'
                                        }`}
                                    aria-hidden="true"
                                >
                                    <span>
                                        {cuisine.icon}
                                    </span>
                                    {selectedCuisine === cuisine.name && (
                                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in z-10">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {!settings.iconOnlyMode && (
                                    <span
                                        className={`text-xs font-semibold transition-colors duration-300 ${selectedCuisine === cuisine.name
                                            ? 'text-[#FF6B00]'
                                            : 'text-[#212529] group-hover:text-[#FF6B00]'
                                            }`}
                                    >
                                        {cuisine.name}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Search Results Info */}
                {(searchQuery || selectedCuisine) && (
                    <div
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-in"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <p className="text-sm text-[#6C757D]">
                            {t('home.found')} <span className="font-bold text-[#FF6B00] text-lg">{filteredRestaurants.length}</span> {t('home.restaurants')}
                            {searchQuery && <span> {t('home.for')} &quot;<span className="font-semibold text-[#212529]">{searchQuery}</span>&quot;</span>}
                            {selectedCuisine && <span> {t('home.in')} <span className="font-semibold text-[#212529]">{selectedCuisine}</span></span>}
                        </p>
                    </div>
                )}

                {/* Popular Near You */}
                {popularRestaurants.length > 0 && (
                    <section className="fade-in" aria-labelledby="popular-heading">
                        <div className="flex items-center justify-between mb-4">
                            <h2 id="popular-heading" className="text-2xl font-bold text-[#212529] flex items-center gap-2">
                                <span className="text-xl" aria-hidden="true">🔥</span>
                                {!settings.iconOnlyMode && t('home.popularNearYou')}
                            </h2>
                            <button
                                className="px-3 py-1.5 text-sm text-[#FF6B00] font-semibold hover:bg-gradient-to-r hover:from-[#FF6B00] hover:to-[#FF8C3A] hover:text-white rounded-lg flex items-center gap-1 group transition-all duration-300 border-2 border-[#FF6B00]/20 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
                                aria-label="See all popular restaurants"
                            >
                                {!settings.iconOnlyMode && t('home.seeAll')}
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </button>
                        </div>
                        <div
                            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                            role="list"
                            aria-label="Popular restaurants near you"
                        >
                            {popularRestaurants.map((restaurant, index) => (
                                <div
                                    key={restaurant.id}
                                    className="snap-start"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    role="listitem"
                                >
                                    <RestaurantCard restaurant={restaurant} pictorialMode={settings.pictorialMenu} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Best Reviewed */}
                {bestReviewed.length > 0 && (
                    <section className="fade-in" aria-labelledby="best-reviewed-heading">
                        <div className="flex items-center justify-between mb-4">
                            <h2 id="best-reviewed-heading" className="text-2xl font-bold text-[#212529] flex items-center gap-2">
                                <span className="text-xl" aria-hidden="true">⭐</span>
                                {!settings.iconOnlyMode && t('home.bestReviewed')}
                            </h2>
                            <button
                                className="px-3 py-1.5 text-sm text-[#FF6B00] font-semibold hover:bg-gradient-to-r hover:from-[#FF6B00] hover:to-[#FF8C3A] hover:text-white rounded-lg flex items-center gap-1 group transition-all duration-300 border-2 border-[#FF6B00]/20 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
                                aria-label="See all best reviewed restaurants"
                            >
                                {!settings.iconOnlyMode && t('home.seeAll')}
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </button>
                        </div>
                        <div
                            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                            role="list"
                            aria-label="Best reviewed restaurants"
                        >
                            {bestReviewed.map((restaurant, index) => (
                                <div
                                    key={restaurant.id}
                                    className="snap-start"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    role="listitem"
                                >
                                    <RestaurantCard restaurant={restaurant} pictorialMode={settings.pictorialMenu} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Restaurants */}
                {filteredRestaurants.length > 0 ? (
                    <section ref={allRestaurantsRef} className="fade-in scroll-mt-24" aria-labelledby="all-restaurants-heading">
                        <h2 id="all-restaurants-heading" className="text-2xl font-bold text-[#212529] mb-4 flex items-center gap-2">
                            <span className="text-xl" aria-hidden="true">🍽️</span>
                            {!settings.iconOnlyMode && (searchQuery || selectedCuisine ? t('home.searchResults') : t('home.allRestaurants'))}
                        </h2>
                        <div
                            className={`${settings.pictorialMenu ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'}`}
                            role="list"
                            aria-label={searchQuery || selectedCuisine ? 'Filtered restaurants' : 'All restaurants'}
                        >
                            {filteredRestaurants.map((restaurant, index) => (
                                <div
                                    key={restaurant.id}
                                    className="zoom-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    role="listitem"
                                >
                                    <RestaurantCard restaurant={restaurant} pictorialMode={settings.pictorialMenu} />
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div
                        className="text-center py-16 animate-in"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="text-8xl mb-6" aria-hidden="true">🔍</div>
                        <h3 className="text-2xl font-bold text-[#212529] mb-3">{t('home.noRestaurants')}</h3>
                        <p className="text-[#6C757D] mb-6">
                            {t('home.adjustSearch')}
                        </p>
                        <button
                            onClick={clearSearch}
                            className="px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2"
                            aria-label="Clear all filters and show all restaurants"
                        >
                            {t('home.clearFilters')}
                        </button>
                    </div>
                )}
            </main>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}
