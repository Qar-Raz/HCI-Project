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

const keywordMap: Record<string, string> = {
    'high contrast': 'highContrast',
    'contrast': 'highContrast',
    'reduced motion': 'reducedMotion',
    'motion': 'reducedMotion',
    'text spacing': 'textSpacing',
    'spacing': 'textSpacing',
    'readable font': 'readableFont',
    'font': 'readableFont',
    'link highlight': 'linkHighlight',
    'links': 'linkHighlight',
    'large text': 'largeTextMode',
    'large button mode': 'largeButtonMode',
    'reading mode': 'readingMode',
    'audio assistance': 'audioAssistance',
    'pictorial menu': 'pictorialMenu',
    'color blind': 'colorBlindMode',
};

export default function AccessibilityPage() {
    const router = useRouter();
    const { settings, updateSetting, resetSettings } = useAccessibility();
    const { t, language } = useTranslation();
    const { toasts, addToast, removeToast } = useToast();
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Voice Assistant State
    const [isListening, setIsListening] = useState(false);
    const [sessionActive, setSessionActive] = useState(false);
    const [voiceFeedback, setVoiceFeedback] = useState('');
    const [suggestedSetting, setSuggestedSetting] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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
            startListening();
        }
    };

    const endSession = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        setSessionActive(false);
        setSuggestedSetting(null);
        setVoiceFeedback('');
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
            if (!suggestedSetting) {
                setVoiceFeedback('Listening... Say a setting name (e.g., "High Contrast")');
            } else {
                setVoiceFeedback('Listening for confirmation... (Say "Yes" or "Toggle")');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            // Auto-restart if session is active and we are not speaking
            if (sessionActive && !window.speechSynthesis.speaking) {
                // Small delay to prevent rapid loops
                setTimeout(() => {
                    if (sessionActive && !recognitionRef.current?.started) {
                        startListening();
                    }
                }, 300);
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
                setVoiceFeedback(`Hearing: ${interimTranscript}`);
            }

            if (finalTranscript) {
                const command = finalTranscript.toLowerCase().trim();
                setVoiceFeedback(`You said: "${command}"`);
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

    const processVoiceCommand = (command: string) => {
        // Handle Color Blind Mode Selection
        if (suggestedSetting === 'colorBlindMode') {
            const modes = ['protanopia', 'deuteranopia', 'tritanopia', 'none'];
            const selectedMode = modes.find(m => command.includes(m));

            if (selectedMode) {
                updateSetting('colorBlindMode', selectedMode as any);
                const msg = `Color Blind Mode set to ${selectedMode}.`;
                speak(msg);
                addToast(msg, 'success');
                setVoiceFeedback(msg);
                setSuggestedSetting(null);
                return;
            }
        }

        // Check for "toggle" or affirmative commands
        const affirmativeWords = ['toggle', 'switch', 'yes', 'yeah', 'yep', 'sure', 'ok', 'correct', 'turn on', 'turn off', 'enable', 'disable'];
        const isAffirmative = affirmativeWords.some(word => command.includes(word));

        if (isAffirmative) {
            if (suggestedSetting) {
                // Special handling for non-boolean settings that were waiting for input
                if (suggestedSetting === 'colorBlindMode') {
                    const msg = "Please say which mode: Protanopia, Deuteranopia, Tritanopia, or None.";
                    speak(msg);
                    setVoiceFeedback("Say: Protanopia, Deuteranopia, Tritanopia, or None");
                    return;
                }

                const currentVal = settings[suggestedSetting as keyof typeof settings];
                // Handle boolean toggles
                if (typeof currentVal === 'boolean') {
                    updateSetting(suggestedSetting as any, !currentVal);
                    const status = !currentVal ? 'enabled' : 'disabled';
                    const msg = `${suggestedSetting.replace(/([A-Z])/g, ' $1')} has been ${status}.`;

                    speak(msg);
                    addToast(msg, 'success');
                    setVoiceFeedback(msg);
                    setSuggestedSetting(null);
                } else {
                    const msg = `I cannot toggle ${suggestedSetting} directly. Please use the manual controls.`;
                    speak(msg);
                    addToast(msg, 'error');
                }
            } else {
                const msg = "I don't have a setting selected to toggle. Please say a setting name first.";
                speak(msg);
                addToast(msg, 'info');
            }
            return;
        }

        // Find setting
        let foundKey: string | null = null;
        for (const [keyword, key] of Object.entries(keywordMap)) {
            if (command.includes(keyword)) {
                foundKey = key;
                break;
            }
        }

        if (foundKey) {
            setSuggestedSetting(foundKey);
            const settingName = foundKey.replace(/([A-Z])/g, ' $1'); // CamelCase to Space
            const currentVal = settings[foundKey as keyof typeof settings];

            // Special handling for Color Blind Mode
            if (foundKey === 'colorBlindMode') {
                const response = `I found Color Blind Mode. It is currently ${currentVal}. You can say Protanopia, Deuteranopia, Tritanopia, or None to change it.`;
                setVoiceFeedback(response);
                addToast(`Found ${settingName}. Say a mode to change.`, 'info');

                if (recognitionRef.current) recognitionRef.current.stop();
                speak(response, () => {
                    setVoiceFeedback("Listening for mode...");
                    startListening();
                });
                return;
            }

            let status = '';
            if (typeof currentVal === 'boolean') {
                status = currentVal ? 'enabled' : 'disabled';
            } else {
                status = `set to ${currentVal}`;
            }

            const response = `I found ${settingName}. It is currently ${status}. Say "Yes" or "Toggle" to change it.`;
            setVoiceFeedback(response);
            addToast(`Found ${settingName}. Say "Yes" to change.`, 'info');

            // Stop listening while speaking to avoid picking up system voice
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }

            speak(response, () => {
                // Restart listening for the toggle command AFTER speech finishes
                // Add a small delay to ensure audio channel is clear
                setTimeout(() => {
                    setVoiceFeedback("Listening for confirmation...");
                    startListening();
                }, 100);
            });
        } else {
            // Only speak error if we are not waiting for a toggle and the command was substantial
            if (!suggestedSetting && command.length > 3) {
                // Don't speak error, just show feedback to be less annoying
                setVoiceFeedback("Setting not found. Try 'High Contrast', 'Large Text', etc.");
            }
        }
    };

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
            </div>

            {/* Voice Feedback Banner */}
            {(voiceFeedback || sessionActive) && (
                <div className={`px-4 py-3 text-center font-medium transition-colors ${isListening ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'
                    }`}>
                    {voiceFeedback || "Voice Assistant Active"}
                </div>
            )}

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
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
