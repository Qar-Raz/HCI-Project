'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, X, SlidersHorizontal, Star, Clock, MapPin, TrendingUp, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import RestaurantCard from '@/components/shared/RestaurantCard';
import { restaurants, cuisineCategories } from '@/lib/data';
import { useAccessibility } from '@/lib/accessibility-context';

type SortOption = 'relevance' | 'rating' | 'distance' | 'time';

function SearchContent() {
    const { settings } = useAccessibility();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') ? decodeURIComponent(searchParams.get('q')!) : '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('relevance');
    const [minRating, setMinRating] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [showOpenOnly, setShowOpenOnly] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Filter and sort restaurants
    const filteredAndSortedRestaurants = useMemo(() => {
        const filtered = restaurants.filter((restaurant) => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (restaurant.menu && restaurant.menu.some(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                ));

            // Cuisine filter
            const matchesCuisine = selectedCuisines.length === 0 ||
                selectedCuisines.includes(restaurant.cuisine);

            // Rating filter
            const matchesRating = restaurant.rating >= minRating;

            // Open only filter
            const matchesOpen = !showOpenOnly || !restaurant.isClosed;

            return matchesSearch && matchesCuisine && matchesRating && matchesOpen;
        });

        // Sort results
        switch (sortBy) {
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'distance':
                filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                break;
            case 'time':
                filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
                break;
            default:
                // relevance - keep default order
                break;
        }

        return filtered;
    }, [searchQuery, selectedCuisines, sortBy, minRating, showOpenOnly]);

    const toggleCuisine = (cuisine: string) => {
        setSelectedCuisines(prev =>
            prev.includes(cuisine)
                ? prev.filter(c => c !== cuisine)
                : [...prev, cuisine]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCuisines([]);
        setSortBy('relevance');
        setMinRating(0);
        setShowOpenOnly(false);
    };

    const activeFiltersCount =
        selectedCuisines.length +
        (minRating > 0 ? 1 : 0) +
        (showOpenOnly ? 1 : 0) +
        (sortBy !== 'relevance' ? 1 : 0);

    const popularSearches = ['Pizza', 'Burger', 'Sushi', 'Italian', 'Chinese', 'Dessert'];
    const recentSearches = ['Thai Food', 'Fast Food', 'Healthy'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] via-white to-[#F8F9FA] pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-[#FF6B00] via-[#FF7A1F] to-[#FF8C3A] sticky top-0 z-40 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 pb-8">
                    {/* Title */}
                    <div className="flex items-center justify-between mb-6">

                        {(searchQuery || activeFiltersCount > 0) && (
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 border border-white/30"
                            >
                                <X size={18} />
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Enhanced Search Bar */}
                    <div className="relative">
                        <div className="relative">
                            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D]" />
                            <input
                                id="search-input"
                                type="text"
                                placeholder="Search restaurants, dishes, cuisines..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                className="w-full pl-12 pr-12 py-4 bg-white border-2 border-white/50 rounded-2xl focus:outline-none focus:border-white focus:ring-4 focus:ring-white/30 transition-all duration-300 placeholder:text-[#6C757D] text-lg shadow-2xl"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-[#6C757D]" />
                                </button>
                            )}
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {isSearchFocused && !searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 animate-in z-50">
                                {/* Popular Searches */}
                                <div className="mb-5">
                                    <p className="text-xs font-bold text-[#6C757D] mb-3 flex items-center gap-2">
                                        <TrendingUp size={14} />
                                        POPULAR SEARCHES
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.map((search) => (
                                            <button
                                                key={search}
                                                onClick={() => setSearchQuery(search)}
                                                className="px-4 py-2.5 bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8C3A]/10 hover:from-[#FF6B00]/20 hover:to-[#FF8C3A]/20 text-[#FF6B00] rounded-xl text-sm font-semibold transition-all duration-300 border border-[#FF6B00]/20 hover:scale-105"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Searches */}
                                <div>
                                    <p className="text-xs font-bold text-[#6C757D] mb-3 flex items-center gap-2">
                                        <Clock size={14} />
                                        RECENT SEARCHES
                                    </p>
                                    <div className="space-y-2">
                                        {recentSearches.map((search) => (
                                            <button
                                                key={search}
                                                onClick={() => setSearchQuery(search)}
                                                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between group"
                                            >
                                                <span className="text-[#212529] font-medium">{search}</span>
                                                <SearchIcon size={16} className="text-[#6C757D] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-white/30"
                    >
                        <SlidersHorizontal size={20} />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="bg-white text-[#FF6B00] text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-2">
                                {activeFiltersCount}
                            </span>
                        )}
                        {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 shadow-lg animate-in">
                    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                        {/* Sort Options */}
                        <div>
                            <label className="text-sm font-bold text-[#212529] mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-[#FF6B00]" />
                                Sort By
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'relevance' as SortOption, label: 'Relevance', icon: TrendingUp },
                                    { value: 'rating' as SortOption, label: 'Rating', icon: Star },
                                    { value: 'distance' as SortOption, label: 'Distance', icon: MapPin },
                                    { value: 'time' as SortOption, label: 'Delivery Time', icon: Clock }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSortBy(option.value)}
                                        className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${sortBy === option.value
                                            ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-[#6C757D] hover:bg-gray-200'
                                            }`}
                                    >
                                        <option.icon size={18} />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label className="text-sm font-bold text-[#212529] mb-3 flex items-center gap-2">
                                <Star size={16} className="text-[#FF6B00]" />
                                Minimum Rating
                            </label>
                            <div className="flex gap-2">
                                {[0, 3, 3.5, 4, 4.5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setMinRating(rating)}
                                        className={`flex-1 px-3 py-3 rounded-xl font-semibold transition-all duration-300 ${minRating === rating
                                            ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-[#6C757D] hover:bg-gray-200'
                                            }`}
                                    >
                                        {rating === 0 ? 'All' : `${rating}+`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cuisines Filter */}
                        <div>
                            <label className="text-sm font-bold text-[#212529] mb-3 block">
                                Cuisines
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {cuisineCategories.map((cuisine) => (
                                    <button
                                        key={cuisine.id}
                                        onClick={() => toggleCuisine(cuisine.name)}
                                        className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${selectedCuisines.includes(cuisine.name)
                                            ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-[#6C757D] hover:bg-gray-200'
                                            }`}
                                    >
                                        <span>{cuisine.icon}</span>
                                        {cuisine.name}
                                        {selectedCuisines.includes(cuisine.name) && (
                                            <X size={16} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle Filters */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-semibold text-[#212529]">Show Open Only</p>
                                <p className="text-sm text-[#6C757D]">Hide closed restaurants</p>
                            </div>
                            <button
                                onClick={() => setShowOpenOnly(!showOpenOnly)}
                                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${showOpenOnly ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A]' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${showOpenOnly ? 'translate-x-7' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Results Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-[#212529]">
                                {searchQuery ? 'Search Results' : 'All Restaurants'}
                            </h2>
                            <p className="text-[#6C757D] mt-1">
                                Found <span className="font-bold text-[#FF6B00]">{filteredAndSortedRestaurants.length}</span> restaurant{filteredAndSortedRestaurants.length !== 1 ? 's' : ''}
                                {searchQuery && <span> for &quot;<span className="font-semibold text-[#212529]">{searchQuery}</span>&quot;</span>}
                            </p>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedCuisines.length > 0 || minRating > 0 || showOpenOnly) && (
                        <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF8C3A]/5 rounded-xl border border-[#FF6B00]/10">
                            <span className="text-sm font-semibold text-[#6C757D]">Active Filters:</span>
                            {selectedCuisines.map((cuisine) => (
                                <span key={cuisine} className="px-3 py-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                                    {cuisine}
                                    <button onClick={() => toggleCuisine(cuisine)} className="hover:bg-white/20 rounded-full p-0.5">
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            {minRating > 0 && (
                                <span className="px-3 py-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                                    Rating {minRating}+
                                    <button onClick={() => setMinRating(0)} className="hover:bg-white/20 rounded-full p-0.5">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                            {showOpenOnly && (
                                <span className="px-3 py-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                                    Open Only
                                    <button onClick={() => setShowOpenOnly(false)} className="hover:bg-white/20 rounded-full p-0.5">
                                        <X size={14} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Restaurant Grid */}
                {filteredAndSortedRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedRestaurants.map((restaurant, index) => (
                            <div
                                key={restaurant.id}
                                className="zoom-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <RestaurantCard restaurant={restaurant} pictorialMode={settings.pictorialMenu} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 animate-in">
                        <div className="text-8xl mb-6">🔍</div>
                        <h3 className="text-3xl font-bold text-[#212529] mb-3">No restaurants found</h3>
                        <p className="text-[#6C757D] text-lg mb-8">
                            {searchQuery
                                ? `No results for "${searchQuery}". Try a different search or adjust your filters.`
                                : 'Try adjusting your filters to see more results.'
                            }
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-xl mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4"></div>
                        <div className="grid gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
