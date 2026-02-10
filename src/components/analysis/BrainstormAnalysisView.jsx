import React from 'react';
import { Lightbulb, Brain, Sparkles, Target, Layers, GitBranch, MessageCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const BrainstormAnalysisView = ({ data }) => {
    if (!data) return null;

    const categoryColors = {
        idee: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        probleme: 'bg-red-500/20 text-red-300 border-red-500/30',
        solution: 'bg-green-500/20 text-green-300 border-green-500/30',
        question: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        reflexion: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header Summary */}
            <div className="glass-panel p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                    <Brain className="text-primary-light" size={20} />
                    <span className="text-sm font-medium text-text-secondary">Vue d'ensemble</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                    {data.summary}
                </p>
                {data.creativity_score !== undefined && (
                    <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-text-tertiary">Score de créativité</span>
                            <span className="text-sm text-primary-light font-medium">{data.creativity_score}/10</span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${data.creativity_score * 10}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Main Theme */}
            {data.main_theme && (
                <Section icon={Target} title="Thème Principal" emoji="🎯">
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
                        <p className="text-text-primary font-medium">{data.main_theme}</p>
                    </div>
                </Section>
            )}

            {/* Ideas - the core of brainstorming */}
            {data.ideas && data.ideas.length > 0 && (
                <Section icon={Lightbulb} title="Idées Générées" emoji="💡">
                    <div className="space-y-2">
                        {data.ideas.map((idea, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
                            >
                                <div className="flex items-start gap-2">
                                    <Sparkles size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm text-text-secondary">{idea.text}</p>
                                        {idea.potential && (
                                            <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${idea.potential === 'high' ? 'bg-green-500/20 text-green-300' :
                                                idea.potential === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-surface text-text-tertiary'
                                                }`}>
                                                Potentiel: {idea.potential}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Connections between ideas */}
            {data.connections && data.connections.length > 0 && (
                <Section icon={GitBranch} title="Connexions" emoji="🔗">
                    <div className="space-y-2">
                        {data.connections.map((conn, i) => (
                            <div key={i} className="p-3 bg-surface border border-border rounded-xl">
                                <p className="text-sm text-text-secondary">{conn}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Categories/Themes */}
            {data.categories && data.categories.length > 0 && (
                <Section icon={Layers} title="Catégories" emoji="📂">
                    <div className="flex flex-wrap gap-2">
                        {data.categories.map((cat, i) => (
                            <span
                                key={i}
                                className={`text-xs px-3 py-1.5 rounded-full border ${categoryColors[cat.type] || 'bg-surface text-text-secondary border-border'}`}
                            >
                                {cat.name} ({cat.count})
                            </span>
                        ))}
                    </div>
                </Section>
            )}

            {/* Questions raised */}
            {data.questions && data.questions.length > 0 && (
                <Section icon={MessageCircle} title="Questions Soulevées" emoji="❓">
                    <ul className="space-y-2">
                        {data.questions.map((q, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-400 mt-0.5">?</span>
                                <span className="text-sm text-text-secondary">{q}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* Key insights / Epiphanies */}
            {data.insights && data.insights.length > 0 && (
                <Section icon={Star} title="Moments Clés" emoji="✨">
                    <div className="space-y-2">
                        {data.insights.map((insight, i) => (
                            <div key={i} className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
                                <p className="text-sm text-text-secondary">{insight}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Next steps */}
            {data.next_steps && data.next_steps.length > 0 && (
                <Section icon={Target} title="Prochaines Étapes" emoji="🚀">
                    <ol className="space-y-2">
                        {data.next_steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary-light text-xs flex items-center justify-center flex-shrink-0">
                                    {i + 1}
                                </span>
                                <span className="text-sm text-text-secondary">{step}</span>
                            </li>
                        ))}
                    </ol>
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

export default BrainstormAnalysisView;
