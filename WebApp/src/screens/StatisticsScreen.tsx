// ============================================
// Statistics Screen
// ============================================

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Trophy,
  Calendar,
  Heart,
  Brain,
  Dumbbell,
  Users,
  Wallet,
  Apple,
  Target,
} from 'lucide-react';
import { Card, ProgressRing, AnimatedNumber, PointsInfoModal } from '../components/ui';
import { useUserStore } from '../store/userStore';
import { useTaskStore } from '../store/taskStore';
import { useAchievementStore } from '../store/achievementStore';
import { calculateLevel, calculateLevelProgress } from '../services/calculators';
import { CATEGORY_META, type TaskCategory } from '../types';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';

const categoryIcons: Record<TaskCategory, React.ReactNode> = {
  medical: <Heart className="w-5 h-5" />,
  mental_health: <Brain className="w-5 h-5" />,
  fitness: <Dumbbell className="w-5 h-5" />,
  social: <Users className="w-5 h-5" />,
  financial: <Wallet className="w-5 h-5" />,
  nutrition: <Apple className="w-5 h-5" />,
};

export default function StatisticsScreen() {
  const { currentUser } = useUserStore();
  const { taskInstances, getTaskById } = useTaskStore();
  const { getUnlockedAchievements } = useAchievementStore();

  const [showPointsInfoModal, setShowPointsInfoModal] = useState(false);

  const unlockedAchievements = getUnlockedAchievements();
  const level = currentUser ? calculateLevel(currentUser.totalPoints) : 1;
  const levelProgress = currentUser ? calculateLevelProgress(currentUser.totalPoints) : 0;

  // Calculate stats
  const stats = useMemo(() => {
    if (!currentUser) {
      return {
        totalCompleted: 0,
        thisWeek: 0,
        bestStreak: 0,
        categoryStats: {} as Record<TaskCategory, { completed: number; total: number }>,
        weeklyActivity: [] as { date: Date; count: number }[],
      };
    }

    // Get all completions
    const allCompletions = taskInstances.flatMap((t) =>
      t.completionHistory.map((c) => ({
        ...c,
        taskId: t.taskId,
      }))
    );

    // Total completed
    const totalCompleted = allCompletions.length;

    // This week
    const weekStart = subDays(new Date(), 7);
    const thisWeek = allCompletions.filter(
      (c) => new Date(c.completedAt) >= weekStart
    ).length;

    // Best streak
    const bestStreak = Math.max(currentUser.currentStreak, currentUser.longestStreak);

    // Category stats
    const categoryStats: Record<TaskCategory, { completed: number; total: number }> = {
      medical: { completed: 0, total: 0 },
      mental_health: { completed: 0, total: 0 },
      fitness: { completed: 0, total: 0 },
      social: { completed: 0, total: 0 },
      financial: { completed: 0, total: 0 },
      nutrition: { completed: 0, total: 0 },
    };

    taskInstances.forEach((instance) => {
      const template = getTaskById(instance.taskId);
      if (template) {
        categoryStats[template.category].total++;
        categoryStats[template.category].completed += instance.completionHistory.length;
      }
    });

    // Weekly activity (last 7 days)
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const weeklyActivity = days.map((date) => ({
      date,
      count: allCompletions.filter((c) =>
        isSameDay(new Date(c.completedAt), date)
      ).length,
    }));

    return {
      totalCompleted,
      thisWeek,
      bestStreak,
      categoryStats,
      weeklyActivity,
    };
  }, [currentUser, taskInstances, getTaskById]);

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
        <h1 className="text-2xl font-bold">Statistiken</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Dein Vorsorge-Fortschritt auf einen Blick
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ProgressRing progress={levelProgress} size={48} strokeWidth={4}>
              <span className="text-sm font-bold">{level}</span>
            </ProgressRing>
            <div>
              <p className="text-xs text-gray-500">Level</p>
              <p className="font-bold text-lg">Level {level}</p>
            </div>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow active:scale-95"
          onClick={() => setShowPointsInfoModal(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Gesamt Punkte</p>
              <p className="font-bold text-lg">
                <AnimatedNumber value={currentUser.totalPoints} />
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bester Streak</p>
              <p className="font-bold text-lg">{stats.bestStreak} Tage</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Aufgaben erledigt</p>
              <p className="font-bold text-lg">{stats.totalCompleted}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00A39D]" />
              Wochenaktivität
            </h2>
            <span className="text-sm text-gray-500">
              {stats.thisWeek} Aufgaben diese Woche
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-end justify-between gap-2 h-32">
            {stats.weeklyActivity.map(({ date, count }, index) => {
              const maxCount = Math.max(...stats.weeklyActivity.map((d) => d.count), 1);
              const height = (count / maxCount) * 100;
              const isToday = isSameDay(date, new Date());

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 4)}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`w-full rounded-t-lg ${isToday
                        ? 'bg-[#00A39D]'
                        : count > 0
                          ? 'bg-[#00A39D]/60'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  />
                  <span className={`text-xs ${isToday ? 'font-bold text-[#00A39D]' : 'text-gray-500'}`}>
                    {format(date, 'EE', { locale: de })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00A39D]" />
            Kategorien
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {(Object.keys(CATEGORY_META) as TaskCategory[]).map((category) => {
            const meta = CATEGORY_META[category];
            const catStats = stats.categoryStats[category];
            const percentage = catStats.total > 0
              ? Math.round((catStats.completed / (catStats.total * 10)) * 100) // Rough completion rate
              : 0;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {categoryIcons[category]}
                    <span className="font-medium">{meta.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {catStats.completed} erledigt
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievements Summary */}
      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Erfolge
            </h2>
            <span className="text-sm text-gray-500">
              {unlockedAchievements.length} freigeschaltet
            </span>
          </div>
        </div>
        <div className="p-4 flex gap-4 overflow-x-auto">
          {unlockedAchievements.slice(0, 6).map((achievement) => (
            <div
              key={achievement.id}
              className="flex-shrink-0 w-20 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
                {achievement.badgeIcon}
              </div>
              <p className="text-xs font-medium truncate">{achievement.title}</p>
            </div>
          ))}
          {unlockedAchievements.length === 0 && (
            <p className="text-gray-500 text-sm">Noch keine Erfolge freigeschaltet</p>
          )}
        </div>
      </Card>

      {/* Points Info Modal */}
      <PointsInfoModal
        isOpen={showPointsInfoModal}
        onClose={() => setShowPointsInfoModal(false)}
        currentPoints={currentUser.totalPoints}
      />
    </div>
  );
}
