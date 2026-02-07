// ============================================
// Dashboard Screen
// ============================================

import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Flame,
  TrendingUp,
  ChevronRight,
  Calendar,
  CheckCircle,
  Check,
  Shield,
} from 'lucide-react';
import { Card, ProgressRing, AnimatedNumber, RiskOverview, RiskReductionAnimation, MascotMotivation, PointsInfoModal, Badge } from '../components/ui';
import { TaskCompletionModal } from '../components/tasks';
import { useUserStore } from '../store/userStore';
import { useTaskStore } from '../store/taskStore';
import { useAchievementStore } from '../store/achievementStore';
import {
  calculateLevel,
  calculateLevelProgress,
} from '../services/calculators';
import { type UserTaskInstance, type TaskTemplate, type RiskReduction } from '../types';
import { HEALTH_RISKS, TASK_RISK_REDUCTIONS, calculateUserRiskProfile } from '../data';
import { isToday, isThisWeek, isBefore, startOfDay } from 'date-fns';

interface TaskWithTemplate {
  instance: UserTaskInstance;
  template: TaskTemplate;
}

export default function DashboardScreen() {
  const { currentUser } = useUserStore();
  const { taskInstances, completeTask, getTaskById } = useTaskStore();
  const { getUnlockedAchievements } = useAchievementStore();

  const [completingTask, setCompletingTask] = useState<TaskWithTemplate | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showRiskAnimation, setShowRiskAnimation] = useState(false);
  const [currentRiskReductions, setCurrentRiskReductions] = useState<RiskReduction[]>([]);
  const [showPointsInfoModal, setShowPointsInfoModal] = useState(false);

  // Derived data
  const level = currentUser ? calculateLevel(currentUser.totalPoints) : 1;
  const levelProgress = currentUser ? calculateLevelProgress(currentUser.totalPoints) : 0;

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
  const todayTasks = useMemo(() => {
    const activeTasks = tasksWithTemplates.filter(
      (t) => t.instance.status === 'active' || t.instance.status === 'pending'
    );

    const today: TaskWithTemplate[] = [];
    const overdue: TaskWithTemplate[] = [];

    activeTasks.forEach((task) => {
      const dueDate = new Date(task.instance.nextDue);
      const now = startOfDay(new Date());

      if (isBefore(dueDate, now) && !isToday(dueDate)) {
        overdue.push(task);
      } else if (isToday(dueDate)) {
        today.push(task);
      }
    });

    // Sort by priority
    const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    const sortByPriority = (a: TaskWithTemplate, b: TaskWithTemplate) => {
      return (priorityOrder[a.template.priority] ?? 2) - (priorityOrder[b.template.priority] ?? 2);
    };

    return [...overdue, ...today].sort(sortByPriority).slice(0, 5);
  }, [tasksWithTemplates]);

  // Calculate user's risk profile based on completed tasks
  const completedTaskIds = useMemo(() => {
    return tasksWithTemplates
      .filter(t => t.instance.status === 'completed_today' || t.instance.completionHistory.length > 0)
      .map(t => t.template.id);
  }, [tasksWithTemplates]);

  const riskProfile = useMemo(() => {
    return calculateUserRiskProfile(completedTaskIds);
  }, [completedTaskIds]);

  // Handle task completion
  const handleCompleteTask = useCallback(
    async (task: TaskWithTemplate) => {
      setCompletingTask(task);

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

  const closeRiskAnimation = () => {
    setShowRiskAnimation(false);
    setCompletingTask(null);
    setEarnedPoints(0);
    setBonusPoints(0);
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    setCompletingTask(null);
  };

  if (!currentUser) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Bitte anmelden...</p>
      </div>
    );
  }

  const unlockedAchievements = getUnlockedAchievements();

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#00A39D] to-[#008C87] rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Hallo, {currentUser.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-teal-100">
              Du hast heute {todayTasks.length} Aufgaben vor dir
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-[#FFB800]">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{currentUser.currentStreak} Tage</span>
            </div>
            <p className="text-sm text-teal-100">Streak</p>
          </div>
        </div>
      </motion.div>

      {/* Mascot Motivation */}
      <MascotMotivation
        completedToday={tasksWithTemplates.filter(t => t.instance.status === 'completed_today').length}
        totalToday={todayTasks.length}
        streak={currentUser.currentStreak}
        lastActiveDate={currentUser.lastActiveDate}
        position="dashboard"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ProgressRing progress={levelProgress} size={48} strokeWidth={4}>
              <span className="text-sm font-bold">{level}</span>
            </ProgressRing>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
              <p className="font-semibold">Level {level}</p>
            </div>
          </div>
        </Card>

        {/* Points */}
        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow active:scale-95"
          onClick={() => setShowPointsInfoModal(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Punkte</p>
              <p className="font-semibold">
                <AnimatedNumber value={currentUser.totalPoints} />
              </p>
            </div>
          </div>
        </Card>

        {/* Streak */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
              <p className="font-semibold">{currentUser.currentStreak} Tage</p>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Erfolge</p>
              <p className="font-semibold">{unlockedAchievements.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Tasks */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00A39D]" />
              <h2 className="font-semibold">Heutige Aufgaben</h2>
            </div>
            <Link
              to="/aufgaben"
              className="text-sm text-[#00A39D] hover:underline flex items-center gap-1"
            >
              Alle anzeigen
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {todayTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <p className="text-gray-500">Keine Aufgaben für heute!</p>
            </div>
          ) : (
            todayTasks.map(({ instance, template }) => (
              <motion.div
                key={instance.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  flex items-center gap-3 p-3 rounded-xl
                  bg-gray-50 dark:bg-gray-800/50
                  border border-gray-200 dark:border-gray-700
                  ${isBefore(new Date(instance.nextDue), startOfDay(new Date())) ? 'border-red-300 dark:border-red-800' : ''}
                `}
              >
                <button
                  onClick={() => handleCompleteTask({ instance, template })}
                  className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-[#00A39D] flex items-center justify-center transition-all hover:bg-teal-50 dark:hover:bg-teal-900/20"
                >
                  <Check className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                </button>

                <Link to={`/aufgaben/${instance.id}`} className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {template.icon} {template.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500 truncate">{template.duration}</p>
                    <Badge size="sm">⭐ {template.points} Pkt</Badge>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="font-semibold">Letzte Erfolge</h2>
              </div>
              <Link
                to="/erfolge"
                className="text-sm text-[#00A39D] hover:underline flex items-center gap-1"
              >
                Alle anzeigen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-4 flex gap-4 overflow-x-auto">
            {unlockedAchievements.slice(0, 4).map((achievement) => (
              <div
                key={achievement.id}
                className="flex-shrink-0 w-24 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
                  {achievement.badgeIcon}
                </div>
                <p className="text-xs font-medium truncate">{achievement.title}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Health Risk Overview */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00A39D]" />
            <h2 className="font-semibold">Dein Gesundheitsschutz</h2>
          </div>
        </div>
        <div className="p-4">
          <RiskOverview
            risks={riskProfile}
            compact={false}
          />
        </div>
      </Card>

      {/* Risk Reduction Animation */}
      <RiskReductionAnimation
        isOpen={showRiskAnimation}
        onClose={closeRiskAnimation}
        reductions={currentRiskReductions}
        taskTitle={completingTask?.template.title || ''}
        taskIcon={completingTask?.template.icon || '✓'}
        earnedPoints={earnedPoints}
        bonusPoints={bonusPoints}
      />

      {/* Task Completion Modal */}
      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={closeCompletionModal}
        task={completingTask?.template || null}
        pointsEarned={earnedPoints}
        bonusPoints={bonusPoints}
        newStreak={currentUser.currentStreak}
        newAchievements={[]}
      />

      {/* Points Info Modal */}
      <PointsInfoModal
        isOpen={showPointsInfoModal}
        onClose={() => setShowPointsInfoModal(false)}
        currentPoints={currentUser.totalPoints}
      />
    </div>
  );
}
