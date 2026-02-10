import React from 'react';
import { TrendingUp, MessageSquare, ThumbsUp, ThumbsDown, HelpCircle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const ConversationAnalysisView = ({ data }) => {
    if (!data) return null;

    const sentimentColor = {
        positif: { text: 'text-green-400', bg: 'bg-green-500/20', bar: 'bg-green-500' },
        neutre: { text: 'text-text-secondary', bg: 'bg-surface', bar: 'bg-text-secondary' },
        négatif: { text: 'text-red-400', bg: 'bg-red-500/20', bar: 'bg-red-500' }
    };

    const colors = sentimentColor[data.sentiment?.overall] || sentimentColor.neutre;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Sentiment Overview */}
            <div className="glass-panel p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className={colors.text} />
                        <span className="text-sm font-medium text-text-secondary">Analyse du Sentiment</span>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                        {data.sentiment?.overall}
                    </span>
                </div>

                {/* Sentiment Bar */}
                <div className="h-3 bg-surface rounded-full overflow-hidden mb-2">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.sentiment?.score || 50}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${colors.bar} rounded-full`}
                    />
                </div>
                <div className="flex justify-between text-xs text-text-tertiary">
                    <span>Négatif</span>
                    <span className="font-medium text-text-secondary">{data.sentiment?.score || 50}%</span>
                    <span>Positif</span>
                </div>

                {/* Tone */}
                {data.tone && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <span className="text-xs text-text-tertiary">Ton général: </span>
                        <span className="text-sm text-text-secondary capitalize">{data.tone}</span>
                    </div>
                )}
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="p-4 bg-surface rounded-2xl border border-border">
                    <p className="text-sm text-text-secondary leading-relaxed">{data.summary}</p>
                </div>
            )}

            {/* Key Arguments */}
            {data.keyArguments && data.keyArguments.length > 0 && (
                <Section icon={MessageSquare} title="Arguments Clés" emoji="💬">
                    <div className="space-y-2">
                        {data.keyArguments.map((arg, i) => (
                            <div key={i} className="p-3 bg-surface rounded-xl border border-border">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs bg-secondary/20 text-secondary-light px-2 py-0.5 rounded-full">
                                        {arg.speaker}
                                    </span>
                                    <span className={`text-xxs ${arg.strength === 'fort' ? 'text-green-400' :
                                        arg.strength === 'moyen' ? 'text-yellow-400' : 'text-text-tertiary'
                                        }`}>
                                        {arg.strength}
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary">{arg.argument}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Agreements */}
            {data.agreements && data.agreements.length > 0 && (
                <Section icon={ThumbsUp} title="Points d'Accord" emoji="✅">
                    <ul className="space-y-2">
                        {data.agreements.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <ThumbsUp size={14} className="text-green-400 mt-0.5" />
                                <span className="text-sm text-text-secondary">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* Disagreements */}
            {data.disagreements && data.disagreements.length > 0 && (
                <Section icon={ThumbsDown} title="Points de Friction" emoji="⚠️">
                    <ul className="space-y-2">
                        {data.disagreements.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <ThumbsDown size={14} className="text-red-400 mt-0.5" />
                                <span className="text-sm text-text-secondary">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* Questions */}
            {data.questions && data.questions.length > 0 && (
                <Section icon={HelpCircle} title="Questions Posées" emoji="❓">
                    <div className="space-y-2">
                        {data.questions.map((q, i) => (
                            <div key={i} className="p-3 bg-surface rounded-xl border border-border">
                                <p className="text-sm text-text-secondary font-medium">{q.question}</p>
                                {q.answered && q.answer && (
                                    <p className="text-xs text-text-tertiary mt-1">→ {q.answer}</p>
                                )}
                                {!q.answered && (
                                    <span className="text-xs text-yellow-400 mt-1 inline-block">Sans réponse</span>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Insights */}
            {data.insights && data.insights.length > 0 && (
                <Section icon={Lightbulb} title="Observations" emoji="💡">
                    <ul className="space-y-2">
                        {data.insights.map((insight, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <Lightbulb size={14} className="text-yellow-400 mt-0.5" />
                                <span className="text-sm text-text-secondary">{insight}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}
        </motion.div>
    );
};

const Section = ({ title, emoji, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{emoji}</span>
            <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        </div>
        {children}
    </div>
);

export default ConversationAnalysisView;
