import React, { useState } from 'react';
import { FileText, Zap, Clock, BookOpen, HelpCircle, ListTodo, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateAdvancedSummary } from '../../services/analysisService';
import MarkdownRenderer from '../MarkdownRenderer';

const summaryModes = [
    { id: 'ultrashort', icon: Zap, label: 'Ultra-court', description: 'Tweet-style', emoji: '⚡' },
    { id: 'executive', icon: FileText, label: 'Exécutif', description: 'Points clés', emoji: '📋' },
    { id: 'detailed', icon: BookOpen, label: 'Détaillé', description: 'Complet', emoji: '📖' },
    { id: 'timeline', icon: Clock, label: 'Timeline', description: 'Chronologique', emoji: '⏱️' },
    { id: 'qa', icon: HelpCircle, label: 'Q&A', description: 'Questions/Réponses', emoji: '❓' },
    { id: 'actionable', icon: ListTodo, label: 'Actions', description: 'À faire', emoji: '✅' },
];

const AdvancedSummaryView = ({ transcript, initialResult = null }) => {
    const [selectedMode, setSelectedMode] = useState('executive');
    const [result, setResult] = useState(initialResult);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async (mode) => {
        setSelectedMode(mode);
        setIsLoading(true);
        setError(null);

        const response = await generateAdvancedSummary(transcript, mode);

        if (response.success) {
            setResult(response.data);
        } else {
            setError(response.error);
        }

        setIsLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
        >
            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-2">
                {summaryModes.map((mode) => {
                    const Icon = mode.icon;
                    const isSelected = selectedMode === mode.id;

                    return (
                        <button
                            key={mode.id}
                            onClick={() => handleGenerate(mode.id)}
                            disabled={isLoading}
                            className={`
                p-3 rounded-xl border text-center transition-all
                ${isSelected
                                    ? 'bg-primary/20 border-primary/50 text-primary-light'
                                    : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/5 hover:border-white/10'}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            <span className="text-xl mb-1 block">{mode.emoji}</span>
                            <span className="text-xs font-medium block">{mode.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Result Display */}
            <div className="glass-panel p-4 rounded-2xl min-h-[200px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[200px] gap-3">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-sm text-white/50">Génération en cours...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-[200px] gap-2 text-center">
                        <span className="text-2xl">⚠️</span>
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                ) : result ? (
                    <MarkdownRenderer content={result} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] gap-2 text-center">
                        <span className="text-3xl">👆</span>
                        <p className="text-sm text-white/40">Sélectionnez un mode de résumé</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AdvancedSummaryView;
