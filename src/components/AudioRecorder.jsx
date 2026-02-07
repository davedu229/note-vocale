import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Mic, Square, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioRecorder = ({ onTranscriptUpdate, onRecordingStop, isProcessing }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);

    const recognitionRef = useRef(null);
    const timerRef = useRef(null);
    const isPausedRef = useRef(false); // Track pause state for closure
    const isRecordingRef = useRef(false); // Track recording state for closure

    // Pre-generate values for audio bars
    const audioBarValues = useMemo(() =>
        [...Array(5)].map((_, i) => ({
            height: 20 + (i * 4),
            duration: 0.4 + (i * 0.08),
            delay: i * 0.1
        })), []);

    // Initialize speech recognition once
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'fr-FR';

            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                onTranscriptUpdate(finalTranscript, interimTranscript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error !== 'aborted') {
                    setIsRecording(false);
                    setIsPaused(false);
                    isRecordingRef.current = false;
                    isPausedRef.current = false;
                    clearInterval(timerRef.current);
                }
            };

            recognition.onend = () => {
                // Auto-restart only if we're recording and NOT paused
                if (isRecordingRef.current && !isPausedRef.current) {
                    setTimeout(() => {
                        try {
                            recognition.start();
                        } catch (err) {
                            console.log('Recognition restart skipped');
                        }
                    }, 100);
                }
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (err) {
                    // Ignore
                }
            }
            clearInterval(timerRef.current);
        };
    }, [onTranscriptUpdate]);

    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        clearInterval(timerRef.current);
    }, []);

    const startRecording = useCallback(() => {
        setDuration(0);
        setIsPaused(false);
        setIsRecording(true);
        isPausedRef.current = false;
        isRecordingRef.current = true;

        try {
            recognitionRef.current?.start();
        } catch (err) {
            console.error('Failed to start recognition:', err);
        }

        startTimer();
    }, [startTimer]);

    const pauseRecording = useCallback(() => {
        console.log('Pause triggered, current state:', isPaused);
        isPausedRef.current = true;
        setIsPaused(true);
        stopTimer();

        // Delay stopping recognition to avoid race conditions
        setTimeout(() => {
            try {
                recognitionRef.current?.stop();
            } catch (err) {
                console.log('Recognition stop skipped');
            }
        }, 50);
    }, [stopTimer, isPaused]);

    const resumeRecording = useCallback(() => {
        console.log('Resume triggered, current state:', isPaused);
        isPausedRef.current = false;
        setIsPaused(false);
        startTimer();

        // Slightly longer delay before restarting recognition
        setTimeout(() => {
            try {
                recognitionRef.current?.start();
            } catch (err) {
                console.error('Failed to resume recognition:', err);
            }
        }, 200);
    }, [startTimer, isPaused]);

    const stopRecording = useCallback(() => {
        isRecordingRef.current = false;
        isPausedRef.current = false;
        setIsRecording(false);
        setIsPaused(false);
        stopTimer();

        try {
            recognitionRef.current?.stop();
        } catch (err) {
            // Ignore
        }

        onRecordingStop();
    }, [stopTimer, onRecordingStop]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Recording Timer */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3"
                    >
                        <span className={`w-2.5 h-2.5 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
                        <span className="text-xl font-mono text-text-primary tracking-widest">
                            {formatTime(duration)}
                        </span>
                        {isPaused && (
                            <span className="text-xs text-yellow-400 uppercase tracking-wider font-medium bg-yellow-500/20 px-2 py-0.5 rounded">
                                Pause
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button Container */}
            <div className="relative">
                {/* Idle Pulse Ring - when NOT recording */}
                <AnimatePresence>
                    {!isRecording && !isProcessing && (
                        <>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-[-12px] rounded-full border-2 border-primary/40"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0, 0.2] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                                className="absolute inset-[-24px] rounded-full border border-primary/20"
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Outer Glow Rings - when recording */}
                <AnimatePresence>
                    {isRecording && !isPaused && (
                        <>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-[-20px] rounded-full border border-red-500/30"
                            />
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute inset-[-40px] rounded-full border border-red-500/20"
                            />
                        </>
                    )}
                </AnimatePresence>

                {/* Main Record/Stop Button */}
                <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isProcessing}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className={`
            relative z-10 w-24 h-24 rounded-full flex items-center justify-center
            transition-all duration-300 ease-out
            ${isRecording
                            ? 'bg-red-500 shadow-md shadow-red-500/20'
                            : 'bg-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                >
                    <AnimatePresence mode="wait">
                        {isRecording ? (
                            <motion.div
                                key="stop"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Square className="w-8 h-8 text-white fill-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="mic"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Mic className="w-9 h-9 text-white" strokeWidth={1.5} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Pause/Resume Button */}
            <AnimatePresence>
                {isRecording && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isPaused) {
                                resumeRecording();
                            } else {
                                pauseRecording();
                            }
                        }}
                        type="button"
                        className={`
              flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm
              transition-all duration-200 cursor-pointer select-none
              ${isPaused
                                ? 'bg-green-500/20 text-green-400 border-2 border-green-500/40 hover:bg-green-500/30 active:bg-green-500/40'
                                : 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/40 hover:bg-yellow-500/30 active:bg-yellow-500/40'}
            `}
                    >
                        {isPaused ? (
                            <>
                                <Play size={18} className="fill-current" />
                                <span>Reprendre</span>
                            </>
                        ) : (
                            <>
                                <Pause size={18} />
                                <span>Pause</span>
                            </>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Status Text */}
            <p className="text-sm text-text-tertiary font-light tracking-wide text-center">
                {isPaused
                    ? 'Enregistrement en pause'
                    : isRecording
                        ? 'Touchez le carré pour terminer'
                        : 'Touchez pour enregistrer'}
            </p>

            {/* Visual Feedback Bars */}
            <AnimatePresence>
                {isRecording && !isPaused && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-end gap-1 h-8"
                    >
                        {audioBarValues.map((bar, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [8, bar.height, 8],
                                }}
                                transition={{
                                    duration: bar.duration,
                                    repeat: Infinity,
                                    delay: bar.delay,
                                }}
                                className="w-1.5 bg-gradient-to-t from-red-500/50 to-red-400 rounded-full"
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AudioRecorder;
