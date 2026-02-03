import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { Trash2, CheckCircle, Circle, Mic, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

const NotesListPage = () => {
    const { notes, deleteNote, toggleSelectNote } = useNotes();
    const navigate = useNavigate();
    const selectedCount = notes.filter(n => n.selected).length;

    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-20">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5">
                    <Mic size={28} className="text-white/20" strokeWidth={1.5} />
                </div>
                <p className="text-lg font-medium text-white/60 mb-2">Aucune note</p>
                <p className="text-sm text-white/30 font-light max-w-[200px]">
                    Commencez par enregistrer votre première note vocale
                </p>
                <Link
                    to="/"
                    className="mt-6 px-5 py-2.5 bg-primary/10 text-primary-light text-sm font-medium rounded-xl hover:bg-primary/20 transition-colors"
                >
                    Enregistrer
                </Link>
            </div>
        );
    }

    // Truncate markdown for preview (first ~150 chars, remove markdown syntax for preview)
    const getPreviewText = (text) => {
        if (!text) return '';
        // Remove markdown formatting for clean preview
        const cleanText = text
            .replace(/#{1,6}\s/g, '') // headers
            .replace(/\*\*/g, '') // bold
            .replace(/\*/g, '') // italic
            .replace(/[-•]\s/g, '') // bullets
            .replace(/>\s/g, '') // blockquotes
            .trim();
        return cleanText.slice(0, 120) + (cleanText.length > 120 ? '...' : '');
    };

    return (
        <div className="flex flex-col gap-3 h-full max-w-4xl mx-auto w-full">
            {/* Selection Summary */}
            <div className="flex items-center justify-between py-2 px-1">
                <span className="text-xs text-white/40">
                    {notes.length} note{notes.length > 1 ? 's' : ''}
                </span>
                <span className="text-xs text-primary-light font-medium">
                    {selectedCount} sélectionnée{selectedCount > 1 ? 's' : ''} pour le chat
                </span>
            </div>

            <AnimatePresence>
                {notes.map((note, index) => (
                    <motion.div
                        key={note.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
              relative overflow-hidden rounded-2xl border transition-all duration-300 card-interactive
              ${note.selected
                                ? 'bg-primary/5 border-primary/30'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10'}
            `}
                    >
                        {/* Selection Indicator Bar */}
                        <div className={`
              absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300
              ${note.selected ? 'bg-primary' : 'bg-transparent'}
            `} />

                        {/* Clickable Content Area */}
                        <div
                            onClick={() => navigate(`/notes/${note.id}`)}
                            className="p-4 pl-5 pr-12 cursor-pointer"
                        >
                            {/* Header with Title */}
                            <div className="flex flex-col gap-1 mb-2">
                                <h3 className="text-sm font-medium text-white/90 line-clamp-1">
                                    {note.title || 'Note sans titre'}
                                </h3>
                                <span className="text-xxs font-medium text-white/40 uppercase tracking-wider">
                                    {note.date}
                                </span>
                            </div>

                            {/* Tags */}
                            {note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {note.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 bg-primary/10 text-primary-light text-xxs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Content Preview */}
                            <div className="text-sm text-white/50 font-light leading-relaxed line-clamp-2">
                                {getPreviewText(note.summary || note.text)}
                            </div>

                            {/* Tap to open hint */}
                            <div className="mt-3 flex items-center gap-1 text-xxs text-white/30">
                                <span>Ouvrir</span>
                                <ChevronRight size={12} />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelectNote(note.id);
                                }}
                                className={`
                  p-1.5 rounded-lg transition-all duration-200
                  ${note.selected
                                        ? 'text-primary-light bg-primary/10'
                                        : 'text-white/25 hover:text-white/50 hover:bg-white/5'}
                `}
                            >
                                {note.selected
                                    ? <CheckCircle size={16} strokeWidth={2} />
                                    : <Circle size={16} strokeWidth={1.5} />
                                }
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNote(note.id);
                                }}
                                className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                            >
                                <Trash2 size={14} strokeWidth={1.5} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="h-20" />
        </div>
    );
};

export default NotesListPage;
