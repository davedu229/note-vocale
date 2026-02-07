import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalysisSelector from '../components/analysis/AnalysisSelector';
import MeetingAnalysisView from '../components/analysis/MeetingAnalysisView';
import ConversationAnalysisView from '../components/analysis/ConversationAnalysisView';
import AdvancedSummaryView from '../components/analysis/AdvancedSummaryView';
import BrainstormAnalysisView from '../components/analysis/BrainstormAnalysisView';
import { analyzeMeeting, analyzeConversation, analyzeBrainstorm } from '../services/analysisService';

const AnalysisPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes } = useNotes();
    const note = notes.find(n => n.id === id);

    const [selectedType, setSelectedType] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!note) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <p className="text-lg text-text-secondary mb-4">Note introuvable</p>
                <button
                    onClick={() => navigate('/notes')}
                    className="text-primary-light hover:underline"
                >
                    Retour aux notes
                </button>
            </div>
        );
    }

    const handleSelectType = async (type) => {
        setSelectedType(type);
        setError(null);

        // For advanced summary, we don't pre-analyze, the component handles it
        if (type === 'summary') {
            setAnalysisResult(null);
            return;
        }

        setIsLoading(true);

        const transcript = note.text || note.summary || '';
        let result;

        if (type === 'meeting') {
            result = await analyzeMeeting(transcript);
        } else if (type === 'conversation') {
            result = await analyzeConversation(transcript);
        } else if (type === 'brainstorm') {
            result = await analyzeBrainstorm(transcript);
        }

        if (result?.success) {
            setAnalysisResult(result.data);
        } else {
            setError(result?.error || 'Erreur lors de l\'analyse');
        }

        setIsLoading(false);
    };

    const handleReset = () => {
        setSelectedType(null);
        setAnalysisResult(null);
        setError(null);
    };

    const getTitle = () => {
        switch (selectedType) {
            case 'meeting': return '📋 Analyse de Réunion';
            case 'conversation': return '💬 Analyse de Conversation';
            case 'brainstorm': return '🧠 Brainstorm & Réflexion';
            case 'summary': return '📝 Résumé Avancé';
            default: return '🔍 Analyser';
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <button
                    onClick={() => selectedType ? handleReset() : navigate(`/notes/${id}`)}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm">{selectedType ? 'Changer' : 'Retour'}</span>
                </button>

                {selectedType && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                    >
                        <RotateCcw size={14} />
                        Changer d'analyse
                    </button>
                )}
            </div>

            {/* Title */}
            <div className="py-4">
                <h1 className="text-xl font-semibold text-text-primary">{getTitle()}</h1>
                <p className="text-xs text-text-tertiary mt-1">{note.date}</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                <AnimatePresence mode="wait">
                    {!selectedType ? (
                        <motion.div
                            key="selector"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <AnalysisSelector onSelect={handleSelectType} />
                        </motion.div>
                    ) : isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-[300px] gap-4"
                        >
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            </div>
                            <div className="text-center">
                                <p className="text-text-primary font-medium">Analyse en cours...</p>
                                <p className="text-sm text-text-tertiary mt-1">Extraction des informations</p>
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-[300px] gap-4 text-center"
                        >
                            <span className="text-4xl">⚠️</span>
                            <div>
                                <p className="text-text-primary font-medium">Erreur d'analyse</p>
                                <p className="text-sm text-text-tertiary mt-1">{error}</p>
                            </div>
                            <button
                                onClick={() => handleSelectType(selectedType)}
                                className="px-4 py-2 bg-primary/20 text-primary-light rounded-xl text-sm hover:bg-primary/30 transition-colors"
                            >
                                Réessayer
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {selectedType === 'meeting' && <MeetingAnalysisView data={analysisResult} />}
                            {selectedType === 'conversation' && <ConversationAnalysisView data={analysisResult} />}
                            {selectedType === 'brainstorm' && <BrainstormAnalysisView data={analysisResult} />}
                            {selectedType === 'summary' && <AdvancedSummaryView transcript={note.text || note.summary} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnalysisPage;
