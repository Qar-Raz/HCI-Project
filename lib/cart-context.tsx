'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, CartState } from './types';

type CartContextType = {
    cart: CartState;
    addToCart: (item: CartItem) => boolean;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartState>({
        items: [],
        restaurantId: null
    });

    const addToCart = (item: CartItem): boolean => {
        // Check if cart has items from a different restaurant
        if (cart.restaurantId && cart.restaurantId !== item.restaurantId) {
            return false; // Signal to show modal
        }

        setCart((prevCart) => {
            const existingItemIndex = prevCart.items.findIndex(
                (cartItem) => cartItem.foodItem.id === item.foodItem.id
            );

            if (existingItemIndex > -1) {
                // Item already exists, update quantity
                const updatedItems = [...prevCart.items];
                updatedItems[existingItemIndex].quantity += item.quantity;
                return {
                    ...prevCart,
                    items: updatedItems
                };
            } else {
                // New item, add to cart
                return {
                    items: [...prevCart.items, item],
                    restaurantId: item.restaurantId
                };
            }
        });

        return true; // Successfully added
    };

    const removeFromCart = (itemId: string) => {
        setCart((prevCart) => {
            const updatedItems = prevCart.items.filter(
                (item) => item.foodItem.id !== itemId
            );
            return {
                items: updatedItems,
                restaurantId: updatedItems.length > 0 ? prevCart.restaurantId : null
            };
        });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart((prevCart) => {
            const updatedItems = prevCart.items.map((item) =>
                item.foodItem.id === itemId ? { ...item, quantity } : item
            );
            return {
                ...prevCart,
                items: updatedItems
            };
        });
    };

    const clearCart = () => {
        setCart({
            items: [],
            restaurantId: null
        });
    };

    const getCartTotal = () => {
        return cart.items.reduce(
            (total, item) => total + item.foodItem.price * item.quantity,
            0
        );
    };

    const getCartCount = () => {
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
