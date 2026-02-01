import React from 'react';
import { Users, Target, CheckCircle, ListTodo, TrendingUp, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const MeetingAnalysisView = ({ data }) => {
    if (!data) return null;

    const moodColors = {
        positif: 'text-green-400 bg-green-500/10',
        neutre: 'text-white/60 bg-white/5',
        tendu: 'text-red-400 bg-red-500/10'
    };

    const importanceColors = {
        high: 'bg-red-500/20 text-red-300',
        medium: 'bg-yellow-500/20 text-yellow-300',
        low: 'bg-white/10 text-white/50'
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header Summary */}
            <div className="glass-panel p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${moodColors[data.overallMood] || moodColors.neutre}`}>
                        {data.overallMood === 'positif' ? '😊' : data.overallMood === 'tendu' ? '😰' : '😐'} {data.overallMood}
                    </span>
                    {data.duration && (
                        <span className="text-xs text-white/40">⏱️ {data.duration}</span>
                    )}
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                    {data.summary}
                </p>
            </div>

            {/* Participants */}
            {data.participants && data.participants.length > 0 && (
                <Section icon={Users} title="Participants" emoji="👥">
                    <div className="space-y-3">
                        {data.participants.map((p, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-medium">
                                    {p.id}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white/80">{p.label}</span>
                                        <span className="text-xs text-white/40">{p.speakingPercent}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${p.speakingPercent}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            className="h-full bg-primary rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Topics */}
            {data.topics && data.topics.length > 0 && (
                <Section icon={Target} title="Sujets Abordés" emoji="🎯">
                    <div className="space-y-2">
                        {data.topics.map((topic, i) => (
                            <div key={i} className="p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-medium text-white/90">{topic.title}</h4>
                                    <span className={`text-xxs px-2 py-0.5 rounded-full ${importanceColors[topic.importance] || importanceColors.medium}`}>
                                        {topic.importance}
                                    </span>
                                </div>
                                <p className="text-xs text-white/50 mt-1">{topic.summary}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Decisions */}
            {data.decisions && data.decisions.length > 0 && (
                <Section icon={CheckCircle} title="Décisions Prises" emoji="✅">
                    <ul className="space-y-2">
                        {data.decisions.map((decision, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-white/80">{decision.text}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {/* Action Items */}
            {data.actionItems && data.actionItems.length > 0 && (
                <Section icon={ListTodo} title="Actions à Suivre" emoji="📌">
                    <div className="space-y-2">
                        {data.actionItems.map((action, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${action.priority === 'high' ? 'bg-red-400' :
                                        action.priority === 'medium' ? 'bg-yellow-400' : 'bg-white/30'
                                    }`} />
                                <div className="flex-1">
                                    <p className="text-sm text-white/80">{action.task}</p>
                                    {action.assignee && (
                                        <span className="text-xs text-primary-light mt-1 inline-block">
                                            → {action.assignee}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </motion.div>
    );
};

const Section = ({ icon: Icon, title, emoji, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{emoji}</span>
            <h3 className="text-sm font-medium text-white/70">{title}</h3>
        </div>
        {children}
    </div>
);

export default MeetingAnalysisView;
