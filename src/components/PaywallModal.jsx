import React, { useState } from 'react';
import { X, Check, Sparkles, Zap, Shield, Crown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../context/SubscriptionContext';

const PaywallModal = ({ isOpen, onClose, feature = null }) => {
    const { tiers, upgradeToPremium, canStartTrial, restorePurchases } = useSubscription();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('premium');

    const handleSubscribe = async (withTrial = false) => {
        setIsLoading(true);

        // Simulate purchase flow (real app would use StoreKit)
        await new Promise(r => setTimeout(r, 1500));

        const success = upgradeToPremium(withTrial);
        setIsLoading(false);

        if (success) {
            onClose();
        }
    };

    const handleRestore = async () => {
        setIsLoading(true);
        const restored = await restorePurchases();
        setIsLoading(false);

        if (restored) {
            onClose();
        } else {
            alert('Aucun achat à restaurer.');
        }
    };

    const featureMessages = {
        transcription: 'Vous avez atteint votre limite de transcriptions ce mois-ci.',
        analysis: 'L\'analyse avancée est une fonctionnalité Premium.',
        chat: 'Vous avez atteint votre limite de messages aujourd\'hui.'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-gradient-to-b from-surface-elevated to-background rounded-t-3xl overflow-hidden"
                        style={{ maxHeight: '90vh', paddingBottom: 'env(safe-area-inset-bottom)' }}
                    >
                        {/* Header */}
                        <div className="relative pt-6 pb-4 px-6">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/50 hover:text-white/80 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                                    <Crown size={28} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Passez à Premium
                                </h2>
                                {feature && (
                                    <p className="text-sm text-white/50">
                                        {featureMessages[feature]}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="px-6 py-4">
                            <div className="space-y-3">
                                {tiers.premium.features.map((feat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <Check size={14} className="text-green-400" />
                                        </div>
                                        <span className="text-sm text-white/80">{feat}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="px-6 py-4">
                            <div className="p-4 rounded-2xl bg-primary/10 border-2 border-primary/30 relative overflow-hidden">
                                {/* Popular badge */}
                                <div className="absolute top-0 right-0 bg-primary text-white text-xxs font-bold px-3 py-1 rounded-bl-xl">
                                    POPULAIRE
                                </div>

                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-3xl font-bold text-white">7,99€</span>
                                    <span className="text-white/50">/mois</span>
                                </div>

                                {canStartTrial && (
                                    <p className="text-sm text-primary-light">
                                        🎁 Essai gratuit de 7 jours
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="px-6 py-4 space-y-3">
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSubscribe(canStartTrial)}
                                disabled={isLoading}
                                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        {canStartTrial ? 'Commencer l\'essai gratuit' : 'S\'abonner maintenant'}
                                    </>
                                )}
                            </motion.button>

                            <button
                                onClick={handleRestore}
                                disabled={isLoading}
                                className="w-full py-3 text-sm text-white/50 hover:text-white/70 transition-colors"
                            >
                                Restaurer mes achats
                            </button>
                        </div>

                        {/* Legal */}
                        <div className="px-6 pb-6">
                            <p className="text-xxs text-white/30 text-center leading-relaxed">
                                L'abonnement se renouvelle automatiquement. Annulez à tout moment dans les paramètres de votre compte Apple.
                                En continuant, vous acceptez nos <a href="#" className="underline">Conditions d'utilisation</a> et notre <a href="#" className="underline">Politique de confidentialité</a>.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaywallModal;
