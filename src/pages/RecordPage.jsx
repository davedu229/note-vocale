import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioRecorder from '../components/AudioRecorder';
import TranscriptView from '../components/TranscriptView';
import { generateSummary } from '../services/ai';
import { useNotes } from '../context/NotesContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Sparkles, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import UsageBadge from '../components/UsageBadge';

const RecordPage = ({ onUpgradeClick }) => {
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { addNote } = useNotes();
    const { canUseFeature, trackUsage, getRemainingUsage, isPremium } = useSubscription();
    const navigate = useNavigate();

    const handleTranscriptUpdate = useCallback((final, interim) => {
        if (final) {
            setTranscript(prev => prev + ' ' + final);
        }
        setInterimTranscript(interim);
    }, []);

    const handleRecordingStop = async () => {
        const fullText = (transcript + ' ' + interimTranscript).trim();
        if (fullText.length < 5) return;

        // Check if user can transcribe
        if (!canUseFeature('transcription')) {
            onUpgradeClick('transcription');
            return;
        }

        setIsProcessing(true);

        // Track usage
        trackUsage('transcription');

        const summary = await generateSummary(fullText);

        const newNote = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
            }),
            text: fullText,
            summary: summary,
            selected: true
        };

        addNote(newNote);
        setIsProcessing(false);
        navigate('/notes');
    };

    const remaining = getRemainingUsage('transcription');

    return (
        <div className="flex flex-col h-full justify-between py-2">
            {/* Usage indicator for free users */}
            {!isPremium && (
                <div className="flex justify-center mb-4">
                    <UsageBadge
                        feature="transcription"
                        onUpgradeClick={() => onUpgradeClick('transcription')}
                    />
                </div>
            )}

            {/* Premium badge for subscribers */}
            {isPremium && (
                <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                        <Crown size={12} className="text-primary-light" />
                        <span className="text-xs text-primary-light font-medium">Premium</span>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center py-8">
                {isProcessing ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        {/* Processing Animation */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-8px] rounded-full border-2 border-transparent border-t-accent/50"
                            />
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-lg font-medium text-white/90">
                                Analyse en cours
                            </p>
                            <p className="text-sm text-white/40 font-light">
                                Génération du résumé intelligent...
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <AudioRecorder
                        onTranscriptUpdate={handleTranscriptUpdate}
                        onRecordingStop={handleRecordingStop}
                        isProcessing={isProcessing}
                    />
                )}
            </div>

            <TranscriptView
                transcript={transcript}
                interimTranscript={interimTranscript}
            />

            {/* Remaining transcriptions hint */}
            {!isPremium && remaining > 0 && remaining <= 3 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-xs text-white/30 mt-4"
                >
                    {remaining} transcription{remaining > 1 ? 's' : ''} gratuite{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}
                </motion.p>
            )}
        </div>
    );
};

export default RecordPage;
