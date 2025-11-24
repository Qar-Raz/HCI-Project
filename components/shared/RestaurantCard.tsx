'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, MapPin, TrendingUp, Heart } from 'lucide-react';
import Card from '@/components/ui/Card';
import { Restaurant } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

type RestaurantCardProps = {
    restaurant: Restaurant;
    pictorialMode?: boolean;
};

export default function RestaurantCard({ restaurant, pictorialMode = false }: RestaurantCardProps) {
    const { userId } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if favorite on mount
    useEffect(() => {
        const checkFavorite = () => {
            try {
                const storageKey = userId ? `foodhub_favorites_${userId}` : 'foodhub_favorites_guest';
                const storedFavorites = localStorage.getItem(storageKey);
                if (storedFavorites) {
                    const favorites = JSON.parse(storedFavorites);
                    const isFav = favorites.some((fav: any) => fav.id === restaurant.id);
                    setIsFavorite(isFav);
                } else {
                    setIsFavorite(false);
                }
            } catch (error) {
                console.error('Error checking favorites:', error);
            }
        };
        
        checkFavorite();
        
        // Listen for storage events to update state across components
        window.addEventListener('storage', checkFavorite);
        // Also listen for custom event for same-window updates
        window.addEventListener('favorites-updated', checkFavorite);
        
        return () => {
            window.removeEventListener('storage', checkFavorite);
            window.removeEventListener('favorites-updated', checkFavorite);
        };
    }, [userId, restaurant.id]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        
        setIsLoading(true);
        try {
            const storageKey = userId ? `foodhub_favorites_${userId}` : 'foodhub_favorites_guest';
            const storedFavorites = localStorage.getItem(storageKey);
            let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            
            if (isFavorite) {
                // Remove from favorites
                favorites = favorites.filter((fav: any) => fav.id !== restaurant.id);
                setIsFavorite(false);
            } else {
                // Add to favorites
                favorites.push(restaurant);
                setIsFavorite(true);
            }
            
            localStorage.setItem(storageKey, JSON.stringify(favorites));
            
            // Dispatch a custom event so other components update immediately
            window.dispatchEvent(new Event('favorites-updated'));
            window.dispatchEvent(new Event('storage'));
            
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link href={`/restaurant/${restaurant.slug}`} className="group relative block">
            <Card className={`w-full shrink-0 hover:scale-[1.02] transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#FF6B00]/20 card-shine ${pictorialMode ? 'h-[320px]' : ''}`}>
                <div className={`relative ${pictorialMode ? 'h-64' : 'h-44'} overflow-hidden transition-all duration-300`}>
                    <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Favorite Button */}
                    <button
                        onClick={toggleFavorite}
                        disabled={isLoading}
                        className="absolute top-3 right-3 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all active:scale-95"
                    >
                        <Heart 
                            size={20} 
                            className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                        />
                    </button>

                    {/* Discount Badge */}
                    {restaurant.discount && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-in">
                            <TrendingUp size={12} />
                            {restaurant.discount}% OFF
                        </div>
                    )}

                    {/* Rating Badge */}
                    {restaurant.rating >= 4.5 && !restaurant.isClosed && (
                        <div className="absolute top-12 right-3 bg-white/95 backdrop-blur-sm text-[#212529] text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                            <Star size={12} className="fill-[#FFC107] text-[#FFC107]" />
                            {restaurant.rating}
                        </div>
                    )}

                    {/* Closed Overlay */}
                    {restaurant.isClosed && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-white font-bold text-xl mb-2 block">CLOSED</span>
                                <span className="text-white/80 text-sm">Opens Tomorrow</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-white">
                    <h3 className={`font-bold text-[#212529] ${pictorialMode ? 'text-2xl text-center' : 'text-lg'} mb-2 truncate group-hover:text-[#FF6B00] transition-colors`}>
                        {restaurant.name}
                    </h3>

                    {!pictorialMode && (
                        <>
                            {/* Rating & Cuisine */}
                            <div className="flex items-center gap-2 text-sm mb-3">
                                <div className="flex items-center gap-1 bg-gradient-to-r from-[#FFF8E1] to-[#FFECB3] px-2.5 py-1 rounded-lg">
                                    <Star size={13} className="fill-[#FFC107] text-[#FFC107]" />
                                    <span className="font-bold text-[#212529]">{restaurant.rating}</span>
                                    <span className="text-[#6C757D]">({restaurant.reviews})</span>
                                </div>
                                <span className="text-[#6C757D]">•</span>
                                <span className="font-medium text-[#6C757D] bg-gray-100 px-2.5 py-1 rounded-lg">
                                    {restaurant.cuisine}
                                </span>
                            </div>

                            {/* Delivery Info */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1.5 text-[#6C757D]">
                                    <Clock size={15} className="text-[#FF6B00]" />
                                    <span className="font-medium">{restaurant.deliveryTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#6C757D]">
                                    <MapPin size={15} className="text-[#FF6B00]" />
                                    <span className="font-medium">{restaurant.distance}</span>
                                </div>
                            </div>

                            {/* Hover CTA */}
                            <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="text-[#FF6B00] font-semibold text-sm flex items-center justify-center gap-1">
                                    View Menu
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </Link>
    );
}
