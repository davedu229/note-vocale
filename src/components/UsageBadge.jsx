import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const UsageBadge = ({ feature, showUpgrade = true, onUpgradeClick }) => {
    const { isPremium, getRemainingUsage, canUseFeature } = useSubscription();

    if (isPremium) return null;

    const remaining = getRemainingUsage(feature);
    const canUse = canUseFeature(feature);

    const labels = {
        transcription: 'transcription',
        analysis: 'analyse',
        chat: 'message'
    };

    const label = labels[feature] || feature;

    if (!canUse) {
        return (
            <div
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full cursor-pointer hover:bg-red-500/20 transition-colors"
                onClick={onUpgradeClick}
            >
                <Zap size={12} className="text-red-400" />
                <span className="text-xs text-red-400 font-medium">
                    Limite atteinte
                </span>
            </div>
        );
    }

    if (remaining <= 3 && remaining > 0) {
        return (
            <div
                className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full cursor-pointer hover:bg-yellow-500/20 transition-colors"
                onClick={showUpgrade ? onUpgradeClick : undefined}
            >
                <TrendingUp size={12} className="text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">
                    {remaining} {label}{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
                </span>
            </div>
        );
    }

    return null;
};

export default UsageBadge;
