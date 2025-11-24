'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SavedPlace = {
    id: number;
    type: string;
    address: string;
    icon?: any;
};

type LocationContextType = {
    currentAddress: string;
    setCurrentAddress: (address: string) => void;
    savedPlaces: SavedPlace[];
    addSavedPlace: (place: Omit<SavedPlace, 'id'>) => void;
    locationUpdated: boolean;
    setLocationUpdated: (updated: boolean) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [currentAddress, setCurrentAddress] = useState('123 Main St, Downtown');
    const [locationUpdated, setLocationUpdated] = useState(false);
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([
        { id: 1, type: 'Home', address: '123 Main St, Downtown' },
        { id: 2, type: 'Work', address: '456 Business Ave, Tech Park' },
    ]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('foodpapa-location');
        if (saved) {
            setCurrentAddress(saved);
        }
    }, []);

    // Save to local storage when changed
    useEffect(() => {
        localStorage.setItem('foodpapa-location', currentAddress);
    }, [currentAddress]);

    const addSavedPlace = (place: Omit<SavedPlace, 'id'>) => {
        const newPlace = {
            ...place,
            id: Date.now(),
        };
        setSavedPlaces([...savedPlaces, newPlace]);
    };

    return (
        <LocationContext.Provider value={{ 
            currentAddress, 
            setCurrentAddress, 
            savedPlaces, 
            addSavedPlace,
            locationUpdated,
            setLocationUpdated
        }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
