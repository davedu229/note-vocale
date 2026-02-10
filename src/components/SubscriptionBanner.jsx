import React from 'react';
import { Crown, ChevronRight } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { motion } from 'framer-motion';

const SubscriptionBanner = ({ onUpgradeClick, variant = 'full' }) => {
    const { isPremium, currentTier, canStartTrial, usage } = useSubscription();

    // Premium user - hide the banner completely
    if (isPremium) {
        return null;
    }

    // Free user - compact variant
    if (variant === 'compact') {
        return (
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onUpgradeClick}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-xl hover:from-primary/30 hover:to-accent/30 transition-all"
            >
                <Crown size={14} className="text-primary-light" />
                <span className="text-xs font-medium text-primary-light">Premium</span>
            </motion.button>
        );
    }

    // Free user - full variant with usage info
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onUpgradeClick}
            className="w-full text-left"
        >
            <div className="p-4 bg-surface-elevated border border-border rounded-2xl hover:border-primary/30 transition-all group">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                            <Crown size={18} className="text-primary-light" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-primary">Passer à Premium</p>
                            <p className="text-xs text-text-tertiary">
                                {canStartTrial ? '7 jours d\'essai gratuit' : '7,99€/mois'}
                            </p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-text-tertiary group-hover:text-primary transition-colors" />
                </div>

                {/* Usage bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-text-tertiary">Transcriptions ce mois</span>
                        <span className="text-text-secondary">{usage.transcriptionsThisMonth}/{currentTier.limits.transcriptionsPerMonth}</span>
                    </div>
                    <div className="h-1.5 bg-surface-elevated border border-border rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (usage.transcriptionsThisMonth / currentTier.limits.transcriptionsPerMonth) * 100)}%` }}
                            className={`h-full rounded-full ${usage.transcriptionsThisMonth >= currentTier.limits.transcriptionsPerMonth
                                ? 'bg-red-500'
                                : usage.transcriptionsThisMonth >= currentTier.limits.transcriptionsPerMonth - 1
                                    ? 'bg-yellow-500'
                                    : 'bg-primary'
                                }`}
                        />
                    </div>
                </div>
            </div>
        </motion.button>
    );
};

export default SubscriptionBanner;
