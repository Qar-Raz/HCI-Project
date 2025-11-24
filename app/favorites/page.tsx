'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, Heart } from 'lucide-react';
import RestaurantCard from '@/components/shared/RestaurantCard';
import { Restaurant } from '@/lib/types';

export default function FavoritesPage() {
    const router = useRouter();
    const { userId } = useAuth();
    const [favorites, setFavorites] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = () => {
            try {
                const storageKey = userId ? `foodhub_favorites_${userId}` : 'foodhub_favorites_guest';
                const storedFavorites = localStorage.getItem(storageKey);
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                } else {
                    setFavorites([]);
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();

        // Listen for storage events to update list if items are removed
        window.addEventListener('storage', loadFavorites);
        window.addEventListener('favorites-updated', loadFavorites);
        
        return () => {
            window.removeEventListener('storage', loadFavorites);
            window.removeEventListener('favorites-updated', loadFavorites);
        };
    }, [userId]);

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 shadow-sm">
                <div className="p-4 flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-[#212529]" />
                    </button>
                    <h1 className="text-xl font-bold text-[#212529]">My Favorites</h1>
                </div>
            </div>

            <div className="p-4 max-w-screen-xl mx-auto">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
                    </div>
                ) : favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map(restaurant => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={32} className="text-gray-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">No favorites yet</h2>
                        <p className="text-gray-500 mb-6">Start exploring and save your favorite restaurants!</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-[#FF6B00] text-white rounded-xl font-bold hover:bg-[#FF8C3A] transition-colors"
                        >
                            Explore Restaurants
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
