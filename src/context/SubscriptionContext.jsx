import React, { createContext, useState, useEffect, useContext } from 'react';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

// Subscription tiers configuration
const TIERS = {
    free: {
        id: 'free',
        name: 'Gratuit',
        price: 0,
        limits: {
            transcriptionsPerMonth: 3,
            analysisPerMonth: 0,
            chatMessagesPerDay: 10,
            historyDays: 7
        },
        features: [
            '3 transcriptions/mois',
            'Résumé basique',
            '7 jours d\'historique',
            'Chat limité'
        ]
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        price: 7.99,
        priceId: 'voice_notes_premium_monthly',
        limits: {
            transcriptionsPerMonth: Infinity,
            analysisPerMonth: Infinity,
            chatMessagesPerDay: Infinity,
            historyDays: Infinity
        },
        features: [
            'Transcriptions illimitées',
            'Tous les paquets d\'analyse',
            'Historique illimité',
            'Chat IA illimité',
            'Export des notes',
            'Support prioritaire'
        ]
    }
};

export const SubscriptionProvider = ({ children }) => {
    // Subscription state
    const [subscription, setSubscription] = useState(() => {
        const saved = localStorage.getItem('voice_notes_subscription');
        return saved ? JSON.parse(saved) : {
            tier: 'free',
            startDate: null,
            endDate: null,
            trialUsed: false
        };
    });

    // Usage tracking
    const [usage, setUsage] = useState(() => {
        const saved = localStorage.getItem('voice_notes_usage');
        const today = new Date().toISOString().split('T')[0];
        const defaultUsage = {
            transcriptionsThisMonth: 0,
            analysisThisMonth: 0,
            chatMessagesToday: 0,
            lastResetDate: today,
            monthResetDate: today.slice(0, 7) // YYYY-MM
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            // Reset daily counters if new day
            if (parsed.lastResetDate !== today) {
                parsed.chatMessagesToday = 0;
                parsed.lastResetDate = today;
            }
            // Reset monthly counters if new month
            const currentMonth = today.slice(0, 7);
            if (parsed.monthResetDate !== currentMonth) {
                parsed.transcriptionsThisMonth = 0;
                parsed.analysisThisMonth = 0;
                parsed.monthResetDate = currentMonth;
            }
            return parsed;
        }
        return defaultUsage;
    });

    // Persist subscription
    useEffect(() => {
        localStorage.setItem('voice_notes_subscription', JSON.stringify(subscription));
    }, [subscription]);

    // Persist usage
    useEffect(() => {
        localStorage.setItem('voice_notes_usage', JSON.stringify(usage));
    }, [usage]);

    // Get current tier config
    const currentTier = TIERS[subscription.tier] || TIERS.free;
    const isPremium = subscription.tier === 'premium';

    // Check if feature is available
    const canUseFeature = (feature) => {
        if (isPremium) return true;

        const limits = currentTier.limits;
        switch (feature) {
            case 'transcription':
                return usage.transcriptionsThisMonth < limits.transcriptionsPerMonth;
            case 'analysis':
                return usage.analysisThisMonth < limits.analysisPerMonth;
            case 'chat':
                return usage.chatMessagesToday < limits.chatMessagesPerDay;
            default:
                return true;
        }
    };

    // Get remaining usage
    const getRemainingUsage = (feature) => {
        if (isPremium) return Infinity;

        const limits = currentTier.limits;
        switch (feature) {
            case 'transcription':
                return Math.max(0, limits.transcriptionsPerMonth - usage.transcriptionsThisMonth);
            case 'analysis':
                return limits.analysisPerMonth - usage.analysisThisMonth;
            case 'chat':
                return Math.max(0, limits.chatMessagesPerDay - usage.chatMessagesToday);
            default:
                return Infinity;
        }
    };

    // Track usage
    const trackUsage = (feature) => {
        setUsage(prev => {
            switch (feature) {
                case 'transcription':
                    return { ...prev, transcriptionsThisMonth: prev.transcriptionsThisMonth + 1 };
                case 'analysis':
                    return { ...prev, analysisThisMonth: prev.analysisThisMonth + 1 };
                case 'chat':
                    return { ...prev, chatMessagesToday: prev.chatMessagesToday + 1 };
                default:
                    return prev;
            }
        });
    };

    // Upgrade to premium (simulated for now)
    const upgradeToPremium = (withTrial = false) => {
        const now = new Date();
        const endDate = new Date();

        if (withTrial && !subscription.trialUsed) {
            endDate.setDate(endDate.getDate() + 7); // 7 day trial
        } else {
            endDate.setMonth(endDate.getMonth() + 1); // 1 month
        }

        setSubscription({
            tier: 'premium',
            startDate: now.toISOString(),
            endDate: endDate.toISOString(),
            trialUsed: withTrial ? true : subscription.trialUsed
        });

        return true;
    };

    // Restore purchases (simulated)
    const restorePurchases = async () => {
        // In real app, this would call StoreKit
        // For now, return current state
        return subscription.tier === 'premium';
    };

    // Cancel subscription
    const cancelSubscription = () => {
        setSubscription(prev => ({
            ...prev,
            tier: 'free',
            endDate: null
        }));
    };

    // Check trial eligibility
    const canStartTrial = !subscription.trialUsed;

    // Days remaining in subscription
    const getDaysRemaining = () => {
        if (!subscription.endDate) return null;
        const end = new Date(subscription.endDate);
        const now = new Date();
        const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return Math.max(0, days);
    };

    return (
        <SubscriptionContext.Provider value={{
            // State
            subscription,
            currentTier,
            isPremium,
            usage,
            tiers: TIERS,

            // Usage
            canUseFeature,
            getRemainingUsage,
            trackUsage,

            // Subscription actions
            upgradeToPremium,
            restorePurchases,
            cancelSubscription,
            canStartTrial,
            getDaysRemaining
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};
