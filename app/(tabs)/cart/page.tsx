'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useCart } from '@/lib/cart-context';
import { restaurants } from '@/lib/data';

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

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
                <div className="max-w-screen-xl mx-auto px-4 py-4">
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

            <div className="max-w-screen-xl mx-auto px-4 py-6">
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
                        <Card key={item.foodItem.id}>
                            <div className="flex gap-4 p-4">
                                <div className="relative w-20 h-20 flex-shrink-0">
                                    <Image
                                        src={item.foodItem.image}
                                        alt={item.foodItem.name}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#212529] mb-1">
                                        {item.foodItem.name}
                                    </h3>
                                    <p className="text-[#FF6B00] font-bold">
                                        Rs {item.foodItem.price}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => removeFromCart(item.foodItem.id)}
                                        className="text-red-500 hover:text-red-600 p-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
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
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <Card className="mb-6">
                    <div className="p-4 space-y-3">
                        <h3 className="font-bold text-[#212529] text-lg mb-3">
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
        </div>
    );
}
