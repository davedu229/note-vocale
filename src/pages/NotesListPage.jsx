import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { Trash2, CheckCircle, Circle, Mic, ChevronRight, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';

const NotesListPage = () => {
    const { notes, deleteNote, toggleSelectNote } = useNotes();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter notes based on search query
    const filteredNotes = notes.filter(note => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            (note.title && note.title.toLowerCase().includes(query)) ||
            (note.summary && note.summary.toLowerCase().includes(query)) ||
            (note.text && note.text.toLowerCase().includes(query)) ||
            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
        );
    });

    const selectedCount = notes.filter(n => n.selected).length;

    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-16 px-6">
                {/* Animated Icon Container */}
                <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Mic size={32} className="text-primary" strokeWidth={1.5} />
                    </div>
                    {/* Subtle pulse rings */}
                    <div className="absolute inset-[-8px] rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '3s' }} />
                </div>

                <h2 className="text-xl font-semibold text-text-primary mb-2">
                    Aucune note pour l'instant
                </h2>
                <p className="text-sm text-text-secondary font-light max-w-[260px] mb-8 leading-relaxed">
                    Enregistrez votre première note vocale et laissez l'IA la transformer en texte structuré
                </p>

                <Link
                    to="/"
                    className="group flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                    <Mic size={16} />
                    <span>Créer ma première note</span>
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
            {/* Search Bar */}
            <div className="relative mb-2">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par titre, contenu ou tag..."
                    className="w-full bg-surface-elevated border border-border rounded-xl py-3 pl-11 pr-10 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary/40 transition-colors shadow-sm"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Selection Summary */}
            <div className="flex items-center justify-between py-2 px-1">
                <span className="text-xs text-text-tertiary">
                    {filteredNotes.length} note{filteredNotes.length > 1 ? 's' : ''}{searchQuery && ` trouvée${filteredNotes.length > 1 ? 's' : ''}`}
                </span>
                <span className="text-xs text-primary dark:text-primary-light font-medium">
                    {selectedCount} sélectionnée{selectedCount > 1 ? 's' : ''} pour le chat
                </span>
            </div>


            <AnimatePresence mode="popLayout">
                {filteredNotes.map((note, index) => (
                    <motion.div
                        key={note.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative mb-3 group"
                    >
                        {/* Swipe Action Background - Trash Icon */}
                        <div className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-end pr-6">
                            <Trash2 className="text-red-400" size={20} />
                        </div>

                        {/* Draggable Card */}
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: -100, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={(e, { offset }) => {
                                if (offset.x < -80) {
                                    deleteNote(note.id);
                                }
                            }}
                            className={`
                              relative bg-surface border overflow-hidden rounded-2xl transition-colors duration-200
                              ${note.selected
                                    ? 'bg-primary/5 border-primary/30'
                                    : 'bg-surface-elevated border-border hover:border-border-hover'}
                            `}
                            style={{ x: 0 }} // Reset position on re-render if needed
                            whileDrag={{ scale: 0.98 }}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${note.selected ? 'bg-primary' : 'bg-transparent'}`} />
                            <div
                                onClick={() => navigate(`/notes/${note.id}`)}
                                className="p-4 pl-5 pr-12 cursor-pointer"
                            >
                                <div className="flex flex-col gap-1 mb-2">
                                    <h3 className="text-sm font-medium text-text-primary line-clamp-1">
                                        {note.title || 'Note sans titre'}
                                    </h3>
                                    <span className="text-xxs font-medium text-text-tertiary uppercase tracking-wider">
                                        {note.date}
                                    </span>
                                </div>
                                {note.tags && note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {note.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-0.5 bg-primary/10 text-primary text-xxs rounded-md font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="text-sm text-text-secondary font-light leading-relaxed line-clamp-2">
                                    {getPreviewText(note.summary || note.text)}
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-xxs text-text-tertiary group-hover:text-primary transition-colors">
                                    <span>Ouvrir</span>
                                    <ChevronRight size={12} />
                                </div>
                            </div>
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelectNote(note.id);
                                    }}
                                    className={`
                                      p-1.5 rounded-lg transition-all duration-200
                                      ${note.selected
                                            ? 'text-primary dark:text-primary-light bg-primary/10'
                                            : 'text-text-tertiary hover:text-text-primary hover:bg-surface-elevated'}
                                    `}
                                >
                                    {note.selected
                                        ? <CheckCircle size={16} strokeWidth={2} />
                                        : <Circle size={16} strokeWidth={1.5} />}
                                </button>
                                {/* Desktop Delete Button (kept for non-touch/mouse users) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNote(note.id);
                                    }}
                                    className="md:block hidden p-1.5 rounded-lg text-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                                >
                                    <Trash2 size={14} strokeWidth={1.5} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="h-20" />
        </div>
    );
};

export default NotesListPage;
