import React, { createContext, useState, useEffect, useContext } from 'react';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
    // Notes storage
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('voice_notes_db');
        return saved ? JSON.parse(saved) : [];
    });

    // Global chat history (main chatbot)
    const [globalChatHistory, setGlobalChatHistory] = useState(() => {
        const saved = localStorage.getItem('voice_notes_chat_history');
        return saved ? JSON.parse(saved) : [];
    });

    // Current global chat session
    const [currentChatSession, setCurrentChatSession] = useState(() => {
        const saved = localStorage.getItem('voice_notes_current_chat');
        return saved ? JSON.parse(saved) : null;
    });

    // Save notes
    useEffect(() => {
        localStorage.setItem('voice_notes_db', JSON.stringify(notes));
    }, [notes]);

    // Save global chat history
    useEffect(() => {
        localStorage.setItem('voice_notes_chat_history', JSON.stringify(globalChatHistory));
    }, [globalChatHistory]);

    // Save current chat session
    useEffect(() => {
        if (currentChatSession) {
            localStorage.setItem('voice_notes_current_chat', JSON.stringify(currentChatSession));
        }
    }, [currentChatSession]);

    // Notes functions
    const addNote = (newNote) => {
        const noteWithChat = { ...newNote, chatHistory: [] };
        setNotes(prev => [noteWithChat, ...prev]);
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
    };

    const toggleSelectNote = (id) => {
        setNotes(prev => prev.map(n =>
            n.id === id ? { ...n, selected: !n.selected } : n
        ));
    };

    // Note-specific chat functions
    const updateNoteChatHistory = (noteId, messages) => {
        setNotes(prev => prev.map(n =>
            n.id === noteId ? { ...n, chatHistory: messages } : n
        ));
    };

    const getNoteChatHistory = (noteId) => {
        const note = notes.find(n => n.id === noteId);
        return note?.chatHistory || [];
    };

    // Global chat functions
    const createNewChatSession = () => {
        const session = {
            id: Date.now().toString(),
            title: 'Nouvelle conversation',
            messages: [{
                role: 'ai',
                content: '👋 **Bonjour !** Je suis votre assistant contextuel.\n\nSélectionnez des notes pour enrichir nos conversations.'
            }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setCurrentChatSession(session);
        return session;
    };

    const updateCurrentChatSession = (messages, title = null) => {
        if (!currentChatSession) return;

        const updated = {
            ...currentChatSession,
            messages,
            updatedAt: new Date().toISOString(),
            ...(title && { title })
        };
        setCurrentChatSession(updated);
    };

    const saveChatSessionToHistory = () => {
        if (!currentChatSession || currentChatSession.messages.length <= 1) return;

        // Auto-generate title from first user message
        const firstUserMsg = currentChatSession.messages.find(m => m.role === 'user');
        const title = firstUserMsg
            ? firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '')
            : 'Conversation';

        const sessionToSave = { ...currentChatSession, title };

        setGlobalChatHistory(prev => {
            // Remove if already exists (update)
            const filtered = prev.filter(s => s.id !== sessionToSave.id);
            return [sessionToSave, ...filtered].slice(0, 50); // Keep last 50
        });
    };

    const loadChatSession = (sessionId) => {
        const session = globalChatHistory.find(s => s.id === sessionId);
        if (session) {
            setCurrentChatSession(session);
        }
    };

    const deleteChatSession = (sessionId) => {
        setGlobalChatHistory(prev => prev.filter(s => s.id !== sessionId));
        if (currentChatSession?.id === sessionId) {
            setCurrentChatSession(null);
        }
    };

    return (
        <NotesContext.Provider value={{
            // Notes
            notes,
            addNote,
            deleteNote,
            toggleSelectNote,

            // Note-specific chat
            updateNoteChatHistory,
            getNoteChatHistory,

            // Global chat
            globalChatHistory,
            currentChatSession,
            createNewChatSession,
            updateCurrentChatSession,
            saveChatSessionToHistory,
            loadChatSession,
            deleteChatSession
        }}>
            {children}
        </NotesContext.Provider>
    );
};
