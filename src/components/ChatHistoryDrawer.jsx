import React from 'react';
import { Clock, Trash2, MessageSquare, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatHistoryDrawer = ({
    isOpen,
    onClose,
    history,
    currentSessionId,
    onSelectSession,
    onDeleteSession,
    onNewChat
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Hier";
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-surface-elevated z-50 flex flex-col"
                        style={{ paddingTop: 'env(safe-area-inset-top)' }}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-text-primary">Historique</h2>
                                <button
                                    onClick={onClose}
                                    className="text-text-tertiary hover:text-text-primary text-sm"
                                >
                                    Fermer
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    onNewChat();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary/20 text-primary rounded-xl text-sm font-medium hover:bg-primary/30 transition-colors"
                            >
                                <Plus size={16} />
                                Nouvelle conversation
                            </button>
                        </div>

                        {/* History List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
                            {history.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare size={32} className="mx-auto text-text-tertiary mb-2" />
                                    <p className="text-sm text-text-tertiary">Aucun historique</p>
                                </div>
                            ) : (
                                history.map((session) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`
                      group relative p-3 rounded-xl cursor-pointer transition-all
                      ${session.id === currentSessionId
                                                ? 'bg-primary/15 border border-primary/30'
                                                : 'hover:bg-surface border border-transparent'}
                    `}
                                        onClick={() => {
                                            onSelectSession(session.id);
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                                                <MessageSquare size={14} className="text-text-secondary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-text-primary font-medium truncate">
                                                    {session.title}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock size={10} className="text-text-tertiary" />
                                                    <span className="text-xs text-text-tertiary">
                                                        {formatDate(session.updatedAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteSession(session.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className="p-3 border-t border-border">
                            <p className="text-xs text-text-tertiary text-center">
                                {history.length} conversation{history.length > 1 ? 's' : ''} sauvegardée{history.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatHistoryDrawer;
