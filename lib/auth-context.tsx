'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();
    const { signOut, openSignIn, openSignUp } = useClerk();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && clerkUser) {
            setUser({
                id: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                name: clerkUser.fullName || clerkUser.firstName || 'User',
                avatar: clerkUser.imageUrl,
                phone: clerkUser.primaryPhoneNumber?.phoneNumber
            });
        } else if (isLoaded && !isSignedIn) {
            setUser(null);
        }
    }, [isLoaded, isSignedIn, clerkUser]);

    const login = async (email: string, password: string) => {
        openSignIn();
        return { success: true };
    };

    const signup = async (name: string, email: string, password: string) => {
        openSignUp();
        return { success: true };
    };

    const logout = async () => {
        await signOut();
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                isLoading: !isLoaded,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
