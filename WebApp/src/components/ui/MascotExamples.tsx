// ============================================
// Mascot Usage Examples
// ============================================

import { MascotMotivation } from './MascotMotivation';
import { FloatingMascot } from './FloatingMascot';

// ============================================
// Example 1: Dashboard - Full Display
// ============================================
export function DashboardMascotExample() {
    return (
        <MascotMotivation
            completedToday={3}
            totalToday={8}
            streak={5}
            lastActiveDate={new Date()}
            position="dashboard"
            compact={false}
        />
    );
}

// ============================================
// Example 2: Tasks Screen - Compact Display
// ============================================
export function TasksMascotExample() {
    return (
        <MascotMotivation
            completedToday={0}
            totalToday={5}
            streak={2}
            lastActiveDate={new Date()}
            position="tasks"
            compact={true}
        />
    );
}

// ============================================
// Example 3: Achievements Screen
// ============================================
export function AchievementsMascotExample() {
    return (
        <MascotMotivation
            completedToday={10}
            totalToday={20}
            streak={14}
            lastActiveDate={new Date()}
            position="achievements"
            compact={true}
        />
    );
}

// ============================================
// Example 4: Re-engagement (Inactive User)
// ============================================
export function InactiveMascotExample() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return (
        <MascotMotivation
            completedToday={0}
            totalToday={5}
            streak={0}
            lastActiveDate={twoDaysAgo}
            position="dashboard"
            compact={false}
        />
    );
}

// ============================================
// Example 5: All Tasks Complete Celebration
// ============================================
export function CelebrationMascotExample() {
    return (
        <MascotMotivation
            completedToday={8}
            totalToday={8}
            streak={10}
            lastActiveDate={new Date()}
            position="dashboard"
            compact={false}
        />
    );
}

// ============================================
// Example 6: Floating Helper - Hydration Reminder
// ============================================
export function FloatingHydrationReminder() {
    return (
        <FloatingMascot
            message="Vergiss nicht, heute Wasser zu trinken! 💧 Bleib hydratisiert!"
            mood="thinking"
            autoShow={true}
            autoHideDelay={8000}
        />
    );
}

// ============================================
// Example 7: Floating Helper - Task Reminder
// ============================================
export function FloatingTaskReminder() {
    return (
        <FloatingMascot
            message="Du hast noch 3 Aufgaben für heute offen! 🎯"
            mood="thinking"
            autoShow={true}
            autoHideDelay={10000}
        />
    );
}

// ============================================
// Example 8: Floating Helper - Celebration
// ============================================
export function FloatingCelebration() {
    return (
        <FloatingMascot
            message="Gratuliere! Du hast ein neues Achievement freigeschaltet! 🏆"
            mood="happy"
            autoShow={true}
            autoHideDelay={6000}
        />
    );
}

// ============================================
// Example 9: Conditional Display Based on Time
// ============================================
export function TimeSensitiveMascot() {
    const now = new Date();
    const hour = now.getHours();

    // Only show in the morning (6 AM - 12 PM)
    const shouldShow = hour >= 6 && hour < 12;

    if (!shouldShow) return null;

    return (
        <FloatingMascot
            message="Guten Morgen! Zeit für deine Morgenroutine! ☀️"
            mood="happy"
            autoShow={true}
            autoHideDelay={12000}
        />
    );
}

// ============================================
// Example 10: Dynamic Message Based on Progress
// ============================================
export function DynamicProgressMascot({ completed, total }: { completed: number; total: number }) {
    const percentage = (completed / total) * 100;

    let message = '';
    let mood: 'happy' | 'thumbup' | 'thinking' = 'thinking';

    if (percentage === 100) {
        message = '🎉 Perfekt! Alle Aufgaben erledigt!';
        mood = 'happy';
    } else if (percentage >= 75) {
        message = '💪 Fast geschafft! Nur noch ein paar mehr!';
        mood = 'thumbup';
    } else if (percentage >= 50) {
        message = '👍 Gute Arbeit! Über die Hälfte geschafft!';
        mood = 'thumbup';
    } else if (percentage >= 25) {
        message = '🚀 Weiter so! Du bist auf einem guten Weg!';
        mood = 'thumbup';
    } else {
        message = '💡 Zeit anzufangen! Such dir eine Aufgabe aus!';
        mood = 'thinking';
    }

    return (
        <FloatingMascot
            message={message}
            mood={mood}
            autoShow={true}
            autoHideDelay={8000}
        />
    );
}

