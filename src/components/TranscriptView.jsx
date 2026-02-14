import React, { useEffect, useRef } from 'react';
import { AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TranscriptView = ({ transcript, interimTranscript }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript, interimTranscript]);

    if (!transcript && !interimTranscript) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-6"
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-surface-elevated flex items-center justify-center">
                    <AlignLeft className="w-3.5 h-3.5 text-text-tertiary" />
                </div>
                <h2 className="text-xs font-medium text-text-tertiary uppercase tracking-widest">
                    Transcription Live
                </h2>
            </div>

            <div
                ref={scrollRef}
                className="glass-panel p-5 rounded-2xl max-h-[200px] overflow-y-auto"
            >
                <p className="text-base leading-relaxed text-text-primary font-light">
                    {transcript}
                    {interimTranscript && (
                        <span className="text-text-tertiary italic">{interimTranscript}</span>
                    )}
                </p>
            </div>
        </motion.div>
    );
};

export default TranscriptView;
