'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Star, Plus, Heart, Info, Flame, CheckCircle, Search, Minus, Trash2, ShoppingBag, User, MessageSquare, ThumbsUp, X, MapPin, Clock, Phone, Mail } from 'lucide-react';
import ResetCartModal from '@/components/modals/ResetCartModal';
import BottomNav from '@/components/layout/BottomNav';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
import SpeakButton from '@/components/ui/SpeakButton';
import { restaurants } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { useAccessibility } from '@/lib/accessibility-context';
import { FoodItem } from '@/lib/types';

export default function RestaurantPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart, cart, clearCart, updateQuantity, removeFromCart } = useCart();
    const { settings } = useAccessibility();
    const [showResetModal, setShowResetModal] = useState(false);
    const [pendingItem, setPendingItem] = useState<{
        foodItem: FoodItem;
        quantity: number;
        restaurantId: string;
        restaurantName: string;
    } | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
    const [showShareToast, setShowShareToast] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const showPastOrders = true;

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, text: '' });
    const [reviews, setReviews] = useState([
        {
            id: 1,
            user: 'Ali Khan',
            rating: 5,
            date: '2 days ago',
            text: 'Amazing food! The butter chicken was absolutely delicious. Will order again.',
            helpful: 12
        },
        {
            id: 2,
            user: 'Sara Ahmed',
            rating: 4,
            date: '1 week ago',
            text: 'Great taste but delivery was a bit late. Packaging was good though.',
            helpful: 8
        },
        {
            id: 3,
            user: 'Bilal',
            rating: 5,
            date: '2 weeks ago',
            text: 'Best burgers in town! Highly recommended.',
            helpful: 5
        }
    ]);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        const review = {
            id: reviews.length + 1,
            user: 'You',
            rating: newReview.rating,
            date: 'Just now',
            text: newReview.text,
            helpful: 0
        };
        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, text: '' });
        setShowReviewModal(false);
    };

    const restaurant = restaurants.find((r) => r.slug === params.slug);

    useEffect(() => {
        if (showShareToast) {
            const timer = setTimeout(() => setShowShareToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showShareToast]);

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-[#6C757D]">Restaurant not found</p>
            </div>
        );
    }

    // Group menu items by category
    const groupedMenu = restaurant.menu.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, FoodItem[]>);

    const handleAddToCart = (foodItem: FoodItem) => {
        if (restaurant.isClosed) {
            addToast('This restaurant is currently closed', 'error');
            return;
        }

        const cartItem = {
            foodItem,
            quantity: 1,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name
        };

        const success = addToCart(cartItem);

        if (success) {
            addToast('Added to cart', 'success');
        } else {
            // Different restaurant - show modal
            setPendingItem(cartItem);
            setShowResetModal(true);
        }
    };

    const handleReorder = () => {
        if (restaurant.isClosed) {
            addToast('This restaurant is currently closed', 'error');
            return;
        }

        // Since past orders are mock data, we'll add the first item from the menu
        // In a real app, we would have the exact item IDs from the order history
        const itemToAdd = restaurant.menu[0];

        if (itemToAdd) {
            handleAddToCart(itemToAdd);
        }
    };

    const handleConfirmReset = () => {
        if (pendingItem) {
            clearCart();
            addToCart(pendingItem);
            setPendingItem(null);
        }
        setShowResetModal(false);
    };

    // Mock past orders data
    const pastOrders = [
        {
            id: 1,
            name: 'Almighty Butter ...',
            subtitle: 'Lemon & Mint M...',
            items: 4,
            date: '21 Apr',
            image: restaurant.menu[0]?.image || restaurant.image
        },
        {
            id: 2,
            name: 'Almighty Butter ...',
            subtitle: 'A.B.C',
            items: 2,
            date: '11 Jan',
            image: restaurant.menu[1]?.image || restaurant.image
        },
        {
            id: 3,
            name: 'Falsa',
            subtitle: 'A.B.C',
            items: 2,
            date: '9 May',
            image: restaurant.menu[2]?.image || restaurant.image
        }
    ];

    // Available categories for navigation - only show categories that exist in this restaurant's menu
    const availableCategories = ['Popular', ...Object.keys(groupedMenu)];

    return (
        <div className="min-h-screen bg-white pb-24 md:pb-16">
            {/* Desktop Header */}
            <div className="bg-white border-b border-gray-200 lg:block hidden">
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="flex items-start gap-6">
                        {/* Back button */}
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>

                        {/* Restaurant image */}
                        <div className="relative shrink-0 w-28 h-28 rounded-2xl overflow-hidden border border-gray-200">
                            <Image
                                src={restaurant.image}
                                alt={restaurant.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Restaurant info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-[#FF6B00] mb-2">
                                        {restaurant.name}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm mb-3">
                                        <span className="px-3 py-1 bg-[#FF6B00] text-white rounded-full font-medium">
                                            {restaurant.cuisine}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="px-3 py-1 bg-blue-500 text-white rounded-full font-medium">
                                            In-Store Price
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <Heart
                                        size={24}
                                        className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                                    />
                                </button>
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-green-50 rounded-lg p-4 mb-3 border border-green-200">
                                <div className="flex items-center flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className="text-green-600" />
                                        <span className="text-gray-700">Rs. 129 delivery or</span>
                                        <span className="px-3 py-1 bg-green-600 text-white rounded-lg font-bold text-xs">
                                            FREE with Rs. 599
                                        </span>
                                    </div>
                                    <span className="text-gray-400">•</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700">Min. order</span>
                                        <span className="px-3 py-1 bg-[#FF6B00] text-white rounded-lg font-bold">Rs. 249</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating & Actions */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
                                    <Star size={18} className="fill-yellow-500 text-yellow-500" />
                                    <span className="font-bold text-gray-900">{restaurant.rating}</span>
                                    <span className="text-gray-600">/5</span>
                                    <span className="text-gray-500 text-sm">(500+)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden bg-[#FF6B00]">
                <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-white truncate">{restaurant.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-white/90">
                                <Star size={14} className="fill-white text-white" />
                                <span className="font-bold">{restaurant.rating}/5</span>
                                <span>(500+)</span>
                                <span>•</span>
                                <span>{restaurant.cuisine}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Heart
                                size={20}
                                className={`transition-colors ${isFavorite ? 'fill-white text-white' : 'text-white'}`}
                            />
                        </button>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between text-xs text-white">
                            <span>Min. order Rs. 249</span>
                            <span>•</span>
                            <span className="font-bold">FREE delivery on Rs. 599+</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Past Orders Section */}
            {showPastOrders && pastOrders.length > 0 && (
                <div className="bg-orange-50 border-b border-gray-200 p-6 hidden lg:block">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                Your past orders with this restaurant ⚡
                            </h2>
                            <p className="text-sm text-gray-600">Order again with one click</p>
                        </div>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                            {pastOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer shrink-0 w-56 border border-gray-200"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                            <Image
                                                src={order.image}
                                                alt={order.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-sm truncate">
                                                {order.name}
                                            </h3>
                                            <p className="text-xs text-gray-600 truncate">{order.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                        <div className="text-xs text-gray-600">
                                            <span className="font-bold text-[#FF6B00]">{order.items} items</span>
                                            <span> • {order.date}</span>
                                        </div>
                                        <button
                                            onClick={handleReorder}
                                            className="p-2 bg-[#FF6B00] hover:bg-[#FF8C3A] rounded-lg transition-colors"
                                            aria-label="Reorder"
                                        >
                                            <Plus size={16} className="text-white" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Available Deals */}
            <div className="bg-white border-b border-gray-200 p-6 hidden lg:block">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Available deals 🔥</h2>
                        <p className="text-sm text-gray-600">Exclusive offers just for you</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                                    <Star size={14} className="fill-yellow-300 text-yellow-300" />
                                    PRO
                                </div>
                                <span className="font-bold text-purple-900 text-xl">Free delivery 🚚</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">Min. order Rs. 599. Valid for all items. Auto applied.</p>
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold">
                                <CheckCircle size={14} />
                                Auto applied at checkout
                            </div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="px-3 py-1 bg-[#FF6B00] text-white rounded-lg text-sm font-bold flex items-center gap-2">
                                    <Star size={14} className="fill-yellow-300 text-yellow-300" />
                                    PRO
                                </div>
                                <span className="font-bold text-[#FF6B00] text-xl">15% off 🎁</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">No min. order required. Valid for selected items. Auto applied.</p>
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold">
                                <CheckCircle size={14} />
                                Auto applied at checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-center max-w-7xl mx-auto">
                    {['menu', 'reviews', 'info'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab
                                ? 'border-[#FF6B00] text-[#FF6B00]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'menu' && (
                <>
                    {/* Category Navigation & Search */}
                    <div className="sticky top-14 z-30 bg-linear-to-r from-orange-50 to-white border-b-2 border-orange-100 shadow-md">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 py-3 bg-white/80 backdrop-blur-sm">
                            <div className="p-2 bg-linear-to-br from-orange-100 to-orange-50 rounded-lg shrink-0">
                                <Search size={18} className="text-[#FF6B00]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search in menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 outline-none text-sm bg-transparent placeholder:text-[#6C757D]"
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 pb-3 pt-2">
                            {availableCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 shrink-0 text-sm ${selectedCategory === category
                                        ? 'bg-linear-to-r from-[#FF6B00] to-[#FF8C3A] text-white shadow-md scale-105'
                                        : 'bg-white border-2 border-orange-100 text-[#6C757D] hover:border-[#FF6B00] hover:text-[#FF6B00]'
                                        }`}
                                >
                                    {category}
                                    {category === 'Popular' && ' (6)'}
                                    {category === 'Shakes' && ' (4)'}
                                    {category === 'ICECREAMS' && ' (15)'}
                                    {category === 'COLD COFFEES' && ' (3)'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content with Sidebar */}
                    <div className="max-w-7xl mx-auto flex gap-6 pb-32 md:pb-20">
                        {/* Menu Content */}
                        <div className="flex-1 px-3 md:px-4">
                            {/* Popular Section */}
                            {(selectedCategory === 'Popular' || !selectedCategory) && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-2 mt-4 pb-3 border-b-2 border-orange-100">
                                        <div className="p-2 bg-linear-to-br from-[#FF6B00] to-[#FF8C3A] rounded-lg">
                                            <Flame size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-[#212529]">Popular</h2>
                                            <p className="text-xs text-[#6C757D]">Most ordered right now</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {restaurant.menu.slice(0, 6).filter(item =>
                                            !searchQuery ||
                                            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).map((item) => {
                                            const originalPrice = Math.floor(item.price * 1.18);

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="bg-white border-2 border-orange-100 rounded-2xl hover:shadow-xl hover:border-[#FF6B00] transition-all duration-300 overflow-visible group relative"
                                                >
                                                    {/* Audio Assistance Speaker Button */}
                                                    {settings.audioAssistance && (
                                                        <div className="absolute top-2 right-2 z-40">
                                                            <SpeakButton
                                                                text={`${item.name}. Price: ${item.price} rupees. ${item.description || ''}`}
                                                                size="sm"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex gap-4 p-4">
                                                        {/* Item Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-[#212529] text-base mb-1 group-hover:text-[#FF6B00] transition-colors">
                                                                {item.name}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-[#FF6B00] font-bold text-sm">Rs. {item.price}</span>
                                                                <span className="text-[#6C757D] line-through text-xs">Rs. {originalPrice}</span>
                                                            </div>
                                                            <p className="text-[#6C757D] text-xs line-clamp-2">
                                                                {item.description || 'Creamy dessert with a crumbly base, topped with fresh strawberries and...'}
                                                            </p>
                                                        </div>

                                                        {/* Item Image */}
                                                        <div className="relative shrink-0">
                                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden ring-2 ring-orange-100 group-hover:ring-[#FF6B00]">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            {/* Add button */}
                                                            <button
                                                                onClick={() => handleAddToCart(item)}
                                                                className={`absolute bottom-1 right-1 w-8 h-8 rounded-full border-2 border-white hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95 ${restaurant.isClosed
                                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                                    : 'bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A]'
                                                                    }`}
                                                            >
                                                                <Plus size={16} className="text-white" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Other Categories */}
                            {Object.entries(groupedMenu)
                                .filter(([category]) =>
                                    (selectedCategory !== 'Popular' && (!selectedCategory || category === selectedCategory)) ||
                                    (!selectedCategory)
                                )
                                .map(([category, items]) => {
                                    const filteredItems = items.filter(item =>
                                        !searchQuery ||
                                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
                                    );

                                    if (filteredItems.length === 0) return null;

                                    return (
                                        <div key={category} className="mb-8">
                                            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-orange-100">
                                                <div className="p-2 bg-linear-to-br from-orange-100 to-orange-50 rounded-lg">
                                                    <span className="text-2xl">
                                                        {category === 'Pizza' ? '🍕' :
                                                            category === 'Burgers' ? '🍔' :
                                                                category === 'Sandwiches' ? '🥪' :
                                                                    category === 'Appetizers' ? '🥗' :
                                                                        category === 'Salads' ? '🥗' :
                                                                            category === 'Desserts' ? '🍰' : '🍽️'}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl font-bold text-[#212529]">{category}</h2>
                                            </div>

                                            <div className="space-y-4">
                                                {filteredItems.map((item) => {
                                                    const originalPrice = Math.floor(item.price * 1.18);

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="bg-white border-2 border-orange-100 rounded-2xl hover:shadow-xl hover:border-[#FF6B00] transition-all duration-300 overflow-visible group relative"
                                                        >
                                                            {/* Audio Assistance Speaker Button */}
                                                            {settings.audioAssistance && (
                                                                <div className="absolute top-2 right-2 z-40">
                                                                    <SpeakButton
                                                                        text={`${item.name}. Price: ${item.price} rupees. ${item.description || ''}`}
                                                                        size="sm"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex gap-4 p-4">
                                                                {/* Item Info */}
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-bold text-[#212529] text-base mb-1 group-hover:text-[#FF6B00] transition-colors">
                                                                        {item.name}
                                                                    </h3>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-[#FF6B00] font-bold text-sm">Rs. {item.price}</span>
                                                                        <span className="text-[#6C757D] line-through text-xs">Rs. {originalPrice}</span>
                                                                    </div>
                                                                    <p className="text-[#6C757D] text-xs line-clamp-2">
                                                                        {item.description || 'Regular/Large'}
                                                                    </p>
                                                                </div>

                                                                {/* Item Image */}
                                                                <div className="relative shrink-0">
                                                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden ring-2 ring-orange-100 group-hover:ring-[#FF6B00]">
                                                                        <Image
                                                                            src={item.image}
                                                                            alt={item.name}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    {/* Add button */}
                                                                    <button
                                                                        onClick={() => handleAddToCart(item)}
                                                                        className={`absolute bottom-1 right-1 w-8 h-8 rounded-full border-2 border-white hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95 ${restaurant.isClosed
                                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                                            : 'bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A]'
                                                                            }`}
                                                                    >
                                                                        <Plus size={16} className="text-white" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}

                            {/* Empty state if no results */}
                            {searchQuery && Object.entries(groupedMenu).every(([, items]) =>
                                items.filter(item =>
                                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
                                ).length === 0
                            ) && (
                                    <div className="text-center py-16">
                                        <p className="text-[#6C757D] text-lg">No items found matching &quot;{searchQuery}&quot;</p>
                                    </div>
                                )}
                        </div>

                        {/* Sidebar - Cart */}
                        <div className="hidden lg:block w-96 shrink-0">
                            <div className="sticky top-24 bg-linear-to-br from-orange-50 to-white border-2 border-orange-100 rounded-2xl p-5 shadow-lg">
                                {/* Cart Header */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-orange-200">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-linear-to-br from-[#FF6B00] to-[#FF8C3A] rounded-lg">
                                            <ShoppingBag size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#212529]">Your Cart</h3>
                                            <p className="text-xs text-[#6C757D]">
                                                {cart.items.length === 0 ? 'Empty' : `${cart.items.reduce((sum, item) => sum + item.quantity, 0)} items`}
                                            </p>
                                        </div>
                                    </div>
                                    {cart.items.length > 0 && (
                                        <button
                                            onClick={clearCart}
                                            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                                        >
                                            <Trash2 size={14} />
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {/* Cart Items */}
                                {cart.items.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-linear-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShoppingBag size={32} className="text-[#FF6B00]" />
                                        </div>
                                        <p className="text-[#6C757D] font-medium mb-2">Your cart is empty</p>
                                        <p className="text-sm text-[#6C757D]">Add items from the menu to get started</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4 pr-2">
                                            {cart.items.map((cartItem) => (
                                                <div
                                                    key={cartItem.foodItem.id}
                                                    className="bg-white border border-orange-100 rounded-xl p-3 hover:shadow-md transition-all duration-200 relative"
                                                >
                                                    {/* Audio Assistance Speaker Button */}
                                                    {settings.audioAssistance && (
                                                        <div className="absolute top-1 right-1 z-40">
                                                            <SpeakButton
                                                                text={`${cartItem.foodItem.name}. Quantity: ${cartItem.quantity}. Price: ${cartItem.foodItem.price * cartItem.quantity} rupees. ${cartItem.foodItem.price} rupees each.`}
                                                                size="sm"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex gap-3 mb-3">
                                                        {/* Item Image */}
                                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                                            <Image
                                                                src={cartItem.foodItem.image}
                                                                alt={cartItem.foodItem.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        {/* Item Info */}
                                                        <div className="flex-1 min-w-0 pr-6">
                                                            <h4 className="font-semibold text-[#212529] text-sm mb-1 line-clamp-1">
                                                                {cartItem.foodItem.name}
                                                            </h4>
                                                            <p className="text-[#FF6B00] font-bold text-sm">
                                                                Rs. {cartItem.foodItem.price * cartItem.quantity}
                                                            </p>
                                                            <p className="text-xs text-[#6C757D]">
                                                                Rs. {cartItem.foodItem.price} each
                                                            </p>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => removeFromCart(cartItem.foodItem.id)}
                                                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors shrink-0 mt-6"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-[#6C757D] font-medium">Quantity</span>
                                                        <div className="flex items-center gap-2 bg-linear-to-r from-orange-50 to-orange-100 rounded-lg p-1">
                                                            <button
                                                                onClick={() => updateQuantity(cartItem.foodItem.id, cartItem.quantity - 1)}
                                                                className="w-7 h-7 flex items-center justify-center bg-white hover:bg-linear-to-br hover:from-[#FF6B00] hover:to-[#FF8C3A] text-[#FF6B00] hover:text-white rounded-md transition-all duration-200 font-bold shadow-sm"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="font-bold text-[#212529] min-w-6 text-center">
                                                                {cartItem.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(cartItem.foodItem.id, cartItem.quantity + 1)}
                                                                className="w-7 h-7 flex items-center justify-center bg-linear-to-br from-[#FF6B00] to-[#FF8C3A] text-white hover:shadow-md rounded-md transition-all duration-200 font-bold"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Cart Summary */}
                                        <div className="border-t-2 border-orange-200 pt-4 space-y-3 relative">
                                            {/* Audio Assistance - Read Cart Total */}
                                            {settings.audioAssistance && (
                                                <div className="absolute top-2 right-0 z-40">
                                                    <SpeakButton
                                                        text={`Your cart total. ${cart.items.length} items. Subtotal: ${cart.items.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0)} rupees. Delivery: Free. Service fee: 11 rupees 20 paisa. Total: ${(cart.items.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0) + 11.20).toFixed(0)} rupees.`}
                                                        size="sm"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[#6C757D]">Subtotal</span>
                                                <span className="font-bold text-[#212529]">
                                                    Rs. {cart.items.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[#6C757D]">Delivery</span>
                                                    <div className="bg-linear-to-r from-[#FF6B00] to-[#FF8C3A] text-white px-2 py-0.5 rounded text-xs font-bold">FREE</div>
                                                </div>
                                                <span className="text-green-600 font-semibold line-through">Rs. 129</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[#6C757D]">Service fee</span>
                                                <span className="font-bold text-[#212529]">Rs. 11.20</span>
                                            </div>

                                            <div className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-3 flex items-center gap-2">
                                                <CheckCircle size={18} className="text-green-600 shrink-0" />
                                                <span className="text-green-700 text-sm font-semibold">Free delivery applied!</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-orange-200">
                                                <span className="font-bold text-[#212529]">Total</span>
                                                <span className="font-bold text-[#FF6B00] text-2xl">
                                                    Rs. {(cart.items.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0) + 11.20).toFixed(2)}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => router.push('/cart')}
                                                className="w-full py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] hover:from-[#FF8C3A] hover:to-[#FF6B00] text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                            >
                                                <ShoppingBag size={20} />
                                                Proceed to Checkout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </>
            )}

            {activeTab === 'reviews' && (
                <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                            <p className="text-gray-500">What people are saying</p>
                        </div>
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="px-6 py-3 bg-[#FF6B00] text-white rounded-xl font-bold hover:bg-[#FF8C3A] transition-colors shadow-lg flex items-center gap-2"
                        >
                            <MessageSquare size={20} />
                            Write a Review
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{review.user}</h3>
                                            <p className="text-xs text-gray-500">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                                        <Star size={14} className="fill-[#FF6B00] text-[#FF6B00]" />
                                        <span className="font-bold text-[#FF6B00]">{review.rating}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{review.text}</p>
                                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B00] transition-colors">
                                    <ThumbsUp size={16} />
                                    Helpful ({review.helpful})
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'info' && (
                <div className="max-w-4xl mx-auto px-4 py-8 pb-32 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="text-[#FF6B00]" /> Operating Hours
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Monday - Friday</span>
                                <span className="font-medium">11:00 AM - 11:00 PM</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Saturday - Sunday</span>
                                <span className="font-medium">11:00 AM - 12:00 AM</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-[#FF6B00]" /> Location
                        </h3>
                        <p className="text-gray-600 mb-4">123 Food Street, Culinary District, City Center</p>
                        <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            Map View Placeholder
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="text-[#FF6B00]" /> Contact
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone size={18} />
                                <span>+92 300 1234567</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail size={18} />
                                <span>contact@{restaurant.slug}.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                            <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                size={32}
                                                className={`${star <= newReview.rating
                                                    ? 'fill-[#FF6B00] text-[#FF6B00]'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    value={newReview.text}
                                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none resize-none h-32"
                                    placeholder="Tell us about your experience..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-[#FF6B00] text-white rounded-xl font-bold hover:bg-[#FF8C3A] transition-colors"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Share Toast Notification */}
            {showShareToast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-[#212529] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                        <CheckCircle size={20} className="text-green-400" />
                        <span className="font-semibold">Link copied to clipboard!</span>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Reset Cart Modal */}
            <ResetCartModal
                isOpen={showResetModal}
                onClose={() => {
                    setShowResetModal(false);
                    setPendingItem(null);
                }}
                onConfirm={handleConfirmReset}
            />

            {/* Mobile Bottom Cart Bar */}
            {cart.items.length > 0 && (
                <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-linear-to-r from-orange-50 to-white border-t-2 border-orange-200 shadow-2xl">
                    {/* Free Delivery Banner */}
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 border-b-2 border-green-200 px-4 py-2 flex items-center justify-center gap-2">
                        <CheckCircle size={16} className="text-green-600 shrink-0" />
                        <span className="text-green-700 text-sm font-semibold">Free delivery applied!</span>
                    </div>

                    {/* View Cart Button */}
                    <div className="px-4 py-3 bg-linear-to-br from-orange-50 to-transparent">
                        <button
                            onClick={() => router.push('/cart')}
                            className="w-full py-3.5 bg-linear-to-r from-[#FF6B00] to-[#FF8C3A] hover:from-[#FF8C3A] hover:to-[#FF6B00] text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-between px-6 transform active:scale-95"
                        >
                            <div className="flex items-center gap-2">
                                <div className="bg-white/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold border border-white/50">
                                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                                </div>
                                <span>View Cart</span>
                            </div>
                            <span className="font-bold">Rs. {(cart.items.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0) + 11.20).toFixed(2)}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
