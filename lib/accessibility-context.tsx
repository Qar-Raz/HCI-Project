'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
    language: 'en' | 'ur';
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    reducedMotion: boolean;
    textSpacing: boolean;
    readableFont: boolean;
    linkHighlight: boolean;
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    // Seniors settings
    largeTextMode: boolean;
    largeButtonMode: boolean;
    // Disability settings
    readingMode: boolean;
    // Illiterate settings
    audioAssistance: boolean;
    pictorialMenu: boolean;
    // Focus indicator (shows visible focus ring on buttons)
    focusIndicator: boolean;
}

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSetting: <K extends keyof AccessibilitySettings>(
        key: K,
        value: AccessibilitySettings[K]
    ) => void;
    resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
    language: 'en',
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    textSpacing: false,
    readableFont: false,
    linkHighlight: false,
    colorBlindMode: 'none',
    // Seniors settings
    largeTextMode: false,
    largeButtonMode: false,
    // Disability settings
    readingMode: false,
    // Illiterate settings
    audioAssistance: false,
    pictorialMenu: false,
    // Focus indicator - off by default
    focusIndicator: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
    const [isMounted, setIsMounted] = useState(false);

    // Initialize from localStorage after mount to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('accessibility-settings');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setSettings(parsed);
                    applyAccessibilitySettings(parsed);
                } catch (e) {
                    console.error('Failed to parse accessibility settings:', e);
                }
            }
        }
    }, []);

    // Save settings to localStorage and apply them when changed
    useEffect(() => {
        if (isMounted && typeof window !== 'undefined') {
            localStorage.setItem('accessibility-settings', JSON.stringify(settings));
            applyAccessibilitySettings(settings);
        }
    }, [settings, isMounted]);

    const updateSetting = <K extends keyof AccessibilitySettings>(
        key: K,
        value: AccessibilitySettings[K]
    ) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    return (
        <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
}

function applyAccessibilitySettings(settings: AccessibilitySettings) {
    const root = document.documentElement;

    // Font size
    const fontSizeMap = {
        small: '14px',
        medium: '16px',
        large: '18px',
        'extra-large': '20px',
    };
    root.style.fontSize = fontSizeMap[settings.fontSize];

    // High contrast
    if (settings.highContrast) {
        root.classList.add('high-contrast');
    } else {
        root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
        root.classList.add('reduced-motion');
    } else {
        root.classList.remove('reduced-motion');
    }

    // Text spacing
    if (settings.textSpacing) {
        root.classList.add('text-spacing');
    } else {
        root.classList.remove('text-spacing');
    }

    // Readable font
    if (settings.readableFont) {
        root.classList.add('readable-font');
    } else {
        root.classList.remove('readable-font');
    }

    // Link highlight
    if (settings.linkHighlight) {
        root.classList.add('link-highlight');
    } else {
        root.classList.remove('link-highlight');
    }

    // Color blind mode
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (settings.colorBlindMode !== 'none') {
        root.classList.add(settings.colorBlindMode);
    }

    // Seniors settings
    if (settings.largeTextMode) {
        root.classList.add('large-text-mode');
    } else {
        root.classList.remove('large-text-mode');
    }

    if (settings.largeButtonMode) {
        root.classList.add('large-button-mode');
    } else {
        root.classList.remove('large-button-mode');
    }

    // Disability settings
    if (settings.readingMode) {
        root.classList.add('reading-mode');
    } else {
        root.classList.remove('reading-mode');
    }

    // Illiterate settings
    if (settings.audioAssistance) {
        root.classList.add('audio-assistance');
    } else {
        root.classList.remove('audio-assistance');
    }

    if (settings.pictorialMenu) {
        root.classList.add('pictorial-menu');
    } else {
        root.classList.remove('pictorial-menu');
    }

    // Focus indicator - shows visible focus ring on interactive elements
    if (settings.focusIndicator) {
        root.classList.add('focus-indicator');
    } else {
        root.classList.remove('focus-indicator');
    }

}
