// ============================================
// Business Logic Calculators
// ============================================

import { 
  TaskFrequency, 
  TaskTemplate, 
  UserTaskInstance, 
  User, 
  STREAK_BONUSES,
  LEVEL_FORMULA,
  Achievement,
  AchievementCondition,
  UserAchievement,
  TaskCategory,
} from '../../types';
import { addDays, addMonths, addYears, differenceInDays, isToday, isBefore, startOfDay } from 'date-fns';

// ============================================
// FREQUENCY CALCULATOR
// ============================================
export const calculateNextDueDate = (
  frequency: TaskFrequency,
  fromDate: Date = new Date(),
  frequencyValue?: number
): Date => {
  const from = startOfDay(fromDate);
  
  switch (frequency) {
    case 'daily':
      return addDays(from, 1);
    case 'weekly':
      return addDays(from, 7);
    case 'monthly':
      return addMonths(from, 1);
    case 'quarterly':
      return addMonths(from, 3);
    case 'semi_annual':
      return addMonths(from, 6);
    case 'annual':
      return addYears(from, 1);
    case 'multi_year':
      return addYears(from, frequencyValue || 2);
    default:
      return addDays(from, 1);
  }
};

// ============================================
// POINTS CALCULATOR
// ============================================
export const calculateTaskPoints = (
  basePoints: number,
  currentStreak: number,
  isEarly: boolean = false
): { total: number; bonus: number; breakdown: string[] } => {
  let bonus = 0;
  const breakdown: string[] = [`Basis: ${basePoints} Punkte`];
  
  // Streak bonuses
  if (currentStreak >= 100) {
    bonus += Math.floor(basePoints * STREAK_BONUSES[100]);
    breakdown.push(`100+ Tage Streak: +${Math.floor(basePoints * STREAK_BONUSES[100])} (+50%)`);
  } else if (currentStreak >= 30) {
    bonus += Math.floor(basePoints * STREAK_BONUSES[30]);
    breakdown.push(`30+ Tage Streak: +${Math.floor(basePoints * STREAK_BONUSES[30])} (+25%)`);
  } else if (currentStreak >= 7) {
    bonus += Math.floor(basePoints * STREAK_BONUSES[7]);
    breakdown.push(`7+ Tage Streak: +${Math.floor(basePoints * STREAK_BONUSES[7])} (+10%)`);
  }
  
  // Early completion bonus
  if (isEarly) {
    bonus += 5;
    breakdown.push('Früh erledigt: +5');
  }
  
  return {
    total: basePoints + bonus,
    bonus,
    breakdown,
  };
};

// ============================================
// LEVEL CALCULATOR
// ============================================
export const calculateLevel = (totalPoints: number): number => {
  return LEVEL_FORMULA.calculateLevel(totalPoints);
};

export const calculatePointsToNextLevel = (totalPoints: number): number => {
  const currentLevel = calculateLevel(totalPoints);
  return LEVEL_FORMULA.pointsToNextLevel(totalPoints, currentLevel);
};

export const calculateLevelProgress = (totalPoints: number): number => {
  const currentLevel = calculateLevel(totalPoints);
  const currentLevelPoints = LEVEL_FORMULA.pointsForLevel(currentLevel);
  const nextLevelPoints = LEVEL_FORMULA.pointsForLevel(currentLevel + 1);
  const pointsInCurrentLevel = totalPoints - currentLevelPoints;
  const pointsNeededForLevel = nextLevelPoints - currentLevelPoints;
  
  return Math.min(100, Math.floor((pointsInCurrentLevel / pointsNeededForLevel) * 100));
};

// ============================================
// STREAK CALCULATOR
// ============================================
export const calculateStreak = (
  completionHistory: { completedAt: Date }[],
  frequency: TaskFrequency
): number => {
  if (completionHistory.length === 0) return 0;
  
  const sorted = [...completionHistory].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  
  let streak = 0;
  let expectedDate = startOfDay(new Date());
  
  // For daily tasks, check consecutive days
  if (frequency === 'daily') {
    for (const completion of sorted) {
      const completionDate = startOfDay(new Date(completion.completedAt));
      const diff = differenceInDays(expectedDate, completionDate);
      
      if (diff === 0 || diff === 1) {
        streak++;
        expectedDate = completionDate;
      } else {
        break;
      }
    }
  } else {
    // For non-daily tasks, count consecutive completions on schedule
    streak = sorted.length;
  }
  
  return streak;
};

export const isStreakInDanger = (
  lastCompleted: Date | null,
  frequency: TaskFrequency
): boolean => {
  if (!lastCompleted || frequency !== 'daily') return false;
  
  const now = new Date();
  const last = new Date(lastCompleted);
  const diff = differenceInDays(now, last);
  
  // Streak is in danger if it's been more than 20 hours since last completion
  // and we haven't completed today
  return diff >= 1 && !isToday(last);
};

