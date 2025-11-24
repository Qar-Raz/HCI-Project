'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, MapPin, Phone, Receipt, RotateCcw, MessageCircle, Star } from 'lucide-react';
import Card from '@/components/ui/Card';
import BottomNav from '@/components/layout/BottomNav';
import { useAccessibility } from '@/lib/accessibility-context';

type OrderStatus = 'delivered' | 'in-progress' | 'cancelled' | 'pending';

interface Order {
    id: string;
    restaurant: string;
    restaurantAddress?: string;
    restaurantPhone?: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: OrderStatus;
    date: string;
    time: string;
    orderId: string;
    deliveryAddress?: string;
    paymentMethod?: string;
    trackingSteps?: { label: string; completed: boolean; time?: string }[];
}

export default function OrdersPage() {
    const { userId } = useAuth();
    const { settings } = useAccessibility();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const storageKey = userId ? `foodhub_orders_${userId}` : 'foodhub_orders_guest';
                const storedOrders = localStorage.getItem(storageKey);
                if (storedOrders) {
                    const data = JSON.parse(storedOrders);
                    const mappedOrders = data.map((order: any) => ({
                        id: order.id,
                        restaurant: order.restaurantName || 'Unknown Restaurant',
                        restaurantAddress: '123 Food Street, Karachi', // Placeholder
                        restaurantPhone: '+92 300 1234567', // Placeholder
                        items: order.items,
                        total: order.total,
                        status: order.status as OrderStatus,
                        date: new Date(order.created_at).toLocaleDateString(),
                        time: new Date(order.created_at).toLocaleTimeString(),
                        orderId: order.id,
                        deliveryAddress: '456 Home Street, Apt 5B, Karachi', // Placeholder
                        paymentMethod: 'Online Payment', // Placeholder
                        trackingSteps: [
                            { label: 'Order Placed', completed: true, time: new Date(order.created_at).toLocaleTimeString() },
                            { label: 'Order Confirmed', completed: true, time: new Date(order.created_at).toLocaleTimeString() },
                            { label: 'Food Preparing', completed: order.status !== 'pending', time: '' },
                            { label: 'Out for Delivery', completed: order.status === 'delivered', time: '' },
                            { label: 'Delivered', completed: order.status === 'delivered', time: '' }
                        ]
                    }));
                    setOrders(mappedOrders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(order => order.status === filterStatus);


    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'delivered':
                return 'text-[#28A745] bg-green-50 border-green-200';
            case 'in-progress':
                return 'text-[#FF6B00] bg-orange-50 border-orange-200';
            case 'cancelled':
                return 'text-red-500 bg-red-50 border-red-200';
            default:
                return 'text-[#6C757D] bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        const iconProps = { size: 20, 'aria-hidden': 'true' };
        switch (status) {
            case 'delivered':
                return <CheckCircle {...iconProps} />;
            case 'in-progress':
                return <Clock {...iconProps} />;
            case 'cancelled':
                return <XCircle {...iconProps} />;
            default:
                return <Package {...iconProps} />;
        }
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case 'delivered':
                return 'Delivered';
            case 'in-progress':
                return 'In Progress';
            case 'cancelled':
                return 'Cancelled';
            default:
                return 'Pending';
        }
    };

    const toggleOrderExpansion = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const handleCancelOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                const storageKey = userId ? `foodhub_orders_${userId}` : 'foodhub_orders_guest';
                const storedOrders = localStorage.getItem(storageKey);
                if (storedOrders) {
                    const allOrders = JSON.parse(storedOrders);
                    const updatedOrders = allOrders.map((o: any) => 
                        o.id === orderId ? { ...o, status: 'cancelled' } : o
                    );
                    localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
                    
                    // Update local state
                    setOrders(prev => prev.map(o => 
                        o.id === orderId ? { ...o, status: 'cancelled' } : o
                    ));
                }
            } catch (error) {
                console.error('Error cancelling order:', error);
            }
        }
    };

    const statusFilters: { value: OrderStatus | 'all'; label: string; count: number }[] = [
        { value: 'all', label: 'All Orders', count: orders.length },
        { value: 'in-progress', label: 'In Progress', count: orders.filter(o => o.status === 'in-progress').length },
        { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
        { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
    ];

    return (
        <div className="min-h-screen bg-orange-50/30 pb-20">
            {/* Header */}
            <header
                className="bg-white border-b border-gray-200 sticky top-0 z-40"
                role="banner"
            >
                <div className="max-w-screen-xl mx-auto px-4 py-5">
                    <h1 className="text-2xl font-bold text-[#212529]">My Orders</h1>
                    <p className="text-sm text-[#6C757D] mt-1">Track and manage your food orders</p>
                </div>
            </header>

            <main className="max-w-screen-xl mx-auto px-4 py-6" role="main">
                {/* Filter Tabs */}
                <div
                    className="mb-6 bg-white rounded-xl p-2 shadow-sm border border-gray-200"
                    role="tablist"
                    aria-label="Order status filters"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setFilterStatus(filter.value)}
                                role="tab"
                                aria-selected={filterStatus === filter.value}
                                aria-controls={`orders-panel-${filter.value}`}
                                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${filterStatus === filter.value
                                        ? 'bg-[#FF6B00] text-white shadow-md'
                                        : 'bg-gray-50 text-[#6C757D] hover:bg-gray-100'
                                    } ${settings.focusIndicator ? 'focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2' : ''}`}
                            >
                                <span className="block">{filter.label}</span>
                                <span className={`text-xs mt-1 block ${filterStatus === filter.value ? 'text-white/90' : 'text-[#6C757D]'}`}>
                                    {filter.count} {filter.count === 1 ? 'order' : 'orders'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div
                        className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
                        role="status"
                        aria-live="polite"
                    >
                        <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={64} className="text-[#FF6B00]" aria-hidden="true" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#212529] mb-2">
                            {filterStatus === 'all' ? 'No orders yet' : `No ${getStatusText(filterStatus as OrderStatus).toLowerCase()} orders`}
                        </h2>
                        <p className="text-[#6C757D]">
                            {filterStatus === 'all'
                                ? 'Your order history will appear here'
                                : 'Try changing the filter to see other orders'}
                        </p>
                    </div>
                ) : (
                    <div
                        className="space-y-4"
                        role="tabpanel"
                        id={`orders-panel-${filterStatus}`}
                        aria-labelledby={`tab-${filterStatus}`}
                    >
                        {filteredOrders.map((order) => {
                            const isExpanded = expandedOrder === order.id;
                            return (
                                <Card
                                    key={order.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    {/* Order Header - Always Visible */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 min-w-0 mr-4">
                                                <h3 className="font-bold text-[#212529] text-lg mb-1">
                                                    {order.restaurant}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#6C757D]">
                                                    <time dateTime={`${order.date} ${order.time}`}>
                                                        {order.date} • {order.time}
                                                    </time>
                                                    <span aria-hidden="true">•</span>
                                                    <span className="font-medium">ID: {order.orderId}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div
                                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm border ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                    role="status"
                                                    aria-label={`Order status: ${getStatusText(order.status)}`}
                                                >
                                                    {getStatusIcon(order.status)}
                                                    <span className="whitespace-nowrap">{getStatusText(order.status)}</span>
                                                </div>
                                                
                                                {/* Cancel Button for Pending Orders */}
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCancelOrder(order.id);
                                                        }}
                                                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                                                        aria-label="Cancel order"
                                                    >
                                                        <XCircle size={14} />
                                                        <span>Cancel</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Processing Bar for Pending Orders */}
                                        {order.status === 'pending' && (
                                            <div className="mb-4 bg-orange-50 rounded-lg p-3 border border-orange-100">
                                                <div className="flex items-center justify-between text-xs text-orange-700 mb-2 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="relative flex h-2 w-2">
                                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                                        </span>
                                                        Restaurant is reviewing your order...
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#FF6B00] rounded-full animate-[indeterminate_1.5s_infinite_linear] w-1/3 origin-left" style={{
                                                        animation: 'indeterminate 1.5s infinite linear'
                                                    }}></div>
                                                </div>
                                                <style jsx>{`
                                                    @keyframes indeterminate {
                                                        0% { transform: translateX(-150%); }
                                                        100% { transform: translateX(350%); }
                                                    }
                                                `}</style>
                                            </div>
                                        )}

                                        {/* Order Items Summary */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-[#212529] mb-2">Order Items:</h4>
                                            <ul className="space-y-1">
                                                {order.items.map((item, index) => (
                                                    <li key={index} className="text-sm text-[#6C757D] flex justify-between">
                                                        <span>{item.quantity}x {item.name}</span>
                                                        <span className="font-medium">Rs. {item.price}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Order Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div>
                                                <span className="text-sm text-[#6C757D] block mb-1">Total Amount</span>
                                                <span className="text-xl font-bold text-[#FF6B00]">
                                                    Rs. {order.total}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => toggleOrderExpansion(order.id)}
                                                aria-expanded={isExpanded}
                                                aria-controls={`order-details-${order.id}`}
                                                className={`flex items-center gap-2 px-4 py-2 bg-[#FF6B00] hover:bg-[#FF8C3A] text-white rounded-lg font-medium transition-colors ${settings.focusIndicator ? 'focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2' : ''
                                                    }`}
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        <span>Hide Details</span>
                                                        <ChevronUp size={18} aria-hidden="true" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>View Details</span>
                                                        <ChevronDown size={18} aria-hidden="true" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div
                                            id={`order-details-${order.id}`}
                                            className="border-t border-gray-200 bg-gray-50/50 p-5 space-y-5"
                                            role="region"
                                            aria-label={`Detailed information for order ${order.orderId}`}
                                        >
                                            {/* Tracking Progress (only for in-progress orders) */}
                                            {order.status === 'in-progress' && order.trackingSteps && (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-semibold text-[#212529] mb-4 flex items-center gap-2">
                                                        <Clock size={18} className="text-[#FF6B00]" aria-hidden="true" />
                                                        Order Tracking
                                                    </h4>
                                                    <ol className="space-y-3" aria-label="Order tracking steps">
                                                        {order.trackingSteps.map((step, index) => (
                                                            <li key={index} className="flex items-start gap-3">
                                                                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-[#28A745]' : 'bg-gray-300'
                                                                    }`}>
                                                                    {step.completed && (
                                                                        <CheckCircle size={14} className="text-white" aria-hidden="true" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className={`font-medium ${step.completed ? 'text-[#212529]' : 'text-[#6C757D]'}`}>
                                                                        {step.label}
                                                                    </p>
                                                                    {step.time && (
                                                                        <time className="text-xs text-[#6C757D]">{step.time}</time>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}

                                            {/* Delivery Address */}
                                            {order.deliveryAddress && (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-semibold text-[#212529] mb-2 flex items-center gap-2">
                                                        <MapPin size={18} className="text-[#FF6B00]" aria-hidden="true" />
                                                        Delivery Address
                                                    </h4>
                                                    <address className="text-sm text-[#6C757D] not-italic">
                                                        {order.deliveryAddress}
                                                    </address>
                                                </div>
                                            )}

                                            {/* Restaurant Info */}
                                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                <h4 className="font-semibold text-[#212529] mb-3">Restaurant Information</h4>
                                                <div className="space-y-2 text-sm">
                                                    {order.restaurantAddress && (
                                                        <div className="flex items-start gap-2">
                                                            <MapPin size={16} className="text-[#6C757D] mt-0.5 flex-shrink-0" aria-hidden="true" />
                                                            <address className="text-[#6C757D] not-italic">
                                                                {order.restaurantAddress}
                                                            </address>
                                                        </div>
                                                    )}
                                                    {order.restaurantPhone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={16} className="text-[#6C757D]" aria-hidden="true" />
                                                            <a
                                                                href={`tel:${order.restaurantPhone}`}
                                                                className={`text-[#FF6B00] hover:underline ${settings.linkHighlight ? 'font-semibold' : ''
                                                                    }`}
                                                            >
                                                                {order.restaurantPhone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment Method */}
                                            {order.paymentMethod && (
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <h4 className="font-semibold text-[#212529] mb-2 flex items-center gap-2">
                                                        <Receipt size={18} className="text-[#FF6B00]" aria-hidden="true" />
                                                        Payment Method
                                                    </h4>
                                                    <p className="text-sm text-[#6C757D]">{order.paymentMethod}</p>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                {order.status === 'delivered' && (
                                                    <>
                                                        <button
                                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FF6B00] hover:bg-[#FF8C3A] text-white rounded-lg font-medium transition-colors ${settings.focusIndicator ? 'focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2' : ''
                                                                }`}
                                                            aria-label="Reorder items from this order"
                                                        >
                                                            <RotateCcw size={18} aria-hidden="true" />
                                                            Reorder
                                                        </button>
                                                        <button
                                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-[#212529] border border-gray-300 rounded-lg font-medium transition-colors ${settings.focusIndicator ? 'focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2' : ''
                                                                }`}
                                                            aria-label="Rate this order"
                                                        >
                                                            <Star size={18} aria-hidden="true" />
                                                            Rate Order
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'in-progress' && (
                                                    <button
                                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-[#212529] border border-gray-300 rounded-lg font-medium transition-colors ${settings.focusIndicator ? 'focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2' : ''
                                                            }`}
                                                        aria-label="Contact support about this order"
                                                    >
                                                        <MessageCircle size={18} aria-hidden="true" />
                                                        Contact Support
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
