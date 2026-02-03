import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { chatWithAi } from '../services/ai';
import { ArrowLeft, Send, Bot, User, FileText, MessageSquare, Copy, Check, Trash2, BarChart3, RotateCcw, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MarkdownRenderer from '../components/MarkdownRenderer';
import MagicActionsMenu from '../components/MagicActionsMenu';

const NoteDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes, deleteNote, updateNoteChatHistory, getNoteChatHistory } = useNotes();
    const note = notes.find(n => n.id === id);

    const [activeTab, setActiveTab] = useState('summary');
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showMagicMenu, setShowMagicMenu] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Default welcome message for each note's chat
    const getDefaultMessage = useCallback(() => ({
        role: 'ai',
        content: '👋 Je suis prêt à explorer cette note avec vous ! Posez-moi des questions sur le contenu.'
    }), []);

    // Initialize messages state
    const [messages, setMessages] = useState([getDefaultMessage()]);

    // Load chat history when note ID changes (CRUCIAL for isolation)
    useEffect(() => {
        if (id && note) {
            const savedHistory = getNoteChatHistory(id);
            if (savedHistory && savedHistory.length > 0) {
                setMessages(savedHistory);
            } else {
                setMessages([getDefaultMessage()]);
            }
        }
    }, [id, note, getNoteChatHistory, getDefaultMessage]);

    // Save messages to context when they change
    const saveMessages = useCallback((msgs) => {
        if (note && msgs.length > 1) { // Only save if there's actual conversation
            updateNoteChatHistory(id, msgs);
        }
    }, [id, note, updateNoteChatHistory]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!note) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <p className="text-lg text-white/60 mb-4">Note introuvable</p>
                <Link to="/notes" className="text-primary-light hover:underline">
                    Retour aux notes
                </Link>
            </div>
        );
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = () => {
        if (window.confirm('Supprimer cette note ?')) {
            deleteNote(note.id);
            navigate('/notes');
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const responseText = await chatWithAi(userMsg.content, [note]);
        const finalMessages = [...newMessages, { role: 'ai', content: responseText }];
        setMessages(finalMessages);
        saveMessages(finalMessages);

        setIsLoading(false);
        inputRef.current?.focus();
    };

    const handleClearChat = () => {
        const freshMessages = [getDefaultMessage()];
        setMessages(freshMessages);
        updateNoteChatHistory(id, []);
    };

    const quickQuestions = [
        "📝 Résume en une phrase",
        "🎯 Points importants ?",
        "✅ Actions à faire ?",
    ];

    const handleQuickQuestion = (q) => {
        setInput(q);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const hasChatHistory = messages.length > 1;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] h-[calc(100dvh-140px)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <button
                    onClick={() => navigate('/notes')}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors active:scale-95"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm">Retour</span>
                </button>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowMagicMenu(true)}
                        className="p-2 rounded-lg text-accent bg-accent/10 hover:bg-accent/20 transition-all active:scale-95"
                        title="Magic Actions"
                    >
                        <Wand2 size={16} />
                    </button>
                    <button
                        onClick={() => navigate(`/notes/${id}/analyze`)}
                        className="p-2 rounded-lg text-primary-light bg-primary/10 hover:bg-primary/20 transition-all active:scale-95"
                        title="Analyser"
                    >
                        <BarChart3 size={16} />
                    </button>
                    <button
                        onClick={() => handleCopy(note.text || note.summary)}
                        className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all active:scale-95"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Date */}
            <div className="py-3">
                <span className="text-xs text-white/40 uppercase tracking-wider">{note.date}</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl mb-4">
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all active:scale-95 ${activeTab === 'summary' ? 'bg-primary/20 text-primary-light' : 'text-white/40 hover:text-white/60'}`}
                >
                    <FileText size={14} />
                    Résumé
                </button>
                <button
                    onClick={() => setActiveTab('transcript')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all active:scale-95 ${activeTab === 'transcript' ? 'bg-primary/20 text-primary-light' : 'text-white/40 hover:text-white/60'}`}
                >
                    <FileText size={14} />
                    Brut
                </button>
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all active:scale-95 relative ${activeTab === 'chat' ? 'bg-primary/20 text-primary-light' : 'text-white/40 hover:text-white/60'}`}
                >
                    <MessageSquare size={14} />
                    Explorer
                    {/* Chat history indicator */}
                    {hasChatHistory && activeTab !== 'chat' && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeTab === 'summary' && (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="h-full overflow-y-auto scrollbar-hide pr-1"
                        >
                            <MarkdownRenderer content={note.summary || "Aucun résumé disponible."} />
                        </motion.div>
                    )}

                    {activeTab === 'transcript' && (
                        <motion.div
                            key="transcript"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="h-full overflow-y-auto scrollbar-hide"
                        >
                            <div className="glass-panel p-4 rounded-xl">
                                <p className="text-white/70 font-light leading-relaxed text-sm whitespace-pre-wrap">
                                    {note.text || "Aucune transcription disponible."}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'chat' && (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="h-full flex flex-col"
                        >
                            {/* Chat Header with Clear History */}
                            {hasChatHistory && (
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                                    <span className="text-xs text-white/40">
                                        {messages.length - 1} message{messages.length > 2 ? 's' : ''}
                                    </span>
                                    <button
                                        onClick={handleClearChat}
                                        className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        <RotateCcw size={12} />
                                        Effacer
                                    </button>
                                </div>
                            )}

                            {/* Quick Questions */}
                            {!hasChatHistory && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {quickQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleQuickQuestion(q)}
                                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-secondary/15 text-secondary-light' : 'bg-primary/15 text-primary-light'}`}>
                                            {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                        </div>
                                        <div className={`py-2.5 px-3.5 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-secondary/10 border border-secondary/20 text-white rounded-tr-sm' : 'bg-white/[0.03] border border-white/5 rounded-tl-sm'}`}>
                                            {msg.role === 'ai' ? (
                                                <MarkdownRenderer content={msg.content} className="text-sm" />
                                            ) : (
                                                <div className="whitespace-pre-wrap font-light">{msg.content}</div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {isLoading && (
                                    <div className="flex gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                                            <Bot size={12} className="text-primary-light" />
                                        </div>
                                        <div className="bg-white/[0.03] border border-white/5 py-2.5 px-3.5 rounded-2xl rounded-tl-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-primary-light rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                <span className="w-1.5 h-1.5 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} className="pt-3 mt-auto">
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Posez une question..."
                                        className="flex-1 bg-surface-elevated border border-white/5 rounded-xl py-3 px-4 text-sm text-white font-light placeholder-white/30 focus:outline-none focus:border-primary/40 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading || !input.trim()}
                                        className={`p-3 rounded-xl transition-all active:scale-95 ${input.trim() && !isLoading ? 'bg-primary text-white' : 'bg-white/5 text-white/30'}`}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Magic Actions Menu */}
            <AnimatePresence>
                {showMagicMenu && (
                    <MagicActionsMenu
                        content={note.summary || note.text}
                        onClose={() => setShowMagicMenu(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default NoteDetailPage;
