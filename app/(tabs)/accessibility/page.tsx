'use client';

import { useAccessibility } from '@/lib/accessibility-context';
import { useTranslation } from '@/lib/use-translation';
import {
    Type, Contrast, Zap, AlignLeft, Baseline, Link, Focus, Eye,
    RotateCcw, Check, ArrowLeft, Smartphone, Globe, Keyboard,
    Users, Heart, Volume2, Image, Mic, BookOpen, X
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import SpeakButton from '@/components/ui/SpeakButton';

// Comprehensive keyword map for all accessibility settings
const keywordMap: Record<string, string> = {
    // High Contrast
    'high contrast': 'highContrast',
    'contrast': 'highContrast',
    'high-contrast': 'highContrast',

    // Reduced Motion
    'reduced motion': 'reducedMotion',
    'reduce motion': 'reducedMotion',
    'motion': 'reducedMotion',
    'animations': 'reducedMotion',
    'stop animations': 'reducedMotion',

    // Text Spacing
    'text spacing': 'textSpacing',
    'spacing': 'textSpacing',
    'text space': 'textSpacing',

    // Readable Font
    'readable font': 'readableFont',
    'readable': 'readableFont',
    'easy font': 'readableFont',
    'dyslexia font': 'readableFont',

    // Link Highlight
    'link highlight': 'linkHighlight',
    'highlight links': 'linkHighlight',
    'links': 'linkHighlight',

    // Large Text Mode
    'large text': 'largeTextMode',
    'large text mode': 'largeTextMode',
    'big text': 'largeTextMode',
    'bigger text': 'largeTextMode',
    'enlarge text': 'largeTextMode',

    // Large Button Mode
    'large button': 'largeButtonMode',
    'large button mode': 'largeButtonMode',
    'big buttons': 'largeButtonMode',
    'bigger buttons': 'largeButtonMode',
    'large buttons': 'largeButtonMode',

    // Reading Mode
    'reading mode': 'readingMode',
    'reader mode': 'readingMode',
    'reading': 'readingMode',

    // Audio Assistance
    'audio assistance': 'audioAssistance',
    'audio': 'audioAssistance',
    'speak': 'audioAssistance',
    'speaker': 'audioAssistance',
    'voice': 'audioAssistance',
    'text to speech': 'audioAssistance',
    'read aloud': 'audioAssistance',

    // Pictorial Menu
    'pictorial menu': 'pictorialMenu',
    'pictorial': 'pictorialMenu',
    'picture menu': 'pictorialMenu',
    'pictures': 'pictorialMenu',
    'visual menu': 'pictorialMenu',
    'image menu': 'pictorialMenu',
    'icons': 'pictorialMenu',

    // Color Blind Mode
    'color blind': 'colorBlindMode',
    'colorblind': 'colorBlindMode',
    'color blind mode': 'colorBlindMode',
    'color vision': 'colorBlindMode',

    // Focus Indicator
    'focus indicator': 'focusIndicator',
    'focus': 'focusIndicator',
    'focus ring': 'focusIndicator',
    'focus border': 'focusIndicator',
    'button border': 'focusIndicator',
    'click indicator': 'focusIndicator',
    'visible focus': 'focusIndicator',
};

// Section keyword map for navigation
const sectionKeywordMap: Record<string, string> = {
    'language': 'language-section',
    'language section': 'language-section',
    'change language': 'language-section',

    'illiterate': 'illiterate-section',
    'illiterate section': 'illiterate-section',
    'cannot read': 'illiterate-section',

    'seniors': 'seniors-section',
    'senior': 'seniors-section',
    'elderly': 'seniors-section',
    'old age': 'seniors-section',

    'disability': 'disability-section',
    'disabilities': 'disability-section',
    'disabled': 'disability-section',

    'font size': 'font-section',
    'text size': 'font-section',
    'font': 'font-section',

    'visual': 'visual-section',
    'visual adjustments': 'visual-section',

    'color vision': 'color-section',
    'color blind': 'color-section',

    'reset': 'reset-section',
    'reset settings': 'reset-section',
};

// Font size keyword map
const fontSizeKeywordMap: Record<string, 'small' | 'medium' | 'large' | 'extra-large'> = {
    'small': 'small',
    'small font': 'small',
    'small text': 'small',

    'medium': 'medium',
    'medium font': 'medium',
    'medium text': 'medium',
    'normal': 'medium',
    'default': 'medium',

    'large': 'large',
    'large font': 'large',
    'big': 'large',

    'extra large': 'extra-large',
    'extra-large': 'extra-large',
    'very large': 'extra-large',
    'biggest': 'extra-large',
    'huge': 'extra-large',
};

export default function AccessibilityPage() {
    const router = useRouter();
    const { settings, updateSetting, resetSettings } = useAccessibility();
    const { t, language } = useTranslation();
    const { toasts, addToast, removeToast } = useToast();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Section refs for voice navigation
    const sectionRefs = {
        'language-section': useRef<HTMLElement>(null),
        'illiterate-section': useRef<HTMLElement>(null),
        'seniors-section': useRef<HTMLElement>(null),
        'disability-section': useRef<HTMLElement>(null),
        'font-section': useRef<HTMLElement>(null),
        'visual-section': useRef<HTMLElement>(null),
        'color-section': useRef<HTMLElement>(null),
        'reset-section': useRef<HTMLElement>(null),
    };

    // Voice Assistant State
    const [isListening, setIsListening] = useState(false);
    const [sessionActive, setSessionActive] = useState(false);
    const [voiceFeedback, setVoiceFeedback] = useState('');
    const [suggestedSetting, setSuggestedSetting] = useState<string | null>(null);
    // Voice states: idle, listening (blue), processing (amber), waiting (green - found setting), success (black), error (red)
    const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'waiting' | 'success' | 'error'>('idle');
    // Store the pending action when in 'waiting' state
    const [pendingAction, setPendingAction] = useState<{
        type: 'toggle' | 'select';
        settingKey: string;
        currentValue?: any;
    } | null>(null);
    const recognitionRef = useRef<any>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const stateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Use refs to avoid stale closures in speech recognition callbacks
    const pendingActionRef = useRef(pendingAction);
    const voiceStateRef = useRef(voiceState);
    const sessionActiveRef = useRef(sessionActive);

    // Keep refs in sync with state
    useEffect(() => {
        pendingActionRef.current = pendingAction;
    }, [pendingAction]);

    useEffect(() => {
        voiceStateRef.current = voiceState;
    }, [voiceState]);

    useEffect(() => {
        sessionActiveRef.current = sessionActive;
    }, [sessionActive]);

    // Helper to set voice state with auto-return to listening
    const setVoiceStateWithTimeout = (state: 'success' | 'error', duration: number = 3000) => {
        if (stateTimeoutRef.current) {
            clearTimeout(stateTimeoutRef.current);
        }
        setVoiceState(state);
        stateTimeoutRef.current = setTimeout(() => {
            if (sessionActiveRef.current) {
                setVoiceState('listening');
                setVoiceFeedback('🎤 Listening... Say a command');
                setPendingAction(null);
            }
        }, duration);
    };

    // Helper to set waiting state (green) - stays for 15 seconds max then resets
    const setWaitingState = (feedback: string, action: { type: 'toggle' | 'select'; settingKey: string; currentValue?: any }) => {
        if (stateTimeoutRef.current) {
            clearTimeout(stateTimeoutRef.current);
        }
        setVoiceState('waiting');
        setVoiceFeedback(feedback);
        setPendingAction(action);

        // Auto-reset after 15 seconds if no response
        stateTimeoutRef.current = setTimeout(() => {
            if (sessionActiveRef.current && pendingActionRef.current) {
                setPendingAction(null);
                setSuggestedSetting(null);
                setVoiceState('listening');
                setVoiceFeedback('🎤 Timed out. Say another command...');
            }
        }, 15000);
    };

    // Scroll to section helper
    const scrollToSection = (sectionId: string) => {
        const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Add highlight effect
            ref.current.classList.add('ring-4', 'ring-[#FF6B00]', 'ring-opacity-50');
            setTimeout(() => {
                ref.current?.classList.remove('ring-4', 'ring-[#FF6B00]', 'ring-opacity-50');
            }, 2000);
        }
    };

    const speak = (text: string, onEnd?: () => void) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utteranceRef.current = utterance; // Prevent garbage collection

            utterance.onend = () => {
                if (onEnd) onEnd();
                utteranceRef.current = null;
            };

            utterance.onerror = (e) => {
                // Ignore errors caused by cancellation
                if (e.error !== 'canceled' && e.error !== 'interrupted') {
                    console.error("Speech synthesis error", e);
                }
                if (onEnd) onEnd();
                utteranceRef.current = null;
            };

            window.speechSynthesis.speak(utterance);
        } else {
            onEnd?.();
        }
    };

    const toggleVoiceAssistant = () => {
        if (sessionActive) {
            endSession();
        } else {
            setSessionActive(true);
            setVoiceState('listening');
            setVoiceFeedback('🎤 Voice Assistant activated! Say a setting name...');
            startListening();
        }
    };

    const endSession = () => {
        if (stateTimeoutRef.current) {
            clearTimeout(stateTimeoutRef.current);
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        setSessionActive(false);
        setSuggestedSetting(null);
        setPendingAction(null);
        setVoiceFeedback('');
        setVoiceState('idle');
        window.speechSynthesis.cancel();
    };

    const startListening = () => {
        if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        // Stop any existing recognition
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore
            }
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            // Don't change state if we're in waiting state (green) - keep waiting for confirmation
            // Use ref to get current value and avoid stale closure
            if (voiceStateRef.current !== 'waiting' && !pendingActionRef.current) {
                setVoiceState('listening');
                setVoiceFeedback('🎤 Listening... Say a setting name (e.g., "Audio Assistance")');
            } else if (pendingActionRef.current) {
                // We have a pending action, remind user
                setVoiceFeedback('🟢 Say "Yes" to confirm or "No" to cancel');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            // Auto-restart if session is active and we are not speaking
            // Use ref to avoid stale closure
            // Don't restart immediately if we're in error state - let the timeout handle it
            if (sessionActiveRef.current && !window.speechSynthesis.speaking && voiceStateRef.current !== 'error') {
                // Small delay to prevent rapid loops
                setTimeout(() => {
                    if (sessionActiveRef.current && voiceStateRef.current !== 'error') {
                        startListening();
                    }
                }, 300);
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech') {
                // Don't overwrite waiting state - keep it green if we have pending action
                if (!pendingActionRef.current) {
                    setVoiceState('listening');
                    setVoiceFeedback('🎤 No speech detected. Try again...');
                } else {
                    setVoiceFeedback('🟢 No speech detected. Say "Yes" to confirm or "No" to cancel');
                }
            } else if (event.error !== 'aborted') {
                setVoiceStateWithTimeout('error', 3000);
                setVoiceFeedback('❌ Error occurred. Retrying...');
            }
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (interimTranscript) {
                // Don't change to processing if we're in waiting state with pending action
                if (pendingActionRef.current) {
                    setVoiceFeedback(`🟢 Hearing: "${interimTranscript}" - Say "Yes" to confirm`);
                } else {
                    setVoiceState('processing');
                    setVoiceFeedback(`👂 Hearing: "${interimTranscript}"`);
                }
            }

            if (finalTranscript) {
                const command = finalTranscript.toLowerCase().trim();
                // Show what we're processing
                if (pendingActionRef.current) {
                    setVoiceFeedback(`🟢 Processing: "${command}"`);
                } else {
                    setVoiceState('processing');
                    setVoiceFeedback(`🔄 Processing: "${command}"`);
                }
                processVoiceCommand(command);
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Speech recognition failed to start", e);
            setIsListening(false);
        }
    };

    // Helper for successful command execution (black color)
    const commandSuccess = (msg: string, sectionId?: string) => {
        // Stop current recognition while we speak
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore
            }
        }

        setPendingAction(null);
        setSuggestedSetting(null);
        setVoiceStateWithTimeout('success', 3000);
        setVoiceFeedback(`✅ ${msg}`);

        // Speak and restart listening after - use ref for sessionActive
        speak(msg, () => {
            setTimeout(() => {
                if (sessionActiveRef.current) {
                    startListening();
                }
            }, 500);
        });

        addToast(msg, 'success');
        if (sectionId) scrollToSection(sectionId);
    };

    // Helper for command errors
    const commandError = (msg: string) => {
        setPendingAction(null);
        setVoiceStateWithTimeout('error', 4000);
        setVoiceFeedback(`❌ ${msg}`);
        speak(msg);
        addToast(msg, 'error');
    };

    // Helper for info/prompts (when waiting for more input - uses waiting/green state)
    const commandPrompt = (msg: string, sectionId?: string, action?: { type: 'toggle' | 'select'; settingKey: string; currentValue?: any }) => {
        // Stop current recognition while we speak
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore
            }
        }

        if (action) {
            setWaitingState(`🟢 ${msg}`, action);
        } else {
            setVoiceState('processing');
            setVoiceFeedback(`💡 ${msg}`);
        }

        // Speak and restart listening after speech ends
        speak(msg, () => {
            // Restart listening after speech with a delay - use ref for sessionActive
            setTimeout(() => {
                if (sessionActiveRef.current) {
                    startListening();
                }
            }, 500);
        });

        addToast(msg, 'info');
        if (sectionId) scrollToSection(sectionId);
    };

    const processVoiceCommand = (command: string) => {
        // Use ref to get current pending action (avoids stale closure)
        const currentPendingAction = pendingActionRef.current;

        // Check for simple confirmation commands when we have a pending action
        const confirmWords = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'correct', 'confirm', 'do it', 'toggle', 'turn it on', 'turn it off', 'enable', 'disable'];
        const cancelWords = ['no', 'nope', 'cancel', 'nevermind', 'never mind', 'stop', 'forget it'];

        // More flexible matching - check if command contains any confirm/cancel word
        const isConfirm = confirmWords.some(word => command === word || command.includes(word));
        const isCancel = cancelWords.some(word => command === word || command.includes(word));

        console.log('Voice command:', command, 'Pending action:', currentPendingAction, 'isConfirm:', isConfirm);

        // If user says "yes" or "toggle" and we have a pending action, execute it
        if (currentPendingAction && isConfirm) {
            console.log('Executing pending action:', currentPendingAction);
            if (currentPendingAction.type === 'toggle') {
                const currentVal = settings[currentPendingAction.settingKey as keyof typeof settings];
                if (typeof currentVal === 'boolean') {
                    updateSetting(currentPendingAction.settingKey as any, !currentVal);
                    const status = !currentVal ? 'enabled' : 'disabled';
                    const settingName = currentPendingAction.settingKey.replace(/([A-Z])/g, ' $1').trim();
                    commandSuccess(`${settingName} ${status}`);
                    return;
                }
            } else if (currentPendingAction.type === 'select') {
                // For select type, prompt for value
                if (currentPendingAction.settingKey === 'colorBlindMode') {
                    const msg = "Please say which mode: Protanopia, Deuteranopia, Tritanopia, or None.";
                    speak(msg);
                    setVoiceFeedback("🟢 Say: Protanopia, Deuteranopia, Tritanopia, or None");
                    return;
                }
                if (currentPendingAction.settingKey === 'fontSize') {
                    commandPrompt('Say: Small, Medium, Large, or Extra Large', 'font-section', currentPendingAction);
                    return;
                }
            }
        }

        // If user cancels, clear pending action
        if (currentPendingAction && isCancel) {
            setPendingAction(null);
            setSuggestedSetting(null);
            setVoiceState('listening');
            setVoiceFeedback('🎤 Cancelled. Say another command...');
            speak('Cancelled');
            return;
        }

        // Handle Color Blind Mode Selection
        if (suggestedSetting === 'colorBlindMode' || (currentPendingAction?.settingKey === 'colorBlindMode')) {
            const modes = ['protanopia', 'deuteranopia', 'tritanopia', 'none', 'standard', 'normal'];
            const selectedMode = modes.find(m => command.includes(m));

            if (selectedMode) {
                const actualMode = (selectedMode === 'standard' || selectedMode === 'normal') ? 'none' : selectedMode;
                updateSetting('colorBlindMode', actualMode as any);
                commandSuccess(`Color Blind Mode set to ${actualMode}`, 'color-section');
                setSuggestedSetting(null);
                return;
            }
        }

        // Handle font size waiting state
        if (suggestedSetting === 'fontSize' || (currentPendingAction?.settingKey === 'fontSize')) {
            for (const [keyword, size] of Object.entries(fontSizeKeywordMap)) {
                if (command.includes(keyword)) {
                    updateSetting('fontSize', size);
                    commandSuccess(`Font size set to ${size}`, 'font-section');
                    setSuggestedSetting(null);
                    return;
                }
            }
        }

        // Check for language change commands
        if (command.includes('urdu') || command.includes('اردو')) {
            updateSetting('language', 'ur');
            commandSuccess('Language changed to Urdu', 'language-section');
            return;
        }
        if (command.includes('english')) {
            updateSetting('language', 'en');
            commandSuccess('Language changed to English', 'language-section');
            return;
        }

        // Check for "go to" or navigation commands
        const navigationPhrases = ['go to', 'show me', 'open', 'navigate to', 'take me to', 'scroll to'];
        const isNavigation = navigationPhrases.some(phrase => command.includes(phrase));

        if (isNavigation) {
            for (const [keyword, sectionId] of Object.entries(sectionKeywordMap)) {
                if (command.includes(keyword)) {
                    const sectionName = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                    commandSuccess(`Navigating to ${sectionName} section`, sectionId);
                    return;
                }
            }
        }

        // Check for direct font size commands (without "go to")
        for (const [keyword, size] of Object.entries(fontSizeKeywordMap)) {
            if (command.includes(keyword) && (command.includes('set') || command.includes('change') || command.includes('make it') || command.includes('use'))) {
                updateSetting('fontSize', size);
                commandSuccess(`Font size changed to ${size}`, 'font-section');
                return;
            }
        }

        // Check for reset command
        if (command.includes('reset') && (command.includes('all') || command.includes('settings') || command.includes('everything'))) {
            resetSettings();
            commandSuccess('All accessibility settings reset to default', 'reset-section');
            return;
        }

        // Check for help command
        if (command.includes('help') || command.includes('what can you do') || command.includes('commands')) {
            setVoiceState('processing');
            const helpMsg = `You can say: Toggle audio assistance, Enable high contrast, Go to seniors section, Set font size to large, Change language to Urdu, or Reset all settings.`;
            setVoiceFeedback('💡 Say a setting name, "Go to [section]", or "Help"');
            speak(helpMsg);
            return;
        }

        // Check for direct "toggle/enable/disable [setting]" commands (with setting name included)
        const toggleWords = ['toggle', 'switch', 'turn on', 'turn off', 'enable', 'disable', 'activate', 'deactivate'];
        const hasToggleWord = toggleWords.some(word => command.includes(word));

        if (hasToggleWord) {
            // Check if they're trying to directly toggle something with the setting name
            for (const [keyword, key] of Object.entries(keywordMap)) {
                if (command.includes(keyword)) {
                    const currentVal = settings[key as keyof typeof settings];
                    if (typeof currentVal === 'boolean') {
                        updateSetting(key as any, !currentVal);
                        const status = !currentVal ? 'enabled' : 'disabled';
                        const settingName = key.replace(/([A-Z])/g, ' $1').trim();
                        commandSuccess(`${settingName} ${status}`);
                        return;
                    }
                }
            }
        }

        // Find setting by keyword
        let foundKey: string | null = null;
        let foundKeyword: string | null = null;
        for (const [keyword, key] of Object.entries(keywordMap)) {
            if (command.includes(keyword)) {
                foundKey = key;
                foundKeyword = keyword;
                break;
            }
        }

        if (foundKey) {
            setSuggestedSetting(foundKey);
            const settingName = foundKey.replace(/([A-Z])/g, ' $1').trim();
            const currentVal = settings[foundKey as keyof typeof settings];

            // Special handling for Color Blind Mode
            if (foundKey === 'colorBlindMode') {
                commandPrompt(
                    `Color Blind Mode is ${currentVal}. Say: Protanopia, Deuteranopia, Tritanopia, or None`,
                    'color-section',
                    { type: 'select', settingKey: foundKey, currentValue: currentVal }
                );
                return;
            }

            // Scroll to relevant section
            let sectionId = '';
            if (foundKey === 'audioAssistance' || foundKey === 'pictorialMenu') {
                sectionId = 'illiterate-section';
            } else if (foundKey === 'largeTextMode' || foundKey === 'largeButtonMode' || foundKey === 'highContrast') {
                sectionId = 'seniors-section';
            } else if (foundKey === 'readingMode' || foundKey === 'reducedMotion') {
                sectionId = 'disability-section';
            } else if (foundKey === 'textSpacing' || foundKey === 'readableFont' || foundKey === 'linkHighlight' || foundKey === 'focusIndicator') {
                sectionId = 'visual-section';
            }

            let status = '';
            if (typeof currentVal === 'boolean') {
                status = currentVal ? 'ON' : 'OFF';
            } else {
                status = `${currentVal}`;
            }

            // Use green/waiting state with pending action
            commandPrompt(
                `Found ${settingName} (${status}). Say "Yes" to toggle`,
                sectionId,
                { type: 'toggle', settingKey: foundKey, currentValue: currentVal }
            );
        } else {
            // Check if user is asking for font size
            if (command.includes('font') || command.includes('text size')) {
                setSuggestedSetting('fontSize');
                commandPrompt(
                    `Font size is ${settings.fontSize}. Say: Small, Medium, Large, or Extra Large`,
                    'font-section',
                    { type: 'select', settingKey: 'fontSize', currentValue: settings.fontSize }
                );
                return;
            }

            // Check for section navigation without explicit "go to"
            for (const [keyword, sectionId] of Object.entries(sectionKeywordMap)) {
                if (command.includes(keyword)) {
                    const sectionName = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                    commandSuccess(`Showing ${sectionName} section`, sectionId);
                    return;
                }
            }

            // Only show error if command was substantial and we're not waiting for input
            if (!suggestedSetting && command.length > 3) {
                setVoiceStateWithTimeout('error', 4000);
                setVoiceFeedback("❌ Couldn't understand. Try: 'Audio Assistance', 'High Contrast', or 'Help'");
            }
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (stateTimeoutRef.current) {
                clearTimeout(stateTimeoutRef.current);
            }
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLanguageDropdownOpen(false);
            }
        };

        if (isLanguageDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLanguageDropdownOpen]);

    const languageOptions = [
        { value: 'en', label: 'English', flag: '🇬🇧' },
        { value: 'ur', label: 'اردو (Urdu)', flag: '🇵🇰' },
    ];

    const fontSizeOptions = [
        { value: 'small' as const, label: t('accessibility.small'), size: 'text-xs', description: '14px' },
        { value: 'medium' as const, label: t('accessibility.medium'), size: 'text-sm', description: '16px' },
        { value: 'large' as const, label: t('accessibility.large'), size: 'text-base', description: '18px' },
        { value: 'extra-large' as const, label: t('accessibility.extraLarge'), size: 'text-lg', description: '20px' },
    ];

    const colorBlindOptions = [
        {
            value: 'none' as const,
            label: t('accessibility.standard'),
            description: t('accessibility.standardDesc'),
            icon: Eye
        },
        {
            value: 'protanopia' as const,
            label: t('accessibility.protanopia'),
            description: t('accessibility.protanopiaDesc'),
            icon: Eye
        },
        {
            value: 'deuteranopia' as const,
            label: t('accessibility.deuteranopia'),
            description: t('accessibility.deuteranopiaDesc'),
            icon: Eye
        },
        {
            value: 'tritanopia' as const,
            label: t('accessibility.tritanopia'),
            description: t('accessibility.tritanopiaDesc'),
            icon: Eye
        },
    ];

    // Seniors Section Settings
    const seniorsSettings = [
        {
            key: 'largeTextMode' as const,
            icon: Type,
            label: t('accessibility.largeTextMode'),
            description: t('accessibility.largeTextModeDesc'),
            color: 'bg-blue-100 text-blue-600',
        },
        {
            key: 'largeButtonMode' as const,
            icon: Zap,
            label: t('accessibility.largeButtonMode'),
            description: t('accessibility.largeButtonModeDesc'),
            color: 'bg-green-100 text-green-600',
        },
        {
            key: 'highContrast' as const,
            icon: Contrast,
            label: t('accessibility.highContrast'),
            description: t('accessibility.highContrastDesc'),
            color: 'bg-amber-100 text-amber-600',
        },
    ];

    // Disability Section Settings
    const disabilitySettings = [
        {
            key: 'readingMode' as const,
            icon: BookOpen,
            label: t('accessibility.readingMode'),
            description: t('accessibility.readingModeDesc'),
            color: 'bg-rose-100 text-rose-600',
        },

        {
            key: 'colorBlindMode' as const,
            icon: Eye,
            label: t('accessibility.colorBlindMode'),
            description: t('accessibility.colorBlindModeDesc'),
            color: 'bg-teal-100 text-teal-600',
        },
        {
            key: 'reducedMotion' as const,
            icon: Zap,
            label: t('accessibility.reducedMotion'),
            description: t('accessibility.reducedMotionDesc'),
            color: 'bg-cyan-100 text-cyan-600',
        },
    ];

    // Illiterate Section Settings
    const illiterateSettings = [
        {
            key: 'audioAssistance' as const,
            icon: Volume2,
            label: t('accessibility.audioAssistance'),
            description: t('accessibility.audioAssistanceDesc'),
            color: 'bg-pink-100 text-pink-600',
        },
        {
            key: 'pictorialMenu' as const,
            icon: BookOpen,
            label: t('accessibility.pictorialMenu'),
            description: t('accessibility.pictorialMenuDesc'),
            color: 'bg-orange-100 text-orange-600',
        },
    ];

    const toggleSettings = [
        {
            key: 'focusIndicator' as const,
            icon: Focus,
            label: t('accessibility.focusIndicator'),
            description: t('accessibility.focusIndicatorDesc'),
            category: t('accessibility.categoryNavigation'),
        },
        {
            key: 'textSpacing' as const,
            icon: AlignLeft,
            label: t('accessibility.textSpacing'),
            description: t('accessibility.textSpacingDesc'),
            category: t('accessibility.categoryReading'),
        },
        {
            key: 'readableFont' as const,
            icon: Baseline,
            label: t('accessibility.readableFont'),
            description: t('accessibility.readableFontDesc'),
            category: t('accessibility.categoryReading'),
        },
        {
            key: 'linkHighlight' as const,
            icon: Link,
            label: t('accessibility.linkHighlight'),
            description: t('accessibility.linkHighlightDesc'),
            category: t('accessibility.categoryNavigation'),
        },
    ];

    const accessibilityTips = [
        {
            icon: Keyboard,
            title: t('accessibility.keyboardNav'),
            description: t('accessibility.keyboardNavDesc'),
        },
        {
            icon: Smartphone,
            title: t('accessibility.screenReaderSupport'),
            description: t('accessibility.screenReaderSupportDesc'),
        },
        {
            icon: Globe,
            title: t('accessibility.wcag'),
            description: t('accessibility.wcagDesc'),
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-linear-to-br from-[#FF6B00] to-[#FF8534] rounded-2xl flex items-center justify-center shadow-lg">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{t('accessibility.title')}</h1>
                                <p className="text-sm text-gray-500">Customize your experience</p>
                            </div>
                        </div>

                        {/* Voice Assistant Button */}
                        <button
                            onClick={toggleVoiceAssistant}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${sessionActive
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                            aria-label={sessionActive ? "Stop Voice Assistant" : "Start Voice Assistant"}
                            title={sessionActive ? "Stop Voice Assistant" : "Start Voice Assistant"}
                        >
                            {sessionActive ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Mic className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Voice Feedback Banner - Sticky below header */}
                {sessionActive && (
                    <div
                        className={`px-4 py-3 text-center font-medium transition-all duration-300 flex items-center justify-center gap-3 ${voiceState === 'listening'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : voiceState === 'processing'
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                : voiceState === 'waiting'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                    : voiceState === 'success'
                                        ? 'bg-gray-900 text-white'
                                        : voiceState === 'error'
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                            : 'bg-gray-800 text-white'
                            }`}
                    >
                        {/* Animated indicator */}
                        <div className="flex items-center gap-1">
                            {voiceState === 'listening' && (
                                <>
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <div className="w-2 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                    <div className="w-2 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                                </>
                            )}
                            {voiceState === 'processing' && (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {voiceState === 'waiting' && (
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            )}
                            {voiceState === 'success' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {voiceState === 'error' && (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <span className="text-sm sm:text-base">
                            {voiceFeedback || "🎤 Voice Assistant Active - Say a command"}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24">
                {/* Introduction */}
                <div className="bg-linear-to-br from-[#FF6B00]/10 to-[#FF8534]/5 rounded-2xl p-6 border border-[#FF6B00]/20">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('accessibility.welcome')}</h2>
                    <p className="text-sm text-gray-600">
                        {t('accessibility.intro')}
                    </p>
                </div>

                {/* Language Section */}
                <section ref={sectionRefs['language-section']} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-linear-to-br from-[#FF6B00] to-[#FF8534] rounded-2xl flex items-center justify-center shadow-lg">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{t('accessibility.language')}</h3>
                            <p className="text-sm text-gray-500">{t('accessibility.chooseLanguage')}</p>
                        </div>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Language section. Choose your preferred language. Currently set to ${language === 'en' ? 'English' : 'Urdu'}.`}
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all bg-white text-left flex items-center justify-between"
                            aria-label="Select language"
                            aria-expanded={isLanguageDropdownOpen}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                    {languageOptions.find(lang => lang.value === language)?.flag}
                                </span>
                                <div>
                                    <p className="text-sm text-gray-500 mb-0.5">{t('accessibility.selectedLanguage')}</p>
                                    <p className="font-semibold text-gray-900">
                                        {languageOptions.find(lang => lang.value === language)?.label}
                                    </p>
                                </div>
                            </div>
                            <svg
                                className={`w-5 h-5 text-gray-400 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isLanguageDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in">
                                {languageOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            updateSetting('language', option.value as 'en' | 'ur');
                                            setIsLanguageDropdownOpen(false);
                                        }}
                                        className={`w-full p-4 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${language === option.value ? 'bg-[#FF6B00]/5' : ''
                                            }`}
                                    >
                                        <span className="text-2xl">{option.flag}</span>
                                        <span className="flex-1 font-medium text-gray-900">{option.label}</span>
                                        {language === option.value && (
                                            <div className="w-6 h-6 bg-[#FF6B00] rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Illiterate Section - Moved to top for priority */}
                <section ref={sectionRefs['illiterate-section']} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{t('accessibility.illiterate')}</h3>
                            <p className="text-sm text-gray-500">{t('accessibility.illiterateDesc')}</p>
                        </div>
                        <SpeakButton
                            text={`Illiterate users section. Settings for users who cannot read including audio assistance and pictorial menu.`}
                            size="sm"
                        />
                    </div>
                    <div className="grid gap-4">
                        {illiterateSettings.map((setting) => {
                            const Icon = setting.icon;
                            const isEnabled = settings[setting.key];

                            if (setting.key === 'audioAssistance') {
                                return (
                                    <div
                                        key={setting.key}
                                        className={`relative overflow-hidden rounded-2xl border-2 transition-all ${isEnabled
                                            ? 'border-[#FF6B00] bg-linear-to-br from-[#FF6B00]/10 to-orange-50 shadow-lg'
                                            : 'border-gray-200 bg-linear-to-br from-white to-gray-50'
                                            }`}
                                    >
                                        {/* Prominent Visual Indicator - Large Speaker Icon for Affordance */}
                                        <div className="p-6">
                                            <div className="flex flex-col items-center text-center mb-4">
                                                {/* Large animated speaker icon - visual affordance for illiterate users */}
                                                <button
                                                    onClick={() => {
                                                        if (isEnabled) {
                                                            window.speechSynthesis.cancel();
                                                            updateSetting(setting.key, false);
                                                        } else {
                                                            speak('Audio assistance is now active. You will see speaker icons on all items. Tap the speaker icon to hear the name of any item.');
                                                            updateSetting(setting.key, true);
                                                        }
                                                    }}
                                                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl mb-4 ${isEnabled
                                                        ? 'bg-linear-to-br from-[#FF6B00] to-[#FF8C3A] animate-pulse ring-4 ring-[#FF6B00]/30'
                                                        : 'bg-linear-to-br from-gray-100 to-gray-200 hover:from-[#FF6B00]/20 hover:to-[#FF8C3A]/20 hover:scale-110'
                                                        }`}
                                                    aria-label={isEnabled ? 'Turn off audio assistance' : 'Turn on audio assistance'}
                                                >
                                                    <Volume2 className={`w-12 h-12 ${isEnabled ? 'text-white' : 'text-gray-500'}`} />
                                                </button>

                                                {/* Visual indicator waves when active */}
                                                {isEnabled && (
                                                    <div className="flex items-center gap-1 mb-2">
                                                        <div className="w-1 h-3 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-1 h-5 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-1 h-4 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                        <div className="w-1 h-6 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
                                                        <div className="w-1 h-3 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                                                    </div>
                                                )}

                                                <h4 className="font-bold text-gray-900 text-lg mb-1">{setting.label}</h4>
                                                <p className="text-sm text-gray-600 max-w-xs">{setting.description}</p>
                                            </div>

                                            {/* Status indicator with clear visual feedback */}
                                            <div className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition-all ${isEnabled
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                                <span className="font-semibold text-sm">
                                                    {isEnabled ? '🔊 Active - Tap speaker icons to hear names' : '🔇 Tap the big speaker to start'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Decorative sound waves in background when active */}
                                        {isEnabled && (
                                            <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10">
                                                <div className="absolute inset-0 border-4 border-[#FF6B00] rounded-full animate-ping"></div>
                                                <div className="absolute inset-4 border-4 border-[#FF6B00] rounded-full animate-ping" style={{ animationDelay: '300ms' }}></div>
                                                <div className="absolute inset-8 border-4 border-[#FF6B00] rounded-full animate-ping" style={{ animationDelay: '600ms' }}></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={setting.key}
                                    className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all bg-linear-to-r from-white to-gray-50/50"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${setting.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900 mb-0.5">{setting.label}</h4>
                                                {settings.audioAssistance && (
                                                    <SpeakButton
                                                        text={`${setting.label}. ${setting.description}. Currently ${isEnabled ? 'enabled' : 'disabled'}.`}
                                                        size="sm"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{setting.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => updateSetting(setting.key, !isEnabled)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-200 ease-in-out shrink-0 ml-4 ${isEnabled ? 'bg-[#FF6B00]' : 'bg-gray-300'
                                            }`}
                                        aria-label={`Toggle ${setting.label}`}
                                        aria-checked={isEnabled ? 'true' : 'false'}
                                        role="switch"
                                    >
                                        <div
                                            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-md ${isEnabled ? 'translate-x-7 left-0.5' : 'translate-x-0 left-0.5'
                                                }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Urdu Mode Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all bg-linear-to-r from-white to-gray-50/50">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900 mb-0.5">Urdu Mode</h4>
                                        {settings.audioAssistance && (
                                            <SpeakButton
                                                text={`Urdu Mode. Switch language to Urdu. Currently ${language === 'ur' ? 'enabled' : 'disabled'}.`}
                                                size="sm"
                                            />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Switch language to Urdu</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateSetting('language', language === 'ur' ? 'en' : 'ur')}
                                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ease-in-out shrink-0 ml-4 ${language === 'ur' ? 'bg-[#FF6B00]' : 'bg-gray-300'}`}
                                aria-label="Toggle Urdu Mode"
                                aria-checked={language === 'ur' ? 'true' : 'false'}
                                role="switch"
                            >
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-md ${language === 'ur' ? 'translate-x-7 left-0.5' : 'translate-x-0 left-0.5'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Seniors Section */}
                <section ref={sectionRefs['seniors-section']} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{t('accessibility.seniors')}</h3>
                            <p className="text-sm text-gray-500">{t('accessibility.seniorsDesc')}</p>
                        </div>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Seniors section. Settings for elderly users including large text, large buttons, and high contrast.`}
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="grid gap-4">
                        {seniorsSettings.map((setting) => {
                            const Icon = setting.icon;
                            const isEnabled = settings[setting.key];
                            return (
                                <div
                                    key={setting.key}
                                    className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all bg-linear-to-r from-white to-gray-50/50"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${setting.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900 mb-0.5">{setting.label}</h4>
                                                {settings.audioAssistance && (
                                                    <SpeakButton
                                                        text={`${setting.label}. ${setting.description}. Currently ${isEnabled ? 'enabled' : 'disabled'}.`}
                                                        size="sm"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{setting.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => updateSetting(setting.key, !isEnabled)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-200 ease-in-out shrink-0 ml-4 ${isEnabled ? 'bg-[#FF6B00]' : 'bg-gray-300'
                                            }`}
                                        aria-label={`Toggle ${setting.label}`}
                                        aria-checked={isEnabled ? 'true' : 'false'}
                                        role="switch"
                                    >
                                        <div
                                            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-md ${isEnabled ? 'translate-x-7 left-0.5' : 'translate-x-0 left-0.5'
                                                }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Disability Section */}
                <section ref={sectionRefs['disability-section']} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{t('accessibility.disabilities')}</h3>
                            <p className="text-sm text-gray-500">{t('accessibility.disabilitiesDesc')}</p>
                        </div>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Disability section. Settings for users with disabilities including reading mode, color blind mode, and reduced motion.`}
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="grid gap-4">
                        {disabilitySettings.map((setting) => {
                            const Icon = setting.icon;

                            if (setting.key === 'colorBlindMode') {
                                return (
                                    <div
                                        key={setting.key}
                                        className="flex flex-col p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all bg-linear-to-r from-white to-gray-50/50"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${setting.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900 mb-0.5">{setting.label}</h4>
                                                    {settings.audioAssistance && (
                                                        <SpeakButton
                                                            text={`${setting.label}. ${setting.description}. Currently set to ${settings.colorBlindMode}.`}
                                                            size="sm"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{setting.description}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { value: 'none', label: 'None' },
                                                { value: 'protanopia', label: 'Protanopia' },
                                                { value: 'deuteranopia', label: 'Deuteranopia' },
                                                { value: 'tritanopia', label: 'Tritanopia' },
                                            ].map((mode) => (
                                                <div key={mode.value} className="relative">
                                                    <button
                                                        onClick={() => updateSetting('colorBlindMode', mode.value as any)}
                                                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${settings.colorBlindMode === mode.value
                                                            ? 'bg-[#FF6B00] text-white shadow-sm'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {mode.label}
                                                    </button>
                                                    {settings.audioAssistance && (
                                                        <div className="absolute -top-1 -right-1">
                                                            <SpeakButton
                                                                text={`${mode.label} color blind mode. ${settings.colorBlindMode === mode.value ? 'Currently selected.' : 'Tap to select.'}`}
                                                                size="sm"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            const isEnabled = settings[setting.key];
                            return (
                                <div
                                    key={setting.key}
                                    className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all bg-linear-to-r from-white to-gray-50/50"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${setting.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900 mb-0.5">{setting.label}</h4>
                                                {settings.audioAssistance && (
                                                    <SpeakButton
                                                        text={`${setting.label}. ${setting.description}. Currently ${isEnabled ? 'enabled' : 'disabled'}.`}
                                                        size="sm"
                                                    />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{setting.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => updateSetting(setting.key, !isEnabled)}
                                        className={`relative w-14 h-8 rounded-full transition-colors duration-200 ease-in-out shrink-0 ml-4 ${isEnabled ? 'bg-[#FF6B00]' : 'bg-gray-300'
                                            }`}
                                        aria-label={`Toggle ${setting.label}`}
                                        aria-checked={isEnabled ? 'true' : 'false'}
                                        role="switch"
                                    >
                                        <div
                                            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-md ${isEnabled ? 'translate-x-7 left-0.5' : 'translate-x-0 left-0.5'
                                                }`}
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Font Size Section */}
                <section ref={sectionRefs['font-section']} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Type className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{t('accessibility.textSize')}</h3>
                            <p className="text-sm text-gray-500">{t('accessibility.textSizeDesc')}</p>
                        </div>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Font Size section. Choose your preferred text size. Currently set to ${settings.fontSize}.`}
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {fontSizeOptions.map((option) => (
                            <div key={option.value} className="relative">
                                <button
                                    onClick={() => updateSetting('fontSize', option.value)}
                                    className={`w-full p-5 rounded-xl border-2 transition-all ${settings.fontSize === option.value
                                        ? 'border-[#FF6B00] bg-[#FF6B00]/5 shadow-md scale-[1.02]'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900">{option.label}</span>
                                        {settings.fontSize === option.value && (
                                            <div className="w-6 h-6 bg-[#FF6B00] rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`${option.size} text-gray-600 mb-1`}>{t('accessibility.sampleText')}</div>
                                    <div className="text-xs text-gray-400">{option.description}</div>
                                </button>
                                {settings.audioAssistance && (
                                    <div className="absolute -top-2 -right-2">
                                        <SpeakButton
                                            text={`${option.label} font size, ${option.description}. ${settings.fontSize === option.value ? 'Currently selected.' : 'Tap to select.'}`}
                                            size="sm"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Visual Adjustments */}
                <section ref={sectionRefs['visual-section']} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('accessibility.visualAdjustments')}</h3>
                            <p className="text-sm text-gray-500">{t('accessibility.visualAdjustmentsDesc')}</p>
                        </div>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Visual Adjustments section. Settings for text spacing, readable fonts, and link highlighting.`}
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="space-y-3">
                        {toggleSettings.map((setting) => {
                            const Icon = setting.icon;
                            const isEnabled = settings[setting.key];
                            return (
                                <div key={setting.key} className="relative">
                                    <button
                                        onClick={() => updateSetting(setting.key, !isEnabled)}
                                        className={`w-full p-5 rounded-xl border-2 transition-all text-left ${isEnabled
                                            ? 'border-[#FF6B00] bg-[#FF6B00]/5 shadow-sm'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isEnabled ? 'bg-[#FF6B00] shadow-lg' : 'bg-gray-100'
                                                        }`}
                                                >
                                                    <Icon
                                                        className={`w-6 h-6 ${isEnabled ? 'text-white' : 'text-gray-600'
                                                            }`}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-gray-900">{setting.label}</h4>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                                            {setting.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{setting.description}</p>
                                                </div>
                                            </div>
                                            <div
                                                className={`relative w-14 h-7 rounded-full transition-colors shrink-0 ${isEnabled ? 'bg-[#FF6B00]' : 'bg-gray-300'
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${isEnabled ? 'translate-x-7' : 'translate-x-0'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </button>
                                    {settings.audioAssistance && (
                                        <div className="absolute top-2 right-2">
                                            <SpeakButton
                                                text={`${setting.label}. ${setting.description}. Currently ${isEnabled ? 'enabled' : 'disabled'}.`}
                                                size="sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Color Vision Section */}
                <section ref={sectionRefs['color-section']} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Eye className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{t('accessibility.colorVision')}</h3>
                            <p className="text-sm text-gray-500">{t('accessibility.colorVisionDesc')}</p>
                        </div>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Color Vision section. Adjust colors for color blindness. Currently set to ${settings.colorBlindMode}.`}
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="grid gap-3">
                        {colorBlindOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <div key={option.value} className="relative">
                                    <button
                                        onClick={() => updateSetting('colorBlindMode', option.value)}
                                        className={`w-full p-5 rounded-xl border-2 transition-all text-left ${settings.colorBlindMode === option.value
                                            ? 'border-[#FF6B00] bg-[#FF6B00]/5 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${settings.colorBlindMode === option.value ? 'bg-[#FF6B00]' : 'bg-gray-100'
                                                    }`}>
                                                    <Icon className={`w-6 h-6 ${settings.colorBlindMode === option.value ? 'text-white' : 'text-gray-600'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 mb-0.5">{option.label}</h4>
                                                    <p className="text-sm text-gray-500">{option.description}</p>
                                                </div>
                                            </div>
                                            {settings.colorBlindMode === option.value && (
                                                <div className="w-7 h-7 bg-[#FF6B00] rounded-full flex items-center justify-center">
                                                    <Check className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                    {settings.audioAssistance && (
                                        <div className="absolute top-2 right-2">
                                            <SpeakButton
                                                text={`${option.label}. ${option.description}. ${settings.colorBlindMode === option.value ? 'Currently selected.' : 'Tap to select.'}`}
                                                size="sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Accessibility Tips */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t('accessibility.features')}</h3>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Accessibility tips and features section.`}
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="space-y-3">
                        {accessibilityTips.map((tip, index) => {
                            const Icon = tip.icon;
                            return (
                                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl relative">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 shrink-0">
                                        <Icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                                        <p className="text-sm text-gray-600">{tip.description}</p>
                                    </div>
                                    {settings.audioAssistance && (
                                        <SpeakButton
                                            text={`${tip.title}. ${tip.description}`}
                                            size="sm"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Reset Section */}
                <section ref={sectionRefs['reset-section']} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{t('accessibility.resetSettings')}</h3>
                        {settings.audioAssistance && (
                            <SpeakButton
                                text={`Reset Settings section. Tap to reset all accessibility settings to default.`}
                                size="sm"
                            />
                        )}
                    </div>
                    {showResetConfirm ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <p className="text-sm text-amber-800 font-medium">
                                    {t('accessibility.resetConfirm')}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {t('accessibility.cancel')}
                                </button>
                                <button
                                    onClick={() => {
                                        resetSettings();
                                        setShowResetConfirm(false);
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl bg-red-500 font-semibold text-white hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    {t('accessibility.confirmReset')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowResetConfirm(true)}
                            className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            {t('accessibility.resetAll')}
                        </button>
                    )}
                </section>
            </div>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}
