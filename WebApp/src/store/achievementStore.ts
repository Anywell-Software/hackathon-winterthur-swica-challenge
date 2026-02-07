// ============================================
// Zustand Achievement Store (No Persistence - Prototyping Mode)
// ============================================

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { Achievement, UserAchievement } from '../types';
import { ACHIEVEMENTS } from '../data';
import { getNewlyUnlockedAchievements } from '../services/calculators';
import { useUserStore } from './userStore';
import { useTaskStore } from './taskStore';

interface AchievementState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  pendingUnlocks: Achievement[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeAchievements: (userId: string) => Promise<void>;
  checkForNewAchievements: () => Achievement[];
  unlockAchievement: (achievementId: string) => Promise<void>;
  markNotified: (achievementId: string) => void;
  clearPendingUnlocks: () => void;
  
  // Getters
  getUnlockedAchievements: () => Achievement[];
  getLockedAchievements: () => Achievement[];
  getAchievementProgress: (achievementId: string) => number;
  getTotalAchievementPoints: () => number;
}

export const useAchievementStore = create<AchievementState>()(
  immer((set, get) => ({
    achievements: ACHIEVEMENTS,
    userAchievements: [],
    pendingUnlocks: [],
    isLoading: true,
    error: null,

    initializeAchievements: async (userId: string) => {
      set((state) => {
        state.isLoading = true;
      });
      
      // No persistence - start fresh for prototyping
      set((state) => {
        state.userAchievements = [];
        state.isLoading = false;
      });
    },

    checkForNewAchievements: () => {
      const user = useUserStore.getState().currentUser;
      const taskInstances = useTaskStore.getState().taskInstances;
      const { achievements, userAchievements } = get();
      
      if (!user) return [];
      
      const newlyUnlocked = getNewlyUnlockedAchievements(
        achievements,
        user,
        taskInstances,
        userAchievements
      );
      
      if (newlyUnlocked.length > 0) {
        // Auto-unlock new achievements
        newlyUnlocked.forEach((achievement) => {
          get().unlockAchievement(achievement.id);
        });
        
        set((state) => {
          state.pendingUnlocks = [...state.pendingUnlocks, ...newlyUnlocked];
        });
      }
      
      return newlyUnlocked;
    },

    unlockAchievement: async (achievementId: string) => {
      const user = useUserStore.getState().currentUser;
      const achievement = get().achievements.find((a) => a.id === achievementId);
      
      if (!user || !achievement) return;
      
      // Check if already unlocked
      if (get().userAchievements.some((ua) => ua.achievementId === achievementId)) {
        return;
      }
      
      const userAchievement: UserAchievement = {
        id: uuidv4(),
        oderId: user.id,
        achievementId,
        unlockedAt: new Date(),
        notified: false,
      };
      
      set((state) => {
        state.userAchievements.push(userAchievement);
      });
      
      // Add achievement points to user
      useUserStore.getState().addPoints(achievement.points);
    },

    markNotified: (achievementId: string) => {
      set((state) => {
        const idx = state.userAchievements.findIndex(
          (ua) => ua.achievementId === achievementId
        );
        if (idx !== -1) {
          state.userAchievements[idx].notified = true;
        }
      });
    },

    clearPendingUnlocks: () => {
      set((state) => {
        state.pendingUnlocks = [];
      });
    },

    getUnlockedAchievements: () => {
      const { achievements, userAchievements } = get();
      const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));
      return achievements.filter((a) => unlockedIds.has(a.id));
    },

    getLockedAchievements: () => {
      const { achievements, userAchievements } = get();
      const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));
      return achievements.filter((a) => !unlockedIds.has(a.id) && !a.hidden);
    },

    getAchievementProgress: (achievementId: string) => {
      const achievement = get().achievements.find((a) => a.id === achievementId);
      const user = useUserStore.getState().currentUser;
      
      if (!achievement || !user) return 0;
      
      const condition = achievement.unlockCondition;
      
      switch (condition.type) {
        case 'streak':
          return Math.min(100, Math.round((user.currentStreak / condition.days) * 100));
        case 'total_points':
          return Math.min(100, Math.round((user.totalPoints / condition.points) * 100));
        case 'level':
          return Math.min(100, Math.round((user.level / condition.level) * 100));
        case 'total_tasks': {
          const totalCompletions = useTaskStore.getState().taskInstances.reduce(
            (sum, inst) => sum + inst.completionHistory.length,
            0
          );
          return Math.min(100, Math.round((totalCompletions / condition.count) * 100));
        }
        default:
          return 0;
      }
    },

    getTotalAchievementPoints: () => {
      const { achievements, userAchievements } = get();
      const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));
      
      return achievements
        .filter((a) => unlockedIds.has(a.id))
        .reduce((sum, a) => sum + a.points, 0);
    },
  }))
);

export default useAchievementStore;