// ============================================
// TASK FILTERING & PERSONALIZATION
// ============================================
export const filterTasksForUser = (
  tasks: TaskTemplate[],
  user: User
): TaskTemplate[] => {
  return tasks.filter((task) => {
    // Filter by age range
    if (user.age < task.ageRange[0] || user.age > task.ageRange[1]) {
      return false;
    }
    
    // Filter by gender
    if (task.genderSpecific && task.genderSpecific !== user.gender) {
      return false;
    }
    
    return true;
  });
};

export const prioritizeTasks = (
  tasks: TaskTemplate[],
  user: User
): TaskTemplate[] => {
  return [...tasks].sort((a, b) => {
    // Priority order: critical > high > medium > low
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    
    // First sort by priority
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by risk factor relevance
    const aRelevant = a.riskFactorRelevant?.some((rf) => user.riskFactors.includes(rf)) ?? false;
    const bRelevant = b.riskFactorRelevant?.some((rf) => user.riskFactors.includes(rf)) ?? false;
    
    if (aRelevant && !bRelevant) return -1;
    if (!aRelevant && bRelevant) return 1;
    
    // Finally by points (higher first)
    return b.points - a.points;
  });
};

// ============================================
// TASK STATUS HELPERS
// ============================================
export const getTaskStatus = (
  instance: UserTaskInstance
): 'completed_today' | 'due_today' | 'overdue' | 'upcoming' | 'snoozed' => {
  const today = startOfDay(new Date());
  const nextDue = startOfDay(new Date(instance.nextDue));
  
  // Check if snoozed
  if (instance.snoozedUntil && isBefore(today, new Date(instance.snoozedUntil))) {
    return 'snoozed';
  }
  
  // Check if completed today
  if (instance.lastCompleted && isToday(new Date(instance.lastCompleted))) {
    return 'completed_today';
  }
  
  // Check if overdue
  if (isBefore(nextDue, today)) {
    return 'overdue';
  }
  
  // Check if due today
  if (differenceInDays(nextDue, today) === 0) {
    return 'due_today';
  }
  
  return 'upcoming';
};

export const getDaysUntilDue = (nextDue: Date): number => {
  return differenceInDays(startOfDay(new Date(nextDue)), startOfDay(new Date()));
};

// ============================================
// ACHIEVEMENT CHECKER
// ============================================
export const checkAchievementCondition = (
  condition: AchievementCondition,
  user: User,
  taskInstances: UserTaskInstance[],
  unlockedAchievements: UserAchievement[]
): boolean => {
  switch (condition.type) {
    case 'streak':
      return user.currentStreak >= condition.days;
      
    case 'total_tasks': {
      const totalCompletions = taskInstances.reduce(
        (sum, inst) => sum + inst.completionHistory.length,
        0
      );
      return totalCompletions >= condition.count;
    }
    
    case 'total_points':
      return user.totalPoints >= condition.points;
      
    case 'level':
      return user.level >= condition.level;
      
    case 'category_tasks': {
      // This would need task template data - simplified for now
      return false; // Implement with full task data
    }
    
    case 'perfect_week':
      // Simplified: check if all daily tasks completed for 7 days
      return user.currentStreak >= 7;
      
    case 'perfect_month':
      return user.currentStreak >= 30;
      
    case 'early_bird':
      // Would need completion time tracking
      return false;
      
    case 'all_categories_day':
      // Would need daily category tracking
      return false;
      
    default:
      return false;
  }
};

export const getNewlyUnlockedAchievements = (
  achievements: Achievement[],
  user: User,
  taskInstances: UserTaskInstance[],
  alreadyUnlocked: UserAchievement[]
): Achievement[] => {
  const unlockedIds = new Set(alreadyUnlocked.map((ua) => ua.achievementId));
  
  return achievements.filter((achievement) => {
    // Skip already unlocked
    if (unlockedIds.has(achievement.id)) return false;
    
    // Check if condition is met
    return checkAchievementCondition(
      achievement.unlockCondition,
      user,
      taskInstances,
      alreadyUnlocked
    );
  });
};

// ============================================
// CATEGORY PROGRESS CALCULATOR
// ============================================
export const calculateCategoryProgress = (
  taskInstances: UserTaskInstance[],
  taskTemplates: TaskTemplate[]
): Record<TaskCategory, { completed: number; total: number; percentage: number }> => {
  const categories: TaskCategory[] = ['medical', 'mental_health', 'fitness', 'social', 'financial', 'nutrition'];
  
  const result = {} as Record<TaskCategory, { completed: number; total: number; percentage: number }>;
  
  for (const category of categories) {
    const categoryTasks = taskTemplates.filter((t) => t.category === category);
    const categoryInstances = taskInstances.filter((inst) => 
      categoryTasks.some((t) => t.id === inst.taskId)
    );
    
    const completedToday = categoryInstances.filter((inst) => 
      inst.lastCompleted && isToday(new Date(inst.lastCompleted))
    ).length;
    
    const total = categoryInstances.length || 1;
    
    result[category] = {
      completed: completedToday,
      total,
      percentage: Math.round((completedToday / total) * 100),
    };
  }
  
  return result;
};
