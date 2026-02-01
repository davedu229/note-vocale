import React from 'react';
import { Sparkles, Bot, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryView = ({ summary, isProcessing }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!summary && !isProcessing) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
        >
            <div className="flex items-center justify-between mb-3 text-accent">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    <h2 className="text-sm font-bold uppercase tracking-wider">Résumé IA</h2>
                </div>
                {summary && (
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-xs px-2 py-1 hover:bg-white/10 rounded-md transition-colors"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copié' : 'Copier'}
                    </button>
                )}
            </div>

            <div className="glass-panel p-1 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <div className="bg-[#0a0a0f]/80 backdrop-blur-sm p-6 rounded-xl min-h-[150px]">
                    {isProcessing ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                            <Sparkles className="w-8 h-8 text-accent animate-spin" />
                            <p className="text-sm text-accent/80 animate-pulse">Génération du résumé intelligent...</p>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <div className="whitespace-pre-wrap">{summary}</div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SummaryView;
