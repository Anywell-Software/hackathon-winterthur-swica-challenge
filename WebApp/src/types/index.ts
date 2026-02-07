// ============================================
// Hack Winterthur 2026 VorsorgeGuide - TypeScript Types
// ============================================

// === CATEGORY TYPES ===
export type TaskCategory = 
  | 'medical' 
  | 'mental_health' 
  | 'fitness' 
  | 'social' 
  | 'financial' 
  | 'nutrition';

export type TaskFrequency = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'semi_annual' 
  | 'annual' 
  | 'multi_year';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type Gender = 'male' | 'female' | 'other';

export type AchievementCategory = 'consistency' | 'milestone' | 'category_mastery';

export type TaskStatus = 'active' | 'pending' | 'completed_today' | 'paused' | 'archived';

// === HEALTH RISK TYPES ===
export type HealthRiskType = 
  | 'heart_disease'
  | 'stroke' 
  | 'diabetes'
  | 'cancer'
  | 'depression'
  | 'dementia'
  | 'osteoporosis'
  | 'obesity';

export interface HealthRisk {
  id: HealthRiskType;
  name: string;
  icon: string;
  color: string;
  baseRisk: number; // Base risk percentage (0-100)
  description: string;
}

export interface RiskReduction {
  riskType: HealthRiskType;
  reductionPercent: number; // How much this task reduces risk (e.g., 2 = 2%)
  explanation: string;
}

// === USER MODEL ===
export interface User {
  id: string;
  name: string;
  age: number; // 18-99
  gender: Gender;
  riskFactors: string[]; // ['diabetes_family', 'hypertension', 'smoker']
  onboardingComplete: boolean;
  level: number; // 1-100
  totalPoints: number;
  currentStreak: number; // days
  longestStreak: number;
  joinedDate: Date;
  lastActiveDate: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  reminderTime: string; // "19:00"
  language: 'de' | 'fr' | 'it' | 'en';
}

// === TASK TEMPLATE (50+ required) ===
export interface TaskTemplate {
  id: string;
  title: string; // "Zahnarzt-Kontrolle"
  category: TaskCategory;
  frequency: TaskFrequency;
  frequencyValue?: number; // For multi_year: 2 = every 2 years
  duration: string; // "60min"
  priority: TaskPriority;
  ageRange: [number, number]; // [18, 99]
  genderSpecific: Gender | null; // null = all genders
  description: string;
  researchBenefits: string[];
  howToComplete: string;
  externalLinks: { title: string; url: string }[];
  points: number; // 10-500
  icon: string; // emoji
  tips: string[];
  relatedAchievements: string[];
  riskFactorRelevant?: string[]; // relevant risk factors
  riskReductions?: RiskReduction[]; // What health risks this task reduces
}

// === USER TASK INSTANCE ===
export interface UserTaskInstance {
  id: string;
  oderId: string;
  taskId: string;
  lastCompleted: Date | null;
  nextDue: Date;
  streakCount: number;
  completionHistory: TaskCompletion[];
  status: TaskStatus;
  customReminder: string | null; // "19:00"
  notes: string;
  snoozedUntil: Date | null;
}

export interface TaskCompletion {
  completedAt: Date;
  pointsEarned: number;
  notes?: string;
  duration?: number; // minutes
}

// === ACHIEVEMENT (30+ required) ===
export interface Achievement {
  id: string;
  title: string; // "🔥 7-Day Streak"
  description: string;
  badgeIcon: string; // emoji
  category: AchievementCategory;
  unlockCondition: AchievementCondition;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  hidden: boolean;
}

export type AchievementCondition = 
  | { type: 'streak'; days: number }
  | { type: 'total_tasks'; count: number }
  | { type: 'total_points'; points: number }
  | { type: 'level'; level: number }
  | { type: 'category_tasks'; category: TaskCategory; count: number }
  | { type: 'category_streak'; category: TaskCategory; days: number }
  | { type: 'perfect_week' }
  | { type: 'perfect_month' }
  | { type: 'early_bird'; count: number } // tasks before 9am
  | { type: 'all_categories_day' };

export interface UserAchievement {
  id: string;
  oderId: string;
  achievementId: string;
  unlockedAt: Date;
  notified: boolean;
}

// === STATISTICS ===
export interface DailyStats {
  date: string; // "2026-02-05"
  tasksCompleted: number;
  pointsEarned: number;
  categoriesCompleted: Record<TaskCategory, number>;
  streakMaintained: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  totalTasks: number;
  totalPoints: number;
  categoryBreakdown: Record<TaskCategory, number>;
  averageDaily: number;
}

// === UI STATE ===
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'completion' | 'achievement' | 'snooze' | 'settings' | null;
  data?: unknown;
}

// === CATEGORY METADATA ===
export interface CategoryMeta {
  id: TaskCategory;
  name: string;
  label: string; // Alias for name
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

export const CATEGORY_META: Record<TaskCategory, CategoryMeta> = {
  medical: {
    id: 'medical',
    name: 'Medizinisch',
    label: 'Medizinisch',
    icon: '🏥',
    color: '#0ea5e9',
    bgColor: 'bg-sky-500',
    description: 'Vorsorgeuntersuchungen & Gesundheitschecks',
  },
  mental_health: {
    id: 'mental_health',
    name: 'Mental',
    label: 'Mental',
    icon: '🧠',
    color: '#8b5cf6',
    bgColor: 'bg-violet-500',
    description: 'Psychische Gesundheit & Wohlbefinden',
  },
  fitness: {
    id: 'fitness',
    name: 'Fitness',
    label: 'Fitness',
    icon: '💪',
    color: '#f97316',
    bgColor: 'bg-orange-500',
    description: 'Bewegung & körperliche Aktivität',
  },
  social: {
    id: 'social',
    name: 'Sozial',
    label: 'Sozial',
    icon: '🤝',
    color: '#ec4899',
    bgColor: 'bg-pink-500',
    description: 'Soziale Kontakte & Beziehungen',
  },
  financial: {
    id: 'financial',
    name: 'Finanzen',
    label: 'Finanzen',
    icon: '💰',
    color: '#22c55e',
    bgColor: 'bg-green-500',
    description: 'Finanzielle Gesundheit & Vorsorge',
  },
  nutrition: {
    id: 'nutrition',
    name: 'Ernährung',
    label: 'Ernährung',
    icon: '🍎',
    color: '#eab308',
    bgColor: 'bg-yellow-500',
    description: 'Gesunde Ernährung & Hydration',
  },
};

// === CONSTANTS ===
export const LEVEL_FORMULA = {
  calculateLevel: (points: number): number => Math.floor(Math.sqrt(points / 100)) + 1,
  pointsForLevel: (level: number): number => Math.pow(level - 1, 2) * 100,
  pointsToNextLevel: (currentPoints: number, currentLevel: number): number => {
    const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
    return nextLevelPoints - currentPoints;
  },
};

export const STREAK_BONUSES = {
  7: 0.1, // +10%
  30: 0.25, // +25%
  100: 0.5, // +50%
} as const;

export const FREQUENCY_DAYS: Record<TaskFrequency, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  quarterly: 90,
  semi_annual: 180,
  annual: 365,
  multi_year: 730, // default 2 years, overridden by frequencyValue
};
