// ============================================
// Dashboard Screen - Redesigned (Modern Health App Style)
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Bell,
    ArrowRight,
    CheckCircle2,
    Clock,
    ChevronRight,
} from 'lucide-react';
import { MascotMotivation } from '../components/ui';
import { useUserStore } from '../store/userStore';
import { useTaskStore } from '../store/taskStore';
import { isToday, isBefore, startOfDay, format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { UserTaskInstance, TaskTemplate } from '../types';

interface TaskWithTemplate {
    instance: UserTaskInstance;
    template: TaskTemplate;
}

export default function DashboardScreen() {
    const { currentUser } = useUserStore();
    const { taskInstances, completeTask, getTaskById } = useTaskStore();

    // Create tasks with templates
    const tasksWithTemplates = useMemo(() => {
        return taskInstances
            .map((instance) => {
                const template = getTaskById(instance.taskId);
                if (!template) return null;
                return { instance, template };
            })
            .filter((t): t is TaskWithTemplate => t !== null);
    }, [taskInstances, getTaskById]);

    // Get today's tasks
    const todayTasks = useMemo(() => {
        const now = startOfDay(new Date());
        return tasksWithTemplates
            .filter((t) => {
                const dueDate = new Date(t.instance.nextDue);
                return (isToday(dueDate) || isBefore(dueDate, now)) && t.instance.status !== 'completed_today';
            })
            .slice(0, 5);
    }, [tasksWithTemplates]);

    // Completed today count
    const completedToday = useMemo(() => {
        return tasksWithTemplates.filter(t => t.instance.status === 'completed_today').length;
    }, [tasksWithTemplates]);

    const handleCompleteTask = async (task: TaskWithTemplate) => {
        try {
            await completeTask(task.instance.id);
        } catch (error) {
            console.error('Failed to complete task:', error);
        }
    };

    if (!currentUser) {
        return (
            <div className="p-4">
                <p className="text-gray-500">Bitte anmelden...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 px-4 pt-4 pb-6">
                {/* Greeting */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Guten Tag, {currentUser.name.split(' ')[0]}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[#00A39D] rounded-full"></span>
                        </button>
                        <Link to="/konto" className="w-10 h-10 rounded-full bg-[#00A39D] text-white flex items-center justify-center font-bold text-sm">
                            {currentUser.name.charAt(0)}
                        </Link>
                    </div>
                </div>

                {/* Mascot Motivation */}
                <MascotMotivation
                    completedToday={completedToday}
                    totalToday={todayTasks.length}
                    streak={currentUser.currentStreak}
                    lastActiveDate={currentUser.lastActiveDate}
                    position="dashboard"
                    compact={false}
                />
            </div>

            {/* Main Content */}
            <div className="px-4 py-6 space-y-6">
                {/* Featured Card - VorsorgeCheck */}
                <Link
                    to="/fuer-dich"
                    className="block"
                >
                    <div className="relative bg-gradient-to-br from-[#00A39D] to-[#008C87] rounded-3xl p-6 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        {/* Background illustration */}
                        <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20">
                            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                                <circle cx="50" cy="50" r="40" fill="white" />
                            </svg>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-white mb-2">VorsorgeCheck</h2>
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="text-sm">Jetzt starten</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Next Tasks Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nächste Aufgaben</h2>
                        {todayTasks.length > 0 && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-[#00A39D]/10 text-[#00A39D] font-medium">
                                Fällig: Vor {todayTasks.length} Tagen
                            </span>
                        )}
                    </div>

                    {/* Tasks List */}
                    <div className="space-y-3">
                        {todayTasks.length === 0 ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center">
                                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
                                <p className="text-gray-600 dark:text-gray-400">Keine offenen Aufgaben!</p>
                            </div>
                        ) : (
                            todayTasks.map(({ instance, template }) => (
                                <div
                                    key={instance.id}
                                    className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleCompleteTask({ instance, template })}
                                        className="flex-shrink-0 w-6 h-6 rounded-md border-2 border-gray-300 dark:border-gray-600 hover:border-[#00A39D] hover:bg-[#00A39D]/10 transition-colors flex items-center justify-center"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-transparent" />
                                    </button>

                                    {/* Task Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                            {template.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {template.description}
                                        </p>
                                    </div>

                                    {/* Action */}
                                    <Link
                                        to={`/aufgaben/${instance.id}`}
                                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* View All Link */}
                    {todayTasks.length > 0 && (
                        <Link
                            to="/fuer-dich"
                            className="block mt-4 text-center py-3 text-sm font-medium text-[#00A39D] hover:text-[#008C87] transition-colors"
                        >
                            Alle Aufgaben anzeigen
                        </Link>
                    )}
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/benefits"
                        className="bg-white dark:bg-gray-900 rounded-2xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-3">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Benefits</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Deine Erfolge</p>
                    </Link>

                    <Link
                        to="/statistik"
                        className="bg-white dark:bg-gray-900 rounded-2xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Statistik</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Dein Fortschritt</p>
                    </Link>
                </div>

                {/* Streak Card */}
                {currentUser.currentStreak > 0 && (
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">Deine Serie</p>
                                <p className="text-3xl font-bold">{currentUser.currentStreak} Tage 🔥</p>
                            </div>
                            <div className="text-5xl opacity-20">🔥</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
