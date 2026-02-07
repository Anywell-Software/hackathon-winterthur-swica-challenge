// ============================================
// Seed Data - Demo Users & Initial State
// ============================================

import { User, UserTaskInstance, UserAchievement } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays, startOfDay } from 'date-fns';

// Demo User Personas
export const DEMO_USERS: User[] = [
  {
    id: 'user-anna',
    name: 'Anna Müller',
    age: 35,
    gender: 'female',
    riskFactors: [],
    onboardingComplete: true,
    level: 8,
    totalPoints: 2450,
    currentStreak: 12,
    longestStreak: 28,
    joinedDate: subDays(new Date(), 45),
    lastActiveDate: new Date(),
    preferences: {
      theme: 'light',
      notificationsEnabled: true,
      reminderTime: '19:00',
      language: 'de',
    },
  },
  {
    id: 'user-max',
    name: 'Max Weber',
    age: 52,
    gender: 'male',
    riskFactors: ['hypertension', 'diabetes_family'],
    onboardingComplete: true,
    level: 15,
    totalPoints: 8200,
    currentStreak: 45,
    longestStreak: 45,
    joinedDate: subDays(new Date(), 120),
    lastActiveDate: new Date(),
    preferences: {
      theme: 'dark',
      notificationsEnabled: true,
      reminderTime: '20:00',
      language: 'de',
    },
  },
  {
    id: 'user-lisa',
    name: 'Lisa Schmidt',
    age: 28,
    gender: 'female',
    riskFactors: ['smoker'],
    onboardingComplete: true,
    level: 3,
    totalPoints: 450,
    currentStreak: 3,
    longestStreak: 7,
    joinedDate: subDays(new Date(), 14),
    lastActiveDate: new Date(),
    preferences: {
      theme: 'system',
      notificationsEnabled: false,
      reminderTime: '21:00',
      language: 'de',
    },
  },
];

// Default new user template
export const createDefaultUser = (name: string, age: number, gender: 'male' | 'female' | 'other'): User => ({
  id: uuidv4(),
  name,
  age,
  gender,
  riskFactors: [],
  onboardingComplete: false,
  level: 1,
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  joinedDate: new Date(),
  lastActiveDate: new Date(),
  preferences: {
    theme: 'system',
    notificationsEnabled: true,
    reminderTime: '19:00',
    language: 'de',
  },
});

// Generate initial task instances for a user based on task templates
export const generateInitialTaskInstances = (
  userId: string, 
  taskIds: string[]
): UserTaskInstance[] => {
  const today = startOfDay(new Date());
  
  return taskIds.map((taskId) => ({
    id: uuidv4(),
    oderId: userId,
    taskId,
    lastCompleted: null,
    nextDue: today, // All start as due today
    streakCount: 0,
    completionHistory: [],
    status: 'active' as const,
    customReminder: null,
    notes: '',
    snoozedUntil: null,
  }));
};

// Generate sample completion history for demo
export const generateSampleCompletions = (
  userId: string,
  taskId: string,
  count: number,
  frequencyDays: number
): UserTaskInstance => {
  const completions = [];
  let currentDate = subDays(new Date(), count * frequencyDays);
  
  for (let i = 0; i < count; i++) {
    completions.push({
      completedAt: currentDate,
      pointsEarned: Math.floor(Math.random() * 20) + 10,
      notes: '',
    });
    currentDate = addDays(currentDate, frequencyDays);
  }
  
  return {
    id: uuidv4(),
    oderId: userId,
    taskId,
    lastCompleted: completions[completions.length - 1]?.completedAt || null,
    nextDue: addDays(completions[completions.length - 1]?.completedAt || new Date(), frequencyDays),
    streakCount: count,
    completionHistory: completions,
    status: 'active',
    customReminder: null,
    notes: '',
    snoozedUntil: null,
  };
};

// Sample unlocked achievements for demo users
export const SAMPLE_ACHIEVEMENTS: UserAchievement[] = [
  {
    id: uuidv4(),
    oderId: 'user-anna',
    achievementId: 'first-task',
    unlockedAt: subDays(new Date(), 45),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-anna',
    achievementId: 'streak-7',
    unlockedAt: subDays(new Date(), 38),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-anna',
    achievementId: 'tasks-10',
    unlockedAt: subDays(new Date(), 35),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-anna',
    achievementId: 'level-5',
    unlockedAt: subDays(new Date(), 25),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-anna',
    achievementId: 'points-1k',
    unlockedAt: subDays(new Date(), 20),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-max',
    achievementId: 'first-task',
    unlockedAt: subDays(new Date(), 120),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-max',
    achievementId: 'streak-7',
    unlockedAt: subDays(new Date(), 113),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-max',
    achievementId: 'streak-14',
    unlockedAt: subDays(new Date(), 106),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-max',
    achievementId: 'streak-30',
    unlockedAt: subDays(new Date(), 90),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-max',
    achievementId: 'level-10',
    unlockedAt: subDays(new Date(), 60),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-max',
    achievementId: 'points-5k',
    unlockedAt: subDays(new Date(), 40),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-max',
    achievementId: 'tasks-100',
    unlockedAt: subDays(new Date(), 30),
    notified: true,
  },
  {
    id: uuidv4(),
    oderId: 'user-lisa',
    achievementId: 'first-task',
    unlockedAt: subDays(new Date(), 14),
    notified: true,
  },
];

export default {
  DEMO_USERS,
  createDefaultUser,
  generateInitialTaskInstances,
  SAMPLE_ACHIEVEMENTS,
};
