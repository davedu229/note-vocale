import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, Copy, Check, Loader2 } from 'lucide-react';
import { getTransformOptions, transformNote } from '../services/ai';
import MarkdownRenderer from './MarkdownRenderer';

const MagicActionsMenu = ({ content, onClose }) => {
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const options = getTransformOptions();

    const handleTransform = async (format) => {
        setSelectedFormat(format);
        setIsLoading(true);
        setResult(null);

        const transformed = await transformNote(content, format);
        setResult(transformed);
        setIsLoading(false);
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleBack = () => {
        setSelectedFormat(null);
        setResult(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-md mx-4 mb-4 md:mb-0 bg-surface-elevated rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                            <Wand2 size={16} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">
                                {selectedFormat ? options.find(o => o.key === selectedFormat)?.label : 'Magic Actions'}
                            </h3>
                            <p className="text-xxs text-white/40">
                                {selectedFormat ? 'Résultat de la transformation' : 'Transformez votre note'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={selectedFormat ? handleBack : onClose}
                        className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                    >
                        {selectedFormat ? (
                            <span className="text-xs">← Retour</span>
                        ) : (
                            <X size={18} />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
                    <AnimatePresence mode="wait">
                        {!selectedFormat ? (
                            /* Options Grid */
                            <motion.div
                                key="options"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-2 gap-2"
                            >
                                {options.map((option) => (
                                    <button
                                        key={option.key}
                                        onClick={() => handleTransform(option.key)}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                                    >
                                        <span className="text-2xl">{option.emoji}</span>
                                        <span className="text-sm font-medium text-white/70 group-hover:text-white">
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </motion.div>
                        ) : (
                            /* Result View */
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                                        <Loader2 size={32} className="text-primary animate-spin" />
                                        <p className="text-sm text-white/50">Transformation en cours...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                            <MarkdownRenderer content={result || ''} />
                                        </div>

                                        {/* Copy Button */}
                                        <button
                                            onClick={handleCopy}
                                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all ${copied
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-primary/20 text-primary-light hover:bg-primary/30'
                                                }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check size={16} />
                                                    Copié !
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    Copier le résultat
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MagicActionsMenu;
