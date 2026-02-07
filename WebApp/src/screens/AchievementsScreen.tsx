// ============================================
// Achievements Screen
// ============================================

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Lock,
  CheckCircle,
  Flame,
  Star,
  Target,
  Zap,
  Crown,
  Medal,
  Award,
} from 'lucide-react';
import { Card, Badge, ProgressRing, Modal, MascotMotivation } from '../components/ui';
import { useAchievementStore } from '../store/achievementStore';
import { useUserStore } from '../store/userStore';
import { ACHIEVEMENTS } from '../data/achievements';
import type { Achievement } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type FilterType = 'all' | 'unlocked' | 'locked';

const getAchievementIcon = (iconName: string) => {
  switch (iconName) {
    case 'flame':
      return <Flame className="w-8 h-8" />;
    case 'star':
      return <Star className="w-8 h-8" />;
    case 'target':
      return <Target className="w-8 h-8" />;
    case 'zap':
      return <Zap className="w-8 h-8" />;
    case 'crown':
      return <Crown className="w-8 h-8" />;
    case 'medal':
      return <Medal className="w-8 h-8" />;
    case 'award':
      return <Award className="w-8 h-8" />;
    default:
      return <Trophy className="w-8 h-8" />;
  }
};

const rarityColors: Record<string, { bg: string; border: string; text: string }> = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    border: 'border-gray-300 dark:border-gray-600',
    text: 'text-gray-600 dark:text-gray-400',
  },
  uncommon: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-600 dark:text-green-400',
  },
  rare: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-600 dark:text-blue-400',
  },
  epic: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-300 dark:border-purple-700',
    text: 'text-purple-600 dark:text-purple-400',
  },
  legendary: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-400 dark:border-yellow-600',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
};

const rarityLabels: Record<string, string> = {
  common: 'Gewöhnlich',
  uncommon: 'Ungewöhnlich',
  rare: 'Selten',
  epic: 'Episch',
  legendary: 'Legendär',
};

