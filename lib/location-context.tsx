'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

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
    const { userId } = useAuth();
    const [currentAddress, setCurrentAddress] = useState('123 Main St, Downtown');
    const [locationUpdated, setLocationUpdated] = useState(false);
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

    // Load from local storage on mount or user change
    useEffect(() => {
        const storageKeyLocation = userId ? `foodhub_location_${userId}` : 'foodhub_location_guest';
        const storageKeyPlaces = userId ? `foodhub_saved_places_${userId}` : 'foodhub_saved_places_guest';

        const savedLocation = localStorage.getItem(storageKeyLocation);
        if (savedLocation) {
            setCurrentAddress(savedLocation);
        } else {
            setCurrentAddress('123 Main St, Downtown');
        }

        const savedPlacesData = localStorage.getItem(storageKeyPlaces);
        if (savedPlacesData) {
            setSavedPlaces(JSON.parse(savedPlacesData));
        } else {
            // Default places for new users/guests
            setSavedPlaces([
                { id: 1, type: 'Home', address: '123 Main St, Downtown' },
                { id: 2, type: 'Work', address: '456 Business Ave, Tech Park' },
            ]);
        }
    }, [userId]);

    // Save current address to local storage when changed
    useEffect(() => {
        const storageKeyLocation = userId ? `foodhub_location_${userId}` : 'foodhub_location_guest';
        localStorage.setItem(storageKeyLocation, currentAddress);
    }, [currentAddress, userId]);

    // Save places to local storage when changed
    useEffect(() => {
        const storageKeyPlaces = userId ? `foodhub_saved_places_${userId}` : 'foodhub_saved_places_guest';
        if (savedPlaces.length > 0) {
            localStorage.setItem(storageKeyPlaces, JSON.stringify(savedPlaces));
        }
    }, [savedPlaces, userId]);

    const addSavedPlace = (place: Omit<SavedPlace, 'id'>) => {
        const newPlace = {
            ...place,
            id: Date.now(),
        };
        setSavedPlaces(prev => [...prev, newPlace]);
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
