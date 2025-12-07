'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@clerk/nextjs';
import { useAccessibility } from '@/lib/accessibility-context';
import { Home, CreditCard, MapPin, Clock, Percent, ChevronRight, ArrowLeft, Check, AlertCircle, Bike, Gift } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import SpeakButton from '@/components/ui/SpeakButton';

export default function CheckoutPage() {
    const router = useRouter();
    const { userId } = useAuth();
    const { cart, clearCart } = useCart();
    const { settings } = useAccessibility();
    const [deliveryOption, setDeliveryOption] = useState<'standard' | 'priority'>('standard');
    const [paymentMethod, setPaymentMethod] = useState('visa-2013');
    const [contactlessDelivery, setContactlessDelivery] = useState(false);
    const [tipAmount, setTipAmount] = useState(100);
    const [saveTip, setSaveTip] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.items.length === 0) {
            router.push('/');
        }
    }, [cart.items.length, router]);

    if (cart.items.length === 0) {
        return null;
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
    const deliveryFee = 0; // Free delivery
    const serviceFee = 11.20;
    const priorityFee = deliveryOption === 'priority' ? 50 : 0;
    const vat = 0;
    const total = subtotal + deliveryFee + serviceFee + priorityFee + vat + tipAmount;
    const originalTotal = total + 297.20; // Simulated savings

    const restaurant = cart.items[0]?.restaurantName || 'Restaurant';

    const paymentMethods = [
        { id: 'space-credits', type: 'SpaceX Credits', last4: '4200', icon: '🚀' },
        { id: 'moon-coin', type: 'MoonCoin', last4: '6969', icon: '🌙' },
        { id: 'mars-bucks', type: 'MarsBucks', last4: '1337', icon: '🪐', primary: true },
    ];

    const tipOptions = [
        { label: 'Not now', value: 0 },
        { label: 'Rs. 50.00 (Coffee)', value: 50 },
        { label: 'Rs. 100.00 (Oxygen tank)', value: 100, popular: true },
        { label: 'Rs. 200.00 (Rocket fuel)', value: 200 },
    ];

    const handlePlaceOrder = async () => {
        if (!userId) {
            router.push('/login?redirect=/checkout');
            return;
        }

        setIsPlacingOrder(true);

        try {
            // Create new order object
            const newOrder = {
                id: `ORD-${Date.now()}`,
                restaurantId: cart.items[0]?.restaurantId || 'unknown',
                restaurantName: cart.items[0]?.restaurantName || 'Unknown Restaurant',
                items: cart.items.map(item => ({
                    name: item.foodItem.name,
                    quantity: item.quantity,
                    price: item.foodItem.price
                })),
                total: total,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            // Save to localStorage
            const storageKey = userId ? `foodhub_orders_${userId}` : 'foodhub_orders_guest';
            const existingOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
            localStorage.setItem(storageKey, JSON.stringify([newOrder, ...existingOrders]));

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clear cart and redirect
            clearCart();
            router.push('/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 pb-32">
            {/* Header */}
            <div className="bg-white border-b-2 border-orange-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} className="text-[#212529]" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-[#212529]">Review and place your order</h1>
                            <p className="text-sm text-[#6C757D]">Complete your purchase</p>
                        </div>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Review and place your order. You are ordering from ${restaurant}. Your total is ${total.toFixed(2)} rupees.`}
                                size="md"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-bold text-[#212529] flex items-center gap-2">
                                    <div className="p-2 bg-linear-to-br from-[#FF6B00] to-[#FF8C3A] rounded-lg">
                                        <MapPin size={20} className="text-white" />
                                    </div>
                                    Delivery address
                                </h2>
                                <div className="flex items-center gap-2">
                                    {settings.audioAssistance && (
                                        <SpeakButton
                                            text="Delivery address: Home, Red Planet Residences, Mars, Crater Olympus Mons East, Unit 42. Tap Change to modify your delivery address."
                                            size="sm"
                                        />
                                    )}
                                    <button className="text-[#FF6B00] font-semibold hover:text-[#FF8C3A] transition-colors">
                                        Change
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 mb-4">
                                <Home size={20} className="text-[#6C757D] mt-1" />
                                <div>
                                    <p className="font-semibold text-[#212529]">Home</p>
                                    <p className="text-[#6C757D]">Red Planet Residences, Mars</p>
                                    <p className="text-[#6C757D]">Crater: Olympus Mons East, Unit 42</p>
                                </div>
                            </div>

                            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                                <p className="text-xs text-[#FF6B00] font-semibold mb-2">Note to rider - e.g. building, landmark</p>
                                <p className="text-sm text-[#6C757D]">
                                    Look for the big red rock. Third dome on the left, next to Elon&apos;s Tesla. Can&apos;t miss it! 🚀
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-orange-100">
                                <span className="text-[#212529] font-medium">Contactless delivery</span>
                                <button
                                    onClick={() => setContactlessDelivery(!contactlessDelivery)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${contactlessDelivery ? 'bg-linear-to-r from-[#FF6B00] to-[#FF8C3A]' : 'bg-gray-300'
                                        }`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${contactlessDelivery ? 'translate-x-6' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        </div>

                        {/* Delivery Options */}
                        <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-[#212529] flex items-center gap-2">
                                    <div className="p-2 bg-linear-to-br from-blue-100 to-blue-50 rounded-lg">
                                        <Clock size={20} className="text-blue-600" />
                                    </div>
                                    Delivery options
                                </h2>
                                {settings.audioAssistance && (
                                    <SpeakButton
                                        text={`Delivery options. Standard delivery takes 15 to 30 minutes and is free. Priority delivery takes 10 to 25 minutes and costs 50 rupees extra. Currently selected: ${deliveryOption} delivery.`}
                                        size="sm"
                                    />
                                )}
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setDeliveryOption('standard')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all ${deliveryOption === 'standard'
                                        ? 'border-[#FF6B00] bg-orange-50'
                                        : 'border-gray-200 hover:border-orange-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'standard' ? 'border-[#FF6B00]' : 'border-gray-300'
                                                }`}>
                                                {deliveryOption === 'standard' && (
                                                    <div className="w-3 h-3 rounded-full bg-[#FF6B00]" />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-[#212529]">Standard</p>
                                                <p className="text-sm text-[#6C757D]">15 – 30 mins</p>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setDeliveryOption('priority')}
                                    className={`w-full p-4 rounded-xl border-2 transition-all ${deliveryOption === 'priority'
                                        ? 'border-[#FF6B00] bg-orange-50'
                                        : 'border-gray-200 hover:border-orange-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'priority' ? 'border-[#FF6B00]' : 'border-gray-300'
                                                }`}>
                                                {deliveryOption === 'priority' && (
                                                    <div className="w-3 h-3 rounded-full bg-[#FF6B00]" />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-[#212529]">Priority</p>
                                                <p className="text-sm text-[#6C757D]">10 – 25 mins</p>
                                            </div>
                                        </div>
                                        <span className="text-[#FF6B00] font-semibold">+ Rs. 50.00</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-[#212529] flex items-center gap-2">
                                    <div className="p-2 bg-linear-to-br from-green-100 to-green-50 rounded-lg">
                                        <CreditCard size={20} className="text-green-600" />
                                    </div>
                                    Payment
                                </h2>
                                <div className="flex items-center gap-2">
                                    {settings.audioAssistance && (
                                        <SpeakButton
                                            text={`Payment methods available. ${paymentMethods.map(m => `${m.type} ending in ${m.last4}`).join(', ')}. Currently selected: ${paymentMethods.find(m => m.id === paymentMethod)?.type || 'none'}.`}
                                            size="sm"
                                        />
                                    )}
                                    <button className="text-[#FF6B00] font-semibold hover:text-[#FF8C3A] transition-colors">
                                        Show all
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all ${paymentMethod === method.id
                                            ? 'border-[#FF6B00] bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-[#FF6B00]' : 'border-gray-300'
                                                    }`}>
                                                    {paymentMethod === method.id && (
                                                        <div className="w-3 h-3 rounded-full bg-[#FF6B00]" />
                                                    )}
                                                </div>
                                                <span className="text-2xl">{method.icon}</span>
                                                <div className="text-left">
                                                    <p className="font-semibold text-[#212529]">{method.type}</p>
                                                    <p className="text-sm text-[#6C757D]">•••• {method.last4}</p>
                                                </div>
                                            </div>
                                            {method.primary && (
                                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}

                                <button className="w-full p-4 border-2 border-dashed border-orange-200 rounded-xl hover:border-[#FF6B00] hover:bg-orange-50 transition-all flex items-center justify-center gap-2 text-[#FF6B00] font-semibold">
                                    <Gift size={20} />
                                    Apply a voucher
                                </button>
                            </div>
                        </div>

                        {/* Tip Your Rider */}
                        <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-[#212529] flex items-center gap-2">
                                    <div className="p-2 bg-linear-to-br from-purple-100 to-purple-50 rounded-lg">
                                        <Bike size={20} className="text-purple-600" />
                                    </div>
                                    Tip your Rider
                                </h2>
                                {settings.audioAssistance && (
                                    <SpeakButton
                                        text={`Tip your rider. Your delivery person receives 100% of the tip. Options: No tip, 50 rupees, 100 rupees, or 200 rupees. Currently selected: ${tipAmount === 0 ? 'No tip' : `${tipAmount} rupees`}.`}
                                        size="sm"
                                    />
                                )}
                            </div>
                            <p className="text-sm text-[#6C757D] mb-4">Help fuel their jetpack! 🚀 Your astronaut receives 100% of the tip</p>

                            <div className="flex flex-wrap gap-3 mb-4">
                                {tipOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setTipAmount(option.value)}
                                        className={`px-4 py-2.5 rounded-xl font-semibold transition-all ${tipAmount === option.value
                                            ? 'bg-linear-to-r from-[#FF6B00] to-[#FF8C3A] text-white shadow-md'
                                            : 'bg-gray-100 text-[#6C757D] hover:bg-orange-50 hover:text-[#FF6B00] border-2 border-transparent hover:border-orange-200'
                                            } ${option.popular ? 'relative' : ''}`}
                                    >
                                        {option.label}
                                        {option.popular && tipAmount === option.value && (
                                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">
                                                Popular
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSaveTip(!saveTip)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${saveTip ? 'bg-[#FF6B00] border-[#FF6B00]' : 'border-gray-300'
                                        }`}
                                >
                                    {saveTip && <Check size={14} className="text-white" />}
                                </button>
                                <label className="text-sm text-[#212529] font-medium">
                                    Save it for the next order
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 shadow-lg sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-[#212529]">Your order from</h2>
                                {settings.audioAssistance && (
                                    <SpeakButton
                                        text={`Order summary from ${restaurant}. ${cart.items.map(item => `${item.quantity} ${item.foodItem.name} for ${(item.foodItem.price * item.quantity).toFixed(2)} rupees`).join(', ')}. Subtotal: ${subtotal.toFixed(2)} rupees. Service fee: ${serviceFee.toFixed(2)} rupees. ${tipAmount > 0 ? `Rider tip: ${tipAmount} rupees.` : ''} Total: ${total.toFixed(2)} rupees.`}
                                        size="sm"
                                    />
                                )}
                            </div>
                            <p className="text-[#FF6B00] font-semibold text-lg mb-6">{restaurant}</p>

                            {/* Order Items */}
                            <div className="space-y-3 mb-6 pb-6 border-b-2 border-orange-100">
                                {cart.items.map((item) => (
                                    <div key={item.foodItem.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#6C757D] font-medium">{item.quantity} x</span>
                                            <span className="text-[#212529] font-medium">{item.foodItem.name}</span>
                                        </div>
                                        <span className="text-[#212529] font-semibold">
                                            Rs. {(item.foodItem.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b-2 border-orange-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6C757D]">Subtotal</span>
                                    <span className="text-[#212529] font-semibold">Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6C757D]">Standard delivery</span>
                                    <span className="text-green-600 font-semibold">Free</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6C757D]">Service fee</span>
                                    <span className="text-[#212529] font-semibold">Rs. {serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#6C757D]">VAT</span>
                                    <span className="text-[#212529] font-semibold">Rs. {vat.toFixed(2)}</span>
                                </div>
                                {tipAmount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#6C757D]">Rider&apos;s Tip</span>
                                        <span className="text-[#212529] font-semibold">Rs. {tipAmount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl font-bold text-[#212529]">Total</span>
                                <span className="text-2xl font-bold text-[#FF6B00]">
                                    Rs. {total.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-6">
                                <span className="text-[#6C757D]">(incl. fees and tax)</span>
                                <span className="text-[#6C757D] line-through">Rs. {originalTotal.toFixed(2)}</span>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full py-4 bg-linear-to-r from-[#FF6B00] to-[#FF8C3A] hover:from-[#FF8C3A] hover:to-[#FF6B00] text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPlacingOrder ? 'Placing order...' : 'Place order'}
                            </button>

                            <p className="text-xs text-[#6C757D] mt-4 text-center">
                                By making this purchase you agree to our terms and conditions.
                            </p>
                            <p className="text-xs text-[#6C757D] mt-2 text-center">
                                I agree that placing the order places me under an obligation to make a payment in accordance with the General Terms and Conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
