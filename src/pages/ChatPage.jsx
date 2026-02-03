import React, { useState, useRef, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { chatWithAi } from '../services/ai';
import { Send, Bot, User, FileText, History, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ChatHistoryDrawer from '../components/ChatHistoryDrawer';

const ChatPage = () => {
    const {
        notes,
        globalChatHistory,
        currentChatSession,
        createNewChatSession,
        updateCurrentChatSession,
        saveChatSessionToHistory,
        loadChatSession,
        deleteChatSession
    } = useNotes();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const selectedNotes = notes.filter(n => n.selected);
    const selectedNotesCount = selectedNotes.length;

    // Initialize session if needed
    useEffect(() => {
        if (!currentChatSession) {
            createNewChatSession();
        }
    }, [currentChatSession, createNewChatSession]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentChatSession?.messages]);

    // Save session when leaving or on significant changes
    useEffect(() => {
        return () => {
            saveChatSessionToHistory();
        };
    }, []);

    const messages = currentChatSession?.messages || [];

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        updateCurrentChatSession(newMessages);
        setInput('');
        setIsLoading(true);

        const responseText = await chatWithAi(userMsg.content, selectedNotes);
        const finalMessages = [...newMessages, { role: 'ai', content: responseText }];
        updateCurrentChatSession(finalMessages);

        // Auto-save after each exchange
        setTimeout(() => saveChatSessionToHistory(), 100);

        setIsLoading(false);
        inputRef.current?.focus();
    };

    const handleNewChat = () => {
        saveChatSessionToHistory();
        createNewChatSession();
    };

    return (
        <div className="flex flex-col h-full relative cursor-default">
            {/* Chat History Drawer */}
            <ChatHistoryDrawer
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                history={globalChatHistory}
                currentSessionId={currentChatSession?.id}
                onSelectSession={loadChatSession}
                onDeleteSession={deleteChatSession}
                onNewChat={handleNewChat}
            />

            <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col h-full">
                {/* Header Bar */}
                <div className="flex items-center justify-between px-1 py-2 mb-2">
                    <button
                        onClick={() => setShowHistory(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
                    >
                        <History size={16} />
                        <span className="text-xs font-medium">Historique</span>
                        {globalChatHistory.length > 0 && (
                            <span className="text-xxs bg-white/10 text-white/50 px-1.5 py-0.5 rounded-full">
                                {globalChatHistory.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-primary-light bg-primary/10 hover:bg-primary/20 transition-all"
                    >
                        <Plus size={14} />
                        <span className="text-xs font-medium">Nouveau</span>
                    </button>
                </div>

                {/* Context Bar */}
                <Link
                    to="/notes"
                    className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl mb-3 hover:bg-white/[0.04] transition-colors"
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText size={14} className="text-primary-light" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-white/70">Contexte actif</p>
                            <p className="text-xxs text-white/40">
                                {selectedNotesCount > 0
                                    ? `${selectedNotesCount} note${selectedNotesCount > 1 ? 's' : ''} sélectionnée${selectedNotesCount > 1 ? 's' : ''}`
                                    : 'Aucune note sélectionnée'
                                }
                            </p>
                        </div>
                    </div>
                    <span className="text-xxs text-primary-light uppercase tracking-wider font-medium">
                        Modifier →
                    </span>
                </Link>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pb-4">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className={`
                    w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                    ${msg.role === 'user'
                                        ? 'bg-secondary/15 text-secondary-light'
                                        : 'bg-primary/15 text-primary-light'}
                  `}>
                                    {msg.role === 'user'
                                        ? <User size={14} strokeWidth={2} />
                                        : <Bot size={14} strokeWidth={2} />
                                    }
                                </div>

                                {/* Bubble */}
                                <div className={`
                    py-3 px-4 rounded-2xl max-w-[85%] text-sm
                    ${msg.role === 'user'
                                        ? 'bg-secondary/10 border border-secondary/20 text-white rounded-tr-sm'
                                        : 'bg-white/[0.03] border border-white/5 rounded-tl-sm'}
                  `}>
                                    {msg.role === 'ai' ? (
                                        <MarkdownRenderer content={msg.content} />
                                    ) : (
                                        <div className="whitespace-pre-wrap font-light">{msg.content}</div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                                <Bot size={14} className="text-primary-light" />
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 py-3 px-4 rounded-2xl rounded-tl-sm">
                                <div className="flex items-center gap-1.5">
                                    {[0, 1, 2].map(i => (
                                        <motion.span
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                            className="w-1.5 h-1.5 bg-primary-light rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="pt-3 pb-2">
                    <div className="relative flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                selectedNotesCount > 0
                                    ? "Posez une question..."
                                    : "Sélectionnez des notes pour commencer..."
                            }
                            className="
                  flex-1 bg-surface-elevated border border-white/5 rounded-2xl 
                  py-3.5 px-5 text-sm text-white font-light
                  placeholder-white/30 
                  focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20
                  transition-all duration-200
                "
                        />
                        <motion.button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            whileTap={{ scale: 0.95 }}
                            className={`
                  p-3.5 rounded-2xl transition-all duration-200
                  ${input.trim() && !isLoading
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'bg-white/5 text-white/30'}
                `}
                        >
                            <Send size={18} />
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
