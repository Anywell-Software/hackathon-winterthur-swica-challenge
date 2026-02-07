// ============================================
// Mascot Motivation Component - Comic Style
// ============================================

import { X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { differenceInHours, differenceInDays } from 'date-fns';

type MascotMood = 'happy' | 'thumbup' | 'tired' | 'thinking' | 'running';

interface MascotMessage {
    mood: MascotMood;
    message: string;
    action?: {
        label: string;
        path: string;
    };
}

interface MascotMotivationProps {
    completedToday: number;
    totalToday: number;
    streak: number;
    lastActiveDate: Date | null;
    position?: 'dashboard' | 'tasks' | 'achievements';
    compact?: boolean;
}

const MASCOT_IMAGES: Record<MascotMood, string> = {
    happy: '/welldone.png',
    thumbup: '/thumbup.png',
    tired: '/sad.png',
    thinking: '/whattodo.png',
    running: '/workinghard.png',
};

// Messages for different contexts
const POSITION_MESSAGES = {
    dashboard: {
        allDone: [
            '🎉 Wow! Alle Aufgaben erledigt! Du bist heute richtig produktiv!',
            '🌟 Fantastisch! Alle heutigen Aufgaben sind geschafft! Du rockst!',
            '✨ Perfekt! Nichts mehr zu tun heute - gönn dir eine Pause!',
        ],
        goodProgress: [
            '💪 Super Arbeit! Du bist auf einem tollen Weg heute!',
            '👍 Sehr gut! Bleib dran, du schaffst das!',
            '🚀 Großartig! Noch ein paar Aufgaben und du bist durch!',
        ],
        needsMotivation: [
            '🎯 Lass uns heute noch ein paar Aufgaben angehen!',
            '💚 Kleine Schritte führen zum Ziel - jede Aufgabe zählt!',
            '🌱 Wie wäre es, mit einer einfachen Aufgabe zu starten?',
        ],
    },
    tasks: {
        allDone: [
            '🏆 Alle Aufgaben geschafft! Du bist ein Champion!',
            '⭐ Wow, du hast heute alles erledigt! Respekt!',
        ],
        goodProgress: [
            '👏 Tolle Fortschritte! Mach weiter so!',
            '💯 Du bist gut dabei! Noch ein paar mehr!',
        ],
        needsMotivation: [
            '🎯 Auf geht\'s! Such dir eine Aufgabe aus!',
            '💡 Tipp: Beginne mit der wichtigsten Aufgabe zuerst!',
        ],
    },
    achievements: {
        hasAchievements: [
            '🏅 Wow, schau dir deine Erfolge an! Du bist fantastisch!',
            '⭐ Deine Erfolge zeigen, wie stark du bist!',
            '🎖️ Jeder Erfolg ist ein Schritt zu besserer Gesundheit!',
        ],
        keepGoing: [
            '🚀 Es gibt noch mehr Erfolge zu entdecken!',
            '💪 Weitermachen! Neue Erfolge warten auf dich!',
        ],
    },
};

export function MascotMotivation({
    completedToday,
    totalToday,
    streak,
    lastActiveDate,
    position = 'dashboard',
    compact = false,
}: MascotMotivationProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Get random message from array
    const getRandomMessage = (messages: string[]) => {
        return messages[Math.floor(Math.random() * messages.length)];
    };

    // Determine mascot mood and message based on user activity
    const mascotState: MascotMessage = useMemo(() => {
        const now = new Date();
        const hoursSinceActive = lastActiveDate
            ? differenceInHours(now, lastActiveDate)
            : 999;
        const daysSinceActive = lastActiveDate
            ? differenceInDays(now, lastActiveDate)
            : 999;

        // Position-specific logic
        if (position === 'achievements') {
            const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

            if (completedToday > 5) {
                return {
                    mood: 'happy',
                    message: getRandomMessage(POSITION_MESSAGES.achievements.hasAchievements),
                };
            }

            return {
                mood: 'thumbup',
                message: getRandomMessage(POSITION_MESSAGES.achievements.keepGoing),
            };
        }

        // All tasks completed today - celebrate!
        if (totalToday > 0 && completedToday === totalToday) {
            const messages = POSITION_MESSAGES[position]?.allDone || POSITION_MESSAGES.dashboard.allDone;
            let message = getRandomMessage(messages);

            // Add streak bonus message
            if (streak >= 7) {
                message += ` Und deine ${streak}-Tage-Serie ist beeindruckend! 🔥`;
            }

            return {
                mood: 'happy',
                message,
            };
        }

        // Good progress today
        if (completedToday > 0 && completedToday >= totalToday * 0.5) {
            const messages = POSITION_MESSAGES[position]?.goodProgress || POSITION_MESSAGES.dashboard.goodProgress;
            return {
                mood: 'thumbup',
                message: getRandomMessage(messages),
            };
        }

        // Inactive for more than a day
        if (daysSinceActive >= 2) {
            return {
                mood: 'tired',
                message: daysSinceActive >= 7
                    ? '😢 Ich hab dich wirklich vermisst! Lass uns wieder loslegen!'
                    : '🤗 Hey! Schön, dass du wieder da bist. Lass uns weitermachen!',
            };
        }

        // Inactive for several hours
        if (hoursSinceActive >= 6 && completedToday === 0) {
            return {
                mood: 'thinking',
                message: '🤔 Hmm... Wie wäre es mit einer kleinen Gesundheitsaufgabe? Schon 10 Minuten helfen!',
            };
        }

        // Has tasks to complete but none done yet
        if (totalToday > 0 && completedToday === 0) {
            const messages = POSITION_MESSAGES[position]?.needsMotivation || POSITION_MESSAGES.dashboard.needsMotivation;
            return {
                mood: 'running',
                message: getRandomMessage(messages),
            };
        }

        // Strong streak - encourage to maintain
        if (streak >= 7) {
            return {
                mood: 'thumbup',
                message: `Beeindruckende ${streak}-Tage-Serie! Ich bin stolz auf dich! 🔥`,
            };
        }

        // Building streak
        if (streak >= 3) {
            return {
                mood: 'running',
                message: `Super! ${streak} Tage in Folge! Lass die Serie nicht abreißen! 💪`,
            };
        }

        // Default encouraging message
        return {
            mood: 'thumbup',
            message: '💚 Du machst das großartig! Jeder Schritt zählt für deine Gesundheit!',
        };
    }, [completedToday, totalToday, streak, lastActiveDate, position]);

    if (!isVisible) return null;

    return (
        <div className="relative flex items-start gap-3 md:gap-4 py-2">
            {/* Mascot Image - Compact on left */}
            <div className={compact ? "w-20 h-20 flex-shrink-0" : "w-24 h-24 md:w-28 md:h-28 flex-shrink-0"}>
                <img
                    src={MASCOT_IMAGES[mascotState.mood]}
                    alt="Motivations-Maskottchen"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Speech Bubble - Compact style */}
            <div className="relative flex-1">
                {/* Bubble tail pointing to mascot */}
                <div className="absolute left-0 top-3 -translate-x-2 w-0 h-0 
                    border-t-[8px] border-t-transparent
                    border-r-[12px] border-r-white dark:border-r-gray-700
                    border-b-[8px] border-b-transparent
                "></div>
                <div className="absolute left-0 top-3 -translate-x-[3px] w-0 h-0 
                    border-t-[8px] border-t-transparent
                    border-r-[12px] border-r-gray-300 dark:border-r-gray-600
                    border-b-[8px] border-b-transparent
                "></div>

                {/* Speech bubble content */}
                <div className="relative bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 border-2 border-gray-300 dark:border-gray-600 shadow-md">
                    <p className={`text-gray-900 dark:text-gray-100 ${compact ? 'text-sm' : 'text-base'} leading-snug`}>
                        {mascotState.message}
                    </p>
                </div>
            </div>

            {/* Close button - small and subtle */}
            <button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                aria-label="Ausblenden"
            >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
        </div>
    );
}

export default MascotMotivation;
