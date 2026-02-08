import React from 'react';
import { ClipboardList, MessageCircle, FileText, Sparkles, Brain } from 'lucide-react';

const analysisTypes = [
    {
        id: 'meeting',
        icon: ClipboardList,
        title: 'Analyse de Réunion',
        description: 'Participants, sujets, décisions, actions à suivre',
        color: 'primary',
        emoji: '📋'
    },
    {
        id: 'conversation',
        icon: MessageCircle,
        title: 'Analyse de Conversation',
        description: 'Sentiment, arguments clés, points d\'accord',
        color: 'secondary',
        emoji: '💬'
    },
    {
        id: 'brainstorm',
        icon: Brain,
        title: 'Brainstorm & Réflexion',
        description: 'Idées, connexions, insights, monologue créatif',
        color: 'accent',
        emoji: '🧠'
    },
    {
        id: 'summary',
        icon: FileText,
        title: 'Résumé Avancé',
        description: 'Ultra-court, exécutif, timeline, Q&A...',
        color: 'white',
        emoji: '📝'
    },
    {
        id: 'custom',
        icon: Sparkles,
        title: 'Analyse Personnalisée',
        description: 'Créez votre propre analyse',
        color: 'white',
        emoji: '🎯',
        comingSoon: true
    }
];

const colorClasses = {
    primary: {
        bg: 'bg-primary/10',
        border: 'border-primary/30',
        text: 'text-primary',
        hover: 'hover:bg-primary/20 hover:border-primary/50'
    },
    secondary: {
        bg: 'bg-secondary/10',
        border: 'border-secondary/30',
        text: 'text-secondary',
        hover: 'hover:bg-secondary/20 hover:border-secondary/50'
    },
    accent: {
        bg: 'bg-accent/10',
        border: 'border-accent/30',
        text: 'text-accent',
        hover: 'hover:bg-accent/20 hover:border-accent/50'
    },
    white: {
        bg: 'bg-surface',
        border: 'border-border',
        text: 'text-text-secondary',
        hover: 'hover:bg-surface-elevated hover:border-border-hover'
    }
};

const AnalysisSelector = ({ onSelect, disabled = false }) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary mb-4">
                Choisissez un type d'analyse
            </h3>

            {analysisTypes.map((type, index) => {
                const colors = colorClasses[type.color];
                const Icon = type.icon;

                return (
                    <button
                        key={type.id}
                        onClick={() => !type.comingSoon && !disabled && onSelect(type.id)}
                        disabled={disabled || type.comingSoon}
                        className={`
              w-full p-4 rounded-2xl border text-left transition-all duration-300
              ${colors.bg} ${colors.border} ${!type.comingSoon && !disabled ? colors.hover : ''}
              ${type.comingSoon ? 'opacity-50 cursor-not-allowed' : disabled ? 'opacity-50' : 'cursor-pointer'}
              group
            `}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                ${colors.bg} ${colors.text}
              `}>
                                {type.emoji}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-medium ${colors.text}`}>
                                        {type.title}
                                    </h4>
                                    {type.comingSoon && (
                                        <span className="text-xxs bg-surface text-text-tertiary px-2 py-0.5 rounded-full">
                                            Bientôt
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-text-tertiary mt-0.5">
                                    {type.description}
                                </p>
                            </div>

                            {!type.comingSoon && (
                                <Icon
                                    size={18}
                                    className={`${colors.text} opacity-50 group-hover:opacity-100 transition-opacity`}
                                />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default AnalysisSelector;
