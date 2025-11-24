'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Mic, Home, Briefcase, Plus, Navigation, Search, CheckCircle, X } from 'lucide-react';
import { useLocation } from '@/lib/location-context';
import { useAuth } from '@clerk/nextjs';

export default function LocationPage() {
    const router = useRouter();
    const { userId } = useAuth();
    const { currentAddress, setCurrentAddress, savedPlaces, addSavedPlace, setLocationUpdated } = useLocation();
    const [address, setAddress] = useState(currentAddress);
    const [dbSavedPlaces, setDbSavedPlaces] = useState<any[]>([]);
    
    // Fetch saved addresses from DB if logged in
    useEffect(() => {
        if (userId) {
            fetch('/api/user/addresses')
                .then(res => res.json())
                .then(data => {
                    if (data.addresses) {
                        setDbSavedPlaces(data.addresses);
                        // If there's a default address and we haven't set one yet, use it
                        const defaultAddr = data.addresses.find((a: any) => a.is_default);
                        if (defaultAddr && currentAddress === '123 Main St, Downtown') { // Only override default placeholder
                             setCurrentAddress(defaultAddr.address);
                             setAddress(defaultAddr.address);
                        }
                    }
                })
                .catch(err => console.error(err));
        }
    }, [userId, currentAddress, setCurrentAddress]);

    const displaySavedPlaces = userId ? dbSavedPlaces : savedPlaces;

    const [isListening, setIsListening] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [newAddressType, setNewAddressType] = useState('Home');
    const [newAddressValue, setNewAddressValue] = useState('');

    const mapRef = useRef<HTMLDivElement>(null);

    // Update local state when context changes (initial load)
    useEffect(() => {
        setAddress(currentAddress);
    }, [currentAddress]);

    const handleMicClick = () => {
        if (isListening) return;
        
        setIsListening(true);
        // Simulate speech recognition
        setTimeout(() => {
            setIsListening(false);
            setAddress('789 Park Road, Green Valley');
        }, 2000);
    };

    const handleConfirmLocation = () => {
        if (address !== currentAddress) {
            setCurrentAddress(address);
            setLocationUpdated(true);
        }
        router.back();
    };

    const handleUseCurrentLocation = () => {
        setAddress('Current Location: 123 GPS Coordinate St');
        // Reset map offset to center
        setMapOffset({ x: 0, y: 0 });
    };

    const handleAddAddress = async () => {
        if (newAddressValue) {
            if (userId) {
                try {
                    const res = await fetch('/api/user/addresses', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: newAddressType,
                            address: newAddressValue,
                            isDefault: false
                        })
                    });
                    const data = await res.json();
                    if (data.success) {
                        setDbSavedPlaces(prev => [...prev, {
                            id: data.id,
                            type: newAddressType,
                            address: newAddressValue
                        }]);
                    }
                } catch (error) {
                    console.error('Error saving address:', error);
                }
            } else {
                addSavedPlace({
                    type: newAddressType,
                    address: newAddressValue,
                });
            }
            setShowAddAddressModal(false);
            setNewAddressValue('');
        }
    };

    // Dummy Map Drag Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setMapOffset(prev => ({
                x: prev.x + e.movementX,
                y: prev.y + e.movementY
            }));
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            // Simulate address update on drop
            const randomNum = Math.floor(Math.random() * 100);
            setAddress(`${randomNum} Pinned Location Ave, Map Area`);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 shadow-sm">
                <div className="p-4 flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={24} className="text-[#212529]" />
                    </button>
                    <h1 className="text-xl font-bold text-[#212529]">Select Location</h1>
                </div>
            </div>

            {/* Interactive Dummy Map */}
            <div 
                ref={mapRef}
                className={`relative w-full h-72 bg-gray-100 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Moving Map Layer */}
                <div 
                    className="absolute inset-0 transition-transform duration-75 ease-linear"
                    style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)` }}
                >
                    {/* Abstract Map Pattern */}
                    <div className="absolute -inset-[500px] opacity-10" 
                        style={{
                            backgroundImage: 'radial-gradient(#FF6B00 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}>
                    </div>
                    
                    {/* Roads (Decorative) */}
                    <div className="absolute top-1/2 left-[-500px] right-[-500px] h-4 bg-gray-300 transform -rotate-12"></div>
                    <div className="absolute top-[-500px] bottom-[-500px] left-1/3 w-4 bg-gray-300 transform rotate-12"></div>
                    <div className="absolute top-[-500px] bottom-[-500px] right-1/4 w-6 bg-gray-300/50"></div>
                </div>
                
                {/* Fixed Center Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8 pointer-events-none z-10">
                    <div className="relative">
                        <MapPin size={48} className={`text-[#FF6B00] fill-[#FF6B00] transition-transform ${isDragging ? '-translate-y-4 scale-110' : 'animate-bounce'}`} />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"></div>
                    </div>
                </div>

                {/* Use Current Location Button - Fixed Z-Index */}
                <button 
                    onClick={handleUseCurrentLocation}
                    className="absolute bottom-8 right-4 z-20 bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-[#FF6B00] font-semibold text-sm hover:bg-gray-50 transition-colors border border-gray-100"
                >
                    <Navigation size={16} />
                    Use Current Location
                </button>
                
                {/* Drag Hint */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm pointer-events-none">
                    Drag map to pin location
                </div>
            </div>

            {/* Address Input Section */}
            <div className="p-6 -mt-6 relative z-30 bg-white rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                
                <div className="mb-8">
                    <label className="block text-xs font-bold text-[#6C757D] uppercase tracking-wider mb-2">
                        Delivery Location
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Search size={20} className="text-[#FF6B00]" />
                        </div>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:border-[#FF6B00] focus:bg-white rounded-2xl outline-none transition-all font-medium text-[#212529]"
                            placeholder="Search for area, street name..."
                        />
                        <button 
                            onClick={handleMicClick}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                                isListening 
                                    ? 'bg-red-100 text-red-500 animate-pulse' 
                                    : 'hover:bg-gray-200 text-[#6C757D]'
                            }`}
                            aria-label={isListening ? "Listening..." : "Use voice search"}
                        >
                            <Mic size={20} />
                        </button>
                    </div>
                    {isListening && (
                        <p className="text-center text-sm text-[#FF6B00] mt-2 font-medium animate-pulse">
                            Listening...
                        </p>
                    )}
                </div>

                {/* Saved Places */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-[#212529] mb-4">Saved Places</h2>
                    <div className="space-y-3">
                        {displaySavedPlaces.map((place) => (
                            <button 
                                key={place.id}
                                onClick={() => setAddress(place.address)}
                                className={`w-full flex items-center gap-4 p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all group text-left ${address === place.address ? 'border-[#FF6B00] ring-1 ring-[#FF6B00]' : 'border-gray-100 hover:border-[#FF6B00]/30'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-[#FF6B00] transition-colors">
                                    {place.type === 'Home' ? <Home size={20} className="text-[#FF6B00] group-hover:text-white transition-colors" /> : 
                                     place.type === 'Work' ? <Briefcase size={20} className="text-[#FF6B00] group-hover:text-white transition-colors" /> :
                                     <MapPin size={20} className="text-[#FF6B00] group-hover:text-white transition-colors" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#212529]">{place.type}</h3>
                                    <p className="text-sm text-[#6C757D] truncate">{place.address}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${address === place.address ? 'border-[#FF6B00]' : 'border-gray-200 group-hover:border-[#FF6B00]'}`}>
                                    {address === place.address && <div className="w-3 h-3 rounded-full bg-[#FF6B00]"></div>}
                                </div>
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => setShowAddAddressModal(true)}
                            className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#FF6B00] hover:bg-orange-50/50 transition-all group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                <Plus size={20} className="text-[#6C757D] group-hover:text-[#FF6B00] transition-colors" />
                            </div>
                            <span className="font-bold text-[#6C757D] group-hover:text-[#FF6B00] transition-colors">Add New Address</span>
                        </button>
                    </div>
                </div>

                {/* Confirm Button */}
                <button 
                    onClick={handleConfirmLocation}
                    className="w-auto px-12 py-3 bg-green-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-green-700 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98] mx-auto block"
                >
                    Confirm Location
                </button>
            </div>

            {/* Add Address Modal */}
            {showAddAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#212529]">Add New Address</h2>
                            <button onClick={() => setShowAddAddressModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[#6C757D] mb-2">Label</label>
                                <div className="flex gap-3">
                                    {['Home', 'Work', 'Other'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewAddressType(type)}
                                            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                                                newAddressType === type 
                                                ? 'bg-[#FF6B00] text-white shadow-md' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-[#6C757D] mb-2">Address</label>
                                <input
                                    type="text"
                                    value={newAddressValue}
                                    onChange={(e) => setNewAddressValue(e.target.value)}
                                    placeholder="e.g. 123 Apartment, Street Name"
                                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#FF6B00] focus:bg-white rounded-xl outline-none transition-all"
                                />
                            </div>

                            <button
                                onClick={handleAddAddress}
                                disabled={!newAddressValue}
                                className="w-full py-3 bg-[#FF6B00] text-white rounded-xl font-bold hover:bg-[#FF8C3A] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                            >
                                Save Address
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}