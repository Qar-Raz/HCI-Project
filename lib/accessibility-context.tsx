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
    focusIndicator: boolean;
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    // Seniors settings
    largeTextMode: boolean;
    simplifiedNavigation: boolean;
    voiceControl: boolean;
    // Disability settings
    screenReaderOptimization: boolean;
    assistiveTouch: boolean;
    // Illiterate settings
    iconOnlyMode: boolean;
    audioAssistance: boolean;
    pictorialMenu: boolean;
    voiceInput: boolean;
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
    focusIndicator: true,
    colorBlindMode: 'none',
    // Seniors settings
    largeTextMode: false,
    simplifiedNavigation: false,
    voiceControl: false,
    // Disability settings
    screenReaderOptimization: false,
    assistiveTouch: false,
    // Illiterate settings
    iconOnlyMode: false,
    audioAssistance: false,
    pictorialMenu: false,
    voiceInput: false,
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

    // Focus indicator
    if (settings.focusIndicator) {
        root.classList.add('focus-indicator');
    } else {
        root.classList.remove('focus-indicator');
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

    if (settings.simplifiedNavigation) {
        root.classList.add('simplified-navigation');
    } else {
        root.classList.remove('simplified-navigation');
    }

    if (settings.voiceControl) {
        root.classList.add('voice-control');
    } else {
        root.classList.remove('voice-control');
    }

    // Disability settings
    if (settings.screenReaderOptimization) {
        root.classList.add('screen-reader-optimized');
    } else {
        root.classList.remove('screen-reader-optimized');
    }

    if (settings.assistiveTouch) {
        root.classList.add('assistive-touch');
    } else {
        root.classList.remove('assistive-touch');
    }

    // Illiterate settings
    if (settings.iconOnlyMode) {
        root.classList.add('icon-only-mode');
    } else {
        root.classList.remove('icon-only-mode');
    }

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

    if (settings.voiceInput) {
        root.classList.add('voice-input');
    } else {
        root.classList.remove('voice-input');
    }
}
