import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { useTheme } from '../context/ThemeContext';
import { Activity, Crown, ChevronRight, Bell, Shield, HelpCircle, FileText, Mail, LogOut, ExternalLink, Key, Eye, EyeOff, Check, Sparkles, Moon, Sun } from 'lucide-react';
import { testConnection, getStoredApiKey, setStoredApiKey, getSummaryStyle, setSummaryStyle, getSummaryStyleOptions } from '../services/ai';

const SettingsPage = ({ onUpgradeClick }) => {
    const { theme, toggleTheme } = useTheme();
    // API Key state - initialize from localStorage
    const [apiKey, setApiKey] = useState(() => getStoredApiKey() || '');
    const [showApiKey, setShowApiKey] = useState(false);
    const [apiKeySaved, setApiKeySaved] = useState(false);

    // Summary Style state
    const [summaryStyle, setCurrentSummaryStyle] = useState(() => getSummaryStyle());
    const styleOptions = getSummaryStyleOptions();

    const handleStyleChange = (styleKey) => {
        setSummaryStyle(styleKey);
        setCurrentSummaryStyle(styleKey);
    };

    const handleSaveApiKey = () => {
        setStoredApiKey(apiKey);
        setApiKeySaved(true);
        setTimeout(() => setApiKeySaved(false), 2000);
    };

    const handleTestConnection = async () => {
        const result = await testConnection();
        alert(result.message);
    };

    const {
        isPremium,
        currentTier,
        getDaysRemaining,
        usage
    } = useSubscription();

    const daysLeft = getDaysRemaining();

    const handleManageSubscription = () => {
        // In real iOS app, this would open App Store subscription management
        window.open('https://apps.apple.com/account/subscriptions', '_blank');
    };

    const menuSections = [
        {
            title: 'Compte',
            items: [
                {
                    icon: Crown,
                    label: 'Abonnement',
                    value: isPremium ? 'Premium' : 'Gratuit',
                    color: isPremium ? 'text-primary' : 'text-text-secondary',
                    action: isPremium ? handleManageSubscription : onUpgradeClick
                }
            ]
        },
        {
            title: 'Apparence',
            items: [
                {
                    icon: theme === 'dark' ? Moon : Sun,
                    label: 'Thème',
                    value: theme === 'dark' ? 'Sombre' : 'Clair',
                    action: toggleTheme
                }
            ]
        },
        {
            title: 'Application',
            items: [
                {
                    icon: Bell,
                    label: 'Notifications',
                    value: 'Activées',
                    action: () => { }
                },
                {
                    icon: Shield,
                    label: 'Confidentialité',
                    action: () => { }
                }
            ]
        },
        {
            title: 'Support',
            items: [
                {
                    icon: Activity,
                    label: 'Tester la connexion IA',
                    action: handleTestConnection
                },
                {
                    icon: HelpCircle,
                    label: 'Aide & FAQ',
                    action: () => { }
                },
                {
                    icon: Mail,
                    label: 'Nous contacter',
                    value: 'support@voicenotes.app',
                    action: () => window.open('mailto:support@voicenotes.app')
                }
            ]
        },
        {
            title: 'Légal',
            items: [
                {
                    icon: FileText,
                    label: 'Conditions d\'utilisation',
                    external: true,
                    action: () => window.open('/terms', '_blank')
                },
                {
                    icon: Shield,
                    label: 'Politique de confidentialité',
                    external: true,
                    action: () => window.open('/privacy', '_blank')
                }
            ]
        },
        {
            title: 'Zone Danger',
            items: [
                {
                    icon: LogOut,
                    label: 'Déconnexion',
                    color: 'text-red-500',
                    action: () => {
                        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ? Toutes vos données locales seront effacées.')) {
                            // Clear all local storage data
                            localStorage.removeItem('voice-notes');
                            localStorage.removeItem('voice_notes_subscription');
                            localStorage.removeItem('voice_notes_usage');
                            localStorage.removeItem('chat-history');
                            localStorage.removeItem('global-chat-history');
                            localStorage.removeItem('theme');
                            localStorage.removeItem('openai-api-key');
                            // Reload the page to reset the app state
                            window.location.reload();
                        }
                    }
                }
            ]
        }
    ];

    return (
        <div className="pb-20">
            {/* Subscription Card */}
            <div
                className={`p-5 rounded-2xl mb-6 transition-colors duration-200 ${isPremium
                    ? 'bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/10 border border-primary/30'
                    : 'bg-surface-elevated border border-border'
                    }`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPremium
                            ? 'bg-gradient-to-br from-primary to-accent'
                            : 'bg-surface dark:bg-white/10'
                            }`}>
                            <Crown size={22} className={isPremium ? 'text-white' : 'text-text-primary'} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-text-primary">
                                {isPremium ? 'Premium' : 'Plan Gratuit'}
                            </h3>
                            {isPremium && daysLeft !== null && (
                                <p className="text-xs text-text-secondary">
                                    {daysLeft > 0 ? `Renouvellement dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}` : 'Renouvellement aujourd\'hui'}
                                </p>
                            )}
                            {!isPremium && (
                                <p className="text-xs text-text-secondary">
                                    {usage.transcriptionsThisMonth}/{currentTier.limits.transcriptionsPerMonth} transcriptions utilisées
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {isPremium ? (
                    <button
                        onClick={handleManageSubscription}
                        className="w-full py-2.5 px-4 bg-surface dark:bg-surface-elevated text-text-secondary rounded-xl text-sm font-medium hover:bg-surface-elevated transition-colors flex items-center justify-center gap-2"
                    >
                        Gérer l'abonnement
                        <ExternalLink size={14} />
                    </button>
                ) : (
                    <button
                        onClick={onUpgradeClick}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <Crown size={16} />
                        Passer à Premium
                    </button>
                )}
            </div>

            {/* API Key Configuration */}
            <div
                className="p-5 rounded-2xl mb-6 bg-surface-elevated border border-border"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                        <Key size={18} className="text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-primary text-sm">Clé API Gemini</h3>
                        <p className="text-xs text-text-secondary">Configurez votre propre clé</p>
                    </div>
                </div>

                <div className="relative mb-3">
                    <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-surface dark:bg-white/5 border border-border dark:border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary/50"
                    />
                    <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                    >
                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleSaveApiKey}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${apiKeySaved
                            ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                            : 'bg-primary/10 text-primary dark:text-primary-light border border-primary/30 hover:bg-primary/20'
                            }`}
                    >
                        {apiKeySaved ? <><Check size={16} /> Sauvegardé !</> : 'Sauvegarder'}
                    </button>
                    <button
                        onClick={handleTestConnection}
                        className="py-2.5 px-4 bg-surface dark:bg-surface-elevated text-text-secondary rounded-xl text-sm font-medium hover:bg-surface-elevated transition-colors"
                    >
                        Tester
                    </button>
                </div>

                <p className="text-xs text-text-tertiary mt-3">
                    Obtenez une clé sur <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary-light underline">Google AI Studio</a>
                </p>
            </div>

            {/* Summary Style Selector */}
            <div
                className="p-5 rounded-2xl mb-6 bg-surface-elevated border border-border"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Sparkles size={18} className="text-primary dark:text-primary-light" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-primary text-sm">Style de Résumé</h3>
                        <p className="text-xs text-text-secondary">Personnalisez vos résumés</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {styleOptions.map((option) => (
                        <button
                            key={option.key}
                            onClick={() => handleStyleChange(option.key)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${summaryStyle === option.key
                                ? 'bg-primary/10 border-primary/30'
                                : 'bg-surface dark:bg-white/[0.02] border-border dark:border-white/5 hover:border-border-hover dark:hover:border-white/10'
                                }`}
                        >
                            <span className="text-xl">{option.emoji}</span>
                            <div className="text-left flex-1">
                                <p className={`text-sm font-medium ${summaryStyle === option.key ? 'text-primary dark:text-primary-light' : 'text-text-primary'}`}>
                                    {option.label}
                                </p>
                                <p className="text-xs text-text-tertiary">{option.description}</p>
                            </div>
                            {summaryStyle === option.key && (
                                <Check size={16} className="text-primary dark:text-primary-light" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Sections */}
            {menuSections.map((section, sIdx) => (
                <div key={sIdx} className="mb-6">
                    <h4 className="text-xs text-text-tertiary uppercase tracking-wider font-medium mb-2 px-1">
                        {section.title}
                    </h4>
                    <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
                        {section.items.map((item, iIdx) => (
                            <button
                                key={iIdx}
                                onClick={item.action}
                                className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-surface transition-colors ${iIdx !== section.items.length - 1 ? 'border-b border-border' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={item.color || 'text-text-secondary'} />
                                    <span className="text-sm text-text-primary">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.value && (
                                        <span className={`text-xs ${item.color || 'text-text-tertiary'}`}>
                                            {item.value}
                                        </span>
                                    )}
                                    {item.external ? (
                                        <ExternalLink size={14} className="text-text-tertiary" />
                                    ) : (
                                        <ChevronRight size={16} className="text-text-tertiary/50" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* App Version */}
            <div className="text-center pt-4">
                <p className="text-xs text-text-tertiary">Voice Notes AI v1.0.0</p>
                <p className="text-xxs text-text-tertiary/50 mt-1">Made by Davis AMOUSSOU</p>
            </div>
        </div>
    );
};

export default SettingsPage;