// ============================================
// Example 11: Streak Milestone Celebration
// ============================================
export function StreakMilestoneMascot({ streak }: { streak: number }) {
    // Only show on milestone days (7, 14, 30, 60, 100)
    const milestones = [7, 14, 30, 60, 100];
    const isMilestone = milestones.includes(streak);

    if (!isMilestone) return null;

    const messages: Record<number, string> = {
        7: '🎊 Eine Woche durchgehalten! Du bist fantastisch!',
        14: '⭐ Zwei Wochen Serie! Du bist unaufhaltsam!',
        30: '🏆 Ein ganzer Monat! Das ist beeindruckend!',
        60: '👑 60 Tage! Du bist ein echter Champion!',
        100: '🎉 WOW! 100 Tage! Du bist eine Legende!',
    };

    return (
        <MascotMotivation
            completedToday={1}
            totalToday={1}
            streak={streak}
            lastActiveDate={new Date()}
            position="dashboard"
            compact={false}
        />
    );
}

// ============================================
// Example 12: Context-Aware Tip Provider
// ============================================
export function ContextualTipMascot({ currentScreen }: { currentScreen: string }) {
    const tips: Record<string, { message: string; mood: 'happy' | 'thumbup' | 'thinking' }> = {
        dashboard: {
            message: '💡 Tipp: Erledige zuerst die wichtigsten Aufgaben!',
            mood: 'thinking',
        },
        tasks: {
            message: '🎯 Tipp: Kleine Aufgaben summieren sich zu großen Erfolgen!',
            mood: 'thumbup',
        },
        achievements: {
            message: '🏅 Tipp: Jeder Erfolg ist ein Schritt zu besserer Gesundheit!',
            mood: 'happy',
        },
        statistics: {
            message: '📊 Tipp: Deine Fortschritte zeigen, wie konsequent du bist!',
            mood: 'thumbup',
        },
    };

    const tip = tips[currentScreen] || tips.dashboard;

    return (
        <FloatingMascot
            message={tip.message}
            mood={tip.mood}
            autoShow={false}
            autoHideDelay={0}
        />
    );
}

// ============================================
// Example 13: Integrated with User Store
// ============================================
export function SmartMascotIntegration() {
    // This would typically use your actual stores
    // import { useUserStore } from '../store/userStore';
    // import { useTaskStore } from '../store/taskStore';

    // const { currentUser } = useUserStore();
    // const { taskInstances } = useTaskStore();

    // Mock data for example
    const mockUser = {
        currentStreak: 7,
        lastActiveDate: new Date(),
    };

    const mockTasks = {
        completedToday: 4,
        totalToday: 8,
    };

    return (
        <div className="space-y-4">
            {/* Main motivational mascot */}
            <MascotMotivation
                completedToday={mockTasks.completedToday}
                totalToday={mockTasks.totalToday}
                streak={mockUser.currentStreak}
                lastActiveDate={mockUser.lastActiveDate}
                position="dashboard"
                compact={false}
            />

            {/* Floating helper for quick tips */}
            <FloatingMascot
                message="Du machst das super! 💪"
                mood="thumbup"
                autoShow={true}
                autoHideDelay={5000}
            />
        </div>
    );
}

// ============================================
// Usage Tips
// ============================================

/*
  BEST PRACTICES:
  
  1. Show mascot when:
     - User completes a task (celebration)
     - User hasn't been active (re-engagement)
     - User achieves a milestone (motivation)
     - User needs guidance (tips)
  
  2. Don't show mascot:
     - On every page load (annoying)
     - More than once per session (excessive)
     - During critical user actions (distraction)
  
  3. Timing:
     - Auto-hide after 8-12 seconds
     - Allow user to dismiss anytime
     - Don't interrupt user workflow
  
  4. Message Tone:
     - Always positive and encouraging
     - Never judgmental or negative
     - Use emojis sparingly
     - Keep messages concise
  
  5. Accessibility:
     - Provide alt text
     - Ensure keyboard navigation
     - Support screen readers
     - Respect reduced motion
*/
