// ============================================
// Tasks Screen
// ============================================

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Card, Button, RiskReductionAnimation, MascotMotivation } from '../components/ui';
import { TaskCard, TaskCompletionModal, CalendarExportModal } from '../components/tasks';
import { useUserStore } from '../store/userStore';
import { useTaskStore } from '../store/taskStore';
import { TASK_RISK_REDUCTIONS } from '../data/healthRisks';
import { type UserTaskInstance, type TaskTemplate, type RiskReduction } from '../types';
import { isToday, isThisWeek, isPast, startOfDay, isBefore } from 'date-fns';

type TabFilter = 'all' | 'today' | 'week' | 'overdue' | 'completed';

interface TaskWithTemplate {
  instance: UserTaskInstance;
  template: TaskTemplate;
}

export default function TasksScreen() {
  const { currentUser } = useUserStore();
  const { taskInstances, completeTask, getTaskById, searchQuery, setSearchQuery } = useTaskStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabFilter>('today');
  const [selectedTask, setSelectedTask] = useState<TaskWithTemplate | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showRiskAnimation, setShowRiskAnimation] = useState(false);
  const [currentRiskReductions, setCurrentRiskReductions] = useState<RiskReduction[]>([]);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

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

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let tasks = tasksWithTemplates;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.template.title.toLowerCase().includes(query) ||
          t.template.description.toLowerCase().includes(query)
      );
    }

    // Filter by tab
    const now = startOfDay(new Date());
    switch (activeTab) {
      case 'today':
        tasks = tasks.filter((t) => {
          const dueDate = new Date(t.instance.nextDue);
          return (isToday(dueDate) || isBefore(dueDate, now)) && t.instance.status !== 'completed_today';
        });
        break;
      case 'week':
        tasks = tasks.filter((t) => {
          const dueDate = new Date(t.instance.nextDue);
          return isThisWeek(dueDate) && !isToday(dueDate) && t.instance.status !== 'completed_today';
        });
        break;
      case 'overdue':
        tasks = tasks.filter((t) => {
          const dueDate = new Date(t.instance.nextDue);
          return isBefore(dueDate, now) && !isToday(dueDate) && t.instance.status !== 'completed_today';
        });
        break;
      case 'completed':
        tasks = tasks.filter((t) => t.instance.status === 'completed_today');
        break;
      default:
        tasks = tasks.filter((t) => t.instance.status !== 'completed_today');
    }

    // Sort by priority
    const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => {
      const dateA = new Date(a.instance.nextDue);
      const dateB = new Date(b.instance.nextDue);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return (priorityOrder[a.template.priority] ?? 2) - (priorityOrder[b.template.priority] ?? 2);
    });

    return tasks;
  }, [tasksWithTemplates, searchQuery, activeTab]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const now = startOfDay(new Date());
    let today = 0;
    let week = 0;
    let overdue = 0;
    let completed = 0;

    tasksWithTemplates.forEach((t) => {
      if (t.instance.status === 'completed_today') {
        completed++;
        return;
      }

      const dueDate = new Date(t.instance.nextDue);
      if (isBefore(dueDate, now) && !isToday(dueDate)) {
        overdue++;
      } else if (isToday(dueDate)) {
        today++;
      } else if (isThisWeek(dueDate)) {
        week++;
      }
    });

    return { today: today + overdue, week, overdue, completed };
  }, [tasksWithTemplates]);

  // Handle task completion
  const handleCompleteTask = useCallback(
    async (task: TaskWithTemplate) => {
      setSelectedTask(task);
      try {
        const result = await completeTask(task.instance.id);
        setEarnedPoints(result.points);
        setBonusPoints(result.bonusPoints);

        // Check for risk reductions
        const taskRiskReductions = TASK_RISK_REDUCTIONS[task.template.id];
        if (taskRiskReductions && taskRiskReductions.length > 0) {
          setCurrentRiskReductions(taskRiskReductions);
          setShowRiskAnimation(true);
        } else {
          setShowCompletionModal(true);
        }
      } catch (error) {
        console.error('Failed to complete task:', error);
      }
    },
    [completeTask]
  );

  // Close risk animation
  const closeRiskAnimation = useCallback(() => {
    setShowRiskAnimation(false);
    setSelectedTask(null);
    setEarnedPoints(0);
    setBonusPoints(0);
  }, []);

  // Handle add to calendar
  const handleAddToCalendar = useCallback((task: TaskWithTemplate) => {
    setSelectedTask(task);
    setShowCalendarModal(true);
  }, []);

  if (!currentUser) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Bitte anmelden...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Aufgaben</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Verwalte deine Vorsorge-Aufgaben
        </p>
      </div>

      {/* Mascot Motivation - Only show on 'today' or 'all' tabs */}
      {(activeTab === 'today' || activeTab === 'all') && (
        <MascotMotivation
          completedToday={tabCounts.completed}
          totalToday={tabCounts.today}
          streak={currentUser.currentStreak}
          lastActiveDate={currentUser.lastActiveDate}
          position="tasks"
          compact={true}
        />
      )}

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Aufgaben suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00A39D]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {[
          { id: 'today' as const, label: 'Heute', count: tabCounts.today, icon: Calendar },
          { id: 'week' as const, label: 'Diese Woche', count: tabCounts.week, icon: undefined },
          { id: 'overdue' as const, label: 'Überfällig', count: tabCounts.overdue, icon: AlertTriangle },
          { id: 'completed' as const, label: 'Erledigt', count: tabCounts.completed, icon: CheckCircle },
          { id: 'all' as const, label: 'Alle', count: undefined, icon: undefined },
        ].map(({ id, label, count, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === id
              ? 'border-[#00A39D] text-[#00A39D]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
            {count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${activeTab === id
                  ? 'bg-[#00A39D]/10 text-[#00A39D]'
                  : 'bg-gray-100 dark:bg-gray-800'
                  }`}
              >
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Keine Aufgaben</h3>
              <p className="text-gray-500">
                {activeTab === 'completed'
                  ? 'Noch keine Aufgaben erledigt'
                  : 'Alle Aufgaben erledigt! 🎉'}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map(({ instance, template }) => (
              <TaskCard
                key={instance.id}
                instance={instance}
                template={template}
                onComplete={() => handleCompleteTask({ instance, template })}
                onAddToCalendar={() => handleAddToCalendar({ instance, template })}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Risk Reduction Animation */}
      <RiskReductionAnimation
        isOpen={showRiskAnimation}
        onClose={closeRiskAnimation}
        reductions={currentRiskReductions}
        taskTitle={selectedTask?.template.title || ''}
        taskIcon={selectedTask?.template.icon || '✓'}
        earnedPoints={earnedPoints}
        bonusPoints={bonusPoints}
      />

      {/* Completion Modal */}
      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={() => {
          setShowCompletionModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask?.template || null}
        pointsEarned={earnedPoints}
        bonusPoints={bonusPoints}
        newStreak={currentUser.currentStreak}
        newAchievements={[]}
      />

      {/* Calendar Export Modal */}
      <CalendarExportModal
        isOpen={showCalendarModal}
        onClose={() => {
          setShowCalendarModal(false);
          setSelectedTask(null);
        }}
        taskTitle={selectedTask?.template.title || ''}
        taskDescription={selectedTask?.template.description || ''}
        dueDate={selectedTask?.instance.nextDue || new Date()}
        duration={selectedTask?.template.duration || '30min'}
      />
    </div>
  );
}
