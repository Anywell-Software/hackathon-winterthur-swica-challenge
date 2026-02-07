// ============================================
// Floating Mascot Helper - Mini Version
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FloatingMascotProps {
    message: string;
    mood?: 'happy' | 'thumbup' | 'thinking';
    autoShow?: boolean;
    autoHideDelay?: number;
}

const MINI_MASCOT_IMAGES = {
    happy: '/welldone.png',
    thumbup: '/thumbup.png',
    thinking: '/whattodo.png',
};

/**
 * A small floating mascot that appears in the bottom right corner
 * Perfect for quick tips, reminders, or encouragement without taking up much space
 */
export function FloatingMascot({
    message,
    mood = 'thumbup',
    autoShow = true,
    autoHideDelay = 10000,
}: FloatingMascotProps) {
    const [isExpanded, setIsExpanded] = useState(autoShow);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoShow && autoHideDelay > 0) {
            const timer = setTimeout(() => {
                setIsExpanded(false);
            }, autoHideDelay);

            return () => clearTimeout(timer);
        }
    }, [autoShow, autoHideDelay]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="fixed bottom-20 right-4 z-50 lg:bottom-6 lg:right-6"
            >
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        // Expanded view with message
                        <motion.div
                            key="expanded"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="relative max-w-xs"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-colors"
                                aria-label="Schließen"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            {/* Collapse button */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="absolute -top-2 -left-2 w-6 h-6 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center shadow-lg z-10 transition-colors"
                                aria-label="Minimieren"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className="flex items-end gap-2">
                                {/* Mascot */}
                                <motion.div
                                    animate={{
                                        y: [0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatType: 'reverse',
                                    }}
                                    className="w-16 h-16 flex-shrink-0"
                                >
                                    <img
                                        src={MINI_MASCOT_IMAGES[mood]}
                                        alt="Helfer"
                                        className="w-full h-full object-contain drop-shadow-lg"
                                    />
                                </motion.div>

                                {/* Speech bubble */}
                                <div className="relative">
                                    {/* Tail */}
                                    <div className="absolute -left-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white dark:border-r-gray-800 border-b-8 border-b-transparent" />

                                    {/* Message */}
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border-2 border-teal-200 dark:border-teal-800"
                                    >
                                        <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">
                                            {message}
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        // Collapsed view - just mascot icon
                        <motion.button
                            key="collapsed"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={() => setIsExpanded(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative w-14 h-14 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full shadow-lg flex items-center justify-center group"
                        >
                            <img
                                src={MINI_MASCOT_IMAGES[mood]}
                                alt="Helfer öffnen"
                                className="w-10 h-10 object-contain"
                            />

                            {/* Notification dot */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
                            />

                            {/* Hover tooltip */}
                            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Tipp anzeigen
                            </div>

                            {/* Close button when collapsed */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVisible(false);
                                }}
                                className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}

export default FloatingMascot;