export default function AchievementsScreen() {
  const { userAchievements, getUnlockedAchievements, getLockedAchievements, getTotalAchievementPoints } = useAchievementStore();
  const { currentUser } = useUserStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();
  const totalPoints = getTotalAchievementPoints();

  // Get unlock date for an achievement
  const getUnlockDate = (achievementId: string) => {
    const ua = userAchievements.find((ua) => ua.achievementId === achievementId);
    return ua ? new Date(ua.unlockedAt) : null;
  };

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    const unlocked = unlockedAchievements;
    const locked = lockedAchievements;

    switch (filter) {
      case 'unlocked':
        return unlocked;
      case 'locked':
        return locked;
      default:
        return [...unlocked, ...locked];
    }
  }, [filter, unlockedAchievements, lockedAchievements]);

  // Stats
  const stats = useMemo(() => {
    const total = ACHIEVEMENTS.length;
    const unlocked = unlockedAchievements.length;
    const percentage = Math.round((unlocked / total) * 100);

    const byRarity = ACHIEVEMENTS.reduce(
      (acc, a) => {
        acc[a.rarity] = acc[a.rarity] || { total: 0, unlocked: 0 };
        acc[a.rarity].total++;
        if (unlockedAchievements.some((ua) => ua.id === a.id)) {
          acc[a.rarity].unlocked++;
        }
        return acc;
      },
      {} as Record<string, { total: number; unlocked: number }>
    );

    return { total, unlocked, percentage, byRarity };
  }, [unlockedAchievements]);

  const isUnlocked = (achievementId: string) => {
    return unlockedAchievements.some((a) => a.id === achievementId);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Erfolge</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {stats.unlocked} von {stats.total} freigeschaltet
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-500">{totalPoints}</p>
          <p className="text-sm text-gray-500">Punkte</p>
        </div>
      </div>

      {/* Mascot Celebration - Show when user has achievements */}
      {stats.unlocked > 0 && (
        <MascotMotivation
          completedToday={stats.unlocked}
          totalToday={stats.total}
          streak={currentUser?.currentStreak || 0}
          lastActiveDate={currentUser?.lastActiveDate || null}
          position="achievements"
          compact={true}
        />
      )}

      {/* Progress Card */}
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <ProgressRing progress={stats.percentage} size={80} strokeWidth={6}>
            <span className="text-lg font-bold">{stats.percentage}%</span>
          </ProgressRing>
          <div className="flex-1">
            <h2 className="font-semibold mb-2">Gesamtfortschritt</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
                const data = stats.byRarity[rarity] || { total: 0, unlocked: 0 };
                return (
                  <div key={rarity} className={`p-2 rounded-lg ${rarityColors[rarity].bg}`}>
                    <p className={`text-xs font-medium ${rarityColors[rarity].text}`}>
                      {rarityLabels[rarity]}
                    </p>
                    <p className="font-bold">
                      {data.unlocked}/{data.total}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'unlocked', 'locked'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f
              ? 'bg-[#00A39D] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {f === 'all' && 'Alle'}
            {f === 'unlocked' && `Freigeschaltet (${unlockedAchievements.length})`}
            {f === 'locked' && `Gesperrt (${lockedAchievements.length})`}
          </button>
        ))}
      </div>

      {/* Mountain Pathway - Achievement Journey */}
      <div className="relative min-h-[1600px] overflow-hidden rounded-3xl bg-[#F5E6D3] shadow-2xl">
        {/* Mountain Background Image */}
        <div className="absolute inset-0">
          <img
            src="/mountain-stairs.png"
            alt="Mountain Path with Stairs"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Achievement Milestones positioned along the stairs */}
        <div className="relative z-10 h-full">
          {filteredAchievements.map((achievement, index) => {
            const unlocked = isUnlocked(achievement.id);
            const unlockDate = getUnlockDate(achievement.id);
            const rarity = achievement.rarity;
            const colors = rarityColors[rarity] || rarityColors.common;

            // Calculate position along the path from bottom to top
            const totalAchievements = filteredAchievements.length;
            const stepHeight = 50; // pixels between each step
            const startFromBottom = 1340; // starting Y position from SVG
            const yPosition = startFromBottom - (index * stepHeight);

            // Dramatic serpentine/zigzag pattern like in the reference image
            // Creates wide S-curves going left → right → left
            const progress = index / Math.max(totalAchievements - 1, 1);
            const cycles = 3; // Number of complete zigzag cycles
            const amplitude = 25; // How far left/right (percentage)

            // Sine wave for smooth serpentine motion
            const xOffset = Math.sin(progress * Math.PI * cycles * 2) * amplitude;
            const xPosition = 50; // Center percentage

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15, type: 'spring' }}
                whileHover={{ scale: 1.15, zIndex: 100 }}
                onClick={() => setSelectedAchievement(achievement)}
                className="absolute cursor-pointer"
                style={{
                  left: `${xPosition + xOffset}%`,
                  top: `${yPosition}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Milestone Marker */}
                <div className="relative">
                  {/* Connecting dot/line to path */}
                  <div
                    className={`absolute w-0.5 h-8 ${unlocked ? 'bg-yellow-400' : 'bg-gray-400'
                      }`}
                    style={{
                      left: '50%',
                      bottom: '-32px',
                      transform: 'translateX(-50%)'
                    }}
                  />

                  {/* Achievement Badge */}
                  <motion.div
                    animate={unlocked ? {
                      rotate: [0, -10, 10, -10, 0],
                      boxShadow: [
                        '0 0 20px rgba(251, 191, 36, 0.4)',
                        '0 0 40px rgba(251, 191, 36, 0.7)',
                        '0 0 20px rgba(251, 191, 36, 0.4)',
                      ]
                    } : {}}
                    transition={{
                      rotate: { duration: 2, repeat: Infinity, repeatDelay: 3 },
                      boxShadow: { duration: 2, repeat: Infinity }
                    }}
                    className={`
                      w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl
                      border-4
                      ${unlocked
                        ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 border-yellow-200 shadow-2xl'
                        : 'bg-gray-300 dark:bg-gray-700 border-gray-400 grayscale opacity-60'
                      }
                      relative overflow-hidden
                      transition-all duration-300
                    `}
                  >
                    {unlocked && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      />
                    )}
                    {unlocked ? achievement.badgeIcon : <Lock className="w-6 h-6 md:w-8 md:h-8 text-gray-500" />}
                  </motion.div>

                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#00A39D] text-white text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white">
                    {index + 1}
                  </div>

                  {/* Tooltip on Hover */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className={`
                      absolute left-full ml-4 top-1/2 -translate-y-1/2
                      w-64 p-3 rounded-xl shadow-2xl
                      ${colors.bg} ${colors.border} border-2
                      pointer-events-none
                      backdrop-blur-sm bg-opacity-95
                      hidden md:block
                    `}
                  >
                    <h4 className="font-bold text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.text}`}>
                        {rarityLabels[rarity]}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-bold">
                        +{achievement.points}
                      </span>
                      {unlocked && unlockDate && (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {format(unlockDate, 'dd.MM.yy', { locale: de })}
                        </span>
                      )}
                    </div>
                  </motion.div>

                  {/* Mobile: Show title below on mobile */}
                  <div className="md:hidden absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg text-xs font-semibold">
                      {achievement.title.replace(/[🔥✨🌟💯👑]/g, '')}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Summit Trophy at the top */}
          {stats.percentage === 100 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1, delay: 1 }}
              className="absolute"
              style={{
                left: '50%',
                top: '80px',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="relative">
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(251, 191, 36, 0.5)',
                      '0 0 60px rgba(251, 191, 36, 0.8)',
                      '0 0 30px rgba(251, 191, 36, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-yellow-200"
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                  <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-xl">
                    <p className="text-lg font-bold text-yellow-600">Gipfel erreicht!</p>
                    <p className="text-xs text-gray-500">Alle Erfolge freigeschaltet</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Climb continuation message at the top */}
          {stats.percentage < 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute"
              style={{
                left: '50%',
                top: '60px',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-2xl text-center">
                <div className="text-4xl mb-2">🏔️</div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Weiter zum Gipfel!
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Noch {stats.total - stats.unlocked} Erfolge
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Achievement Detail Modal */}
      <Modal
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        title="Erfolg Details"
      >
        {selectedAchievement && (
          <div className="text-center py-4">
            <div
              className={`
                w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center text-5xl
                ${isUnlocked(selectedAchievement.id)
                  ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                  : 'bg-gray-300 dark:bg-gray-700'
                }
              `}
            >
              {isUnlocked(selectedAchievement.id) ? selectedAchievement.badgeIcon : <Lock className="w-12 h-12 text-gray-500" />}
            </div>

            <h3 className="text-xl font-bold mb-2">{selectedAchievement.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {selectedAchievement.description}
            </p>

            <div className="flex justify-center gap-4 mb-4">
              <div className={`px-3 py-1 rounded-full ${rarityColors[selectedAchievement.rarity].bg} ${rarityColors[selectedAchievement.rarity].text}`}>
                {rarityLabels[selectedAchievement.rarity]}
              </div>
              <div className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
                +{selectedAchievement.points} Punkte
              </div>
            </div>

            {isUnlocked(selectedAchievement.id) && (
              <p className="text-green-500 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Freigeschaltet am {format(getUnlockDate(selectedAchievement.id)!, 'dd.MM.yyyy', { locale: de })}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
