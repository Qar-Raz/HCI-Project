'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Minus, Trash2, ShoppingBag, Undo2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SpeakButton from '@/components/ui/SpeakButton';
import { useCart } from '@/lib/cart-context';
import { CartItem } from '@/lib/types';
import { useAccessibility } from '@/lib/accessibility-context';
import { restaurants } from '@/lib/data';

// Undo popup component
interface UndoPopupProps {
    item: CartItem;
    onUndo: () => void;
    onDismiss: () => void;
    timeLeft: number;
}

function UndoPopup({ item, onUndo, onDismiss, timeLeft }: UndoPopupProps) {
    const { settings } = useAccessibility();

    return (
        <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up">
            <div className="max-w-7xl mx-auto">
                <div className="bg-[#212529] text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4">
                    {/* Item thumbnail */}
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden">
                        <Image
                            src={item.foodItem.image}
                            alt={item.foodItem.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Message */}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.foodItem.name} removed</p>
                        <p className="text-gray-400 text-sm">Tap undo to restore ({timeLeft}s)</p>
                    </div>

                    {/* Audio assistance for undo */}
                    {settings.audioAssistance && (
                        <SpeakButton
                            text={`${item.foodItem.name} has been removed from your cart. Tap the undo button to restore it. You have ${timeLeft} seconds.`}
                            size="sm"
                            className="bg-white/20! hover:bg-white/30!"
                        />
                    )}

                    {/* Undo button */}
                    <button
                        onClick={onUndo}
                        className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white px-4 py-2 rounded-xl font-semibold transition-colors"
                    >
                        <Undo2 size={18} />
                        Undo
                    </button>

                    {/* Dismiss button */}
                    <button
                        onClick={onDismiss}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                        className="h-full bg-[#FF6B00] transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / 5) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, addToCart, clearCart, getCartTotal } = useCart();
    const { settings } = useAccessibility();

    // Undo state
    const [deletedItem, setDeletedItem] = useState<CartItem | null>(null);
    const [undoTimeLeft, setUndoTimeLeft] = useState(5);

    // Handle item removal with undo capability
    const handleRemoveItem = useCallback((itemId: string) => {
        const itemToRemove = cart.items.find(item => item.foodItem.id === itemId);
        if (itemToRemove) {
            setDeletedItem({ ...itemToRemove });
            setUndoTimeLeft(5);
            removeFromCart(itemId);
        }
    }, [cart.items, removeFromCart]);

    // Handle undo
    const handleUndo = useCallback(() => {
        if (deletedItem) {
            // Re-add the item with its original quantity
            addToCart({
                foodItem: deletedItem.foodItem,
                quantity: deletedItem.quantity,
                restaurantId: deletedItem.restaurantId,
                restaurantName: deletedItem.restaurantName
            });
            setDeletedItem(null);
        }
    }, [deletedItem, addToCart]);

    // Handle dismiss
    const handleDismiss = useCallback(() => {
        setDeletedItem(null);
    }, []);

    // Countdown timer for undo popup
    useEffect(() => {
        if (!deletedItem) return;

        if (undoTimeLeft > 0) {
            const timer = setTimeout(() => {
                setUndoTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [deletedItem, undoTimeLeft]);

    // Clear deleted item when countdown reaches 0
    useEffect(() => {
        if (deletedItem && undoTimeLeft === 0) {
            const clearTimer = setTimeout(() => {
                setDeletedItem(null);
            }, 100);
            return () => clearTimeout(clearTimer);
        }
    }, [deletedItem, undoTimeLeft]);

    const restaurant = restaurants.find((r) => r.id === cart.restaurantId);
    const subtotal = getCartTotal();
    const deliveryFee = 50;
    const discount = restaurant?.discount
        ? Math.round(subtotal * (restaurant.discount / 100))
        : 0;
    const total = subtotal + deliveryFee - discount;

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={64} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#212529] mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-[#6C757D] mb-6">
                        Add items from a restaurant to get started
                    </p>
                    <Button onClick={() => router.push('/')}>
                        Browse Restaurants
                    </Button>
                </div>
            </div>
        );
    }

    const isRestaurantClosed = restaurant?.isClosed;

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-[#212529]">Cart</h1>
                        <button
                            onClick={clearCart}
                            className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center gap-1"
                        >
                            <Trash2 size={16} />
                            Remove All
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Restaurant Info */}
                {restaurant && (
                    <Card className="mb-4">
                        <div className="p-4">
                            <h2 className="font-bold text-[#212529] text-lg mb-1">
                                {restaurant.name}
                            </h2>
                            <p className="text-[#6C757D] text-sm">{restaurant.cuisine}</p>
                        </div>
                    </Card>
                )}

                {/* Closed Restaurant Warning */}
                {isRestaurantClosed && (
                    <div className="mb-4 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <p className="text-red-600 font-semibold text-center">
                            ⚠️ This restaurant is currently closed and will not accept orders
                        </p>
                    </div>
                )}

                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                    {cart.items.map((item) => (
                        <Card key={item.foodItem.id} className="overflow-visible">
                            <div className="flex gap-4 p-4">
                                {/* Item Image */}
                                <div className="relative w-20 h-20 shrink-0">
                                    <Image
                                        src={item.foodItem.image}
                                        alt={item.foodItem.name}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-2 mb-1">
                                        <h3 className="font-bold text-[#212529] truncate">
                                            {item.foodItem.name}
                                        </h3>
                                        {/* Audio Assistance Speaker Button - Next to item name */}
                                        {settings.audioAssistance && (
                                            <SpeakButton
                                                text={`${item.foodItem.name}. Quantity: ${item.quantity}. Price: ${item.foodItem.price * item.quantity} rupees. ${item.foodItem.price} rupees each.`} size="sm"
                                                className="shrink-0"
                                            />
                                        )}
                                    </div>
                                    <p className="text-[#FF6B00] font-bold mb-2">
                                        Rs {item.foodItem.price} × {item.quantity} = Rs {item.foodItem.price * item.quantity}
                                    </p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg w-fit">
                                        <button
                                            onClick={() => updateQuantity(item.foodItem.id, item.quantity - 1)}
                                            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <Minus size={16} className="text-[#6C757D]" />
                                        </button>
                                        <span className="text-[#212529] font-medium w-8 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.foodItem.id, item.quantity + 1)}
                                            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <Plus size={16} className="text-[#6C757D]" />
                                        </button>
                                    </div>
                                </div>

                                {/* Delete Button - Separated on the right */}
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleRemoveItem(item.foodItem.id)}
                                        className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200 border-2 border-red-200 hover:border-red-500"
                                        aria-label={`Remove ${item.foodItem.name} from cart`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <Card className="mb-6 relative overflow-visible">
                    {/* Audio Assistance - Read Order Summary */}
                    {settings.audioAssistance && (
                        <div className="absolute top-2 right-2 z-40">
                            <SpeakButton
                                text={`Order Summary. Subtotal: ${subtotal} rupees. Delivery Fee: ${deliveryFee} rupees. ${discount > 0 ? `Discount: ${discount} rupees off.` : ''} Total: ${total} rupees.`}
                                size="sm"
                            />
                        </div>
                    )}
                    <div className="p-4 space-y-3">
                        <h3 className="font-bold text-[#212529] text-lg mb-3 pr-8">
                            Order Summary
                        </h3>
                        <div className="flex justify-between text-[#6C757D]">
                            <span>Subtotal</span>
                            <span>Rs {subtotal}</span>
                        </div>
                        <div className="flex justify-between text-[#6C757D]">
                            <span>Delivery Fee</span>
                            <span>Rs {deliveryFee}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-[#28A745]">
                                <span>Discount ({restaurant?.discount}%)</span>
                                <span>-Rs {discount}</span>
                            </div>
                        )}
                        <div className="border-t pt-3 flex justify-between text-[#212529] font-bold text-lg">
                            <span>Total</span>
                            <span>Rs {total}</span>
                        </div>
                    </div>
                </Card>

                {/* Confirm Order Button */}
                <Button
                    size="lg"
                    className="w-full"
                    disabled={isRestaurantClosed}
                    onClick={() => {
                        router.push('/checkout');
                    }}
                >
                    {isRestaurantClosed ? 'Restaurant Closed' : 'Proceed to Checkout'}
                </Button>
            </div>

            {/* Undo Popup */}
            {deletedItem && (
                <UndoPopup
                    item={deletedItem}
                    onUndo={handleUndo}
                    onDismiss={handleDismiss}
                    timeLeft={undoTimeLeft}
                />
            )}

            {/* Animation styles */}
            <style jsx global>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
