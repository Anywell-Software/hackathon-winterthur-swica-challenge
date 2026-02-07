// ============================================
// Zustand User Store (No Persistence - Prototyping Mode)
// ============================================

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User, UserPreferences, Gender } from '../types';
import { createDefaultUser, DEMO_USERS } from '../data';
import { calculateLevel } from '../services/calculators';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeUser: () => Promise<void>;
  createUser: (name: string, age: number, gender: Gender) => Promise<void>;
  loadDemoUser: (userId: string) => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addPoints: (points: number) => void;
  updateStreak: (streakDays: number) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  immer((set, get) => ({
    currentUser: null,
    isLoading: true,
    error: null,

    initializeUser: async () => {
      set((state) => {
        state.isLoading = true;
      });
      
      // Always load demo user for prototyping (no persistence)
      set((state) => {
        state.currentUser = { ...DEMO_USERS[0] };
        state.isLoading = false;
      });
    },

    createUser: async (name: string, age: number, gender: Gender) => {
      const newUser = createDefaultUser(name, age, gender);
      set((state) => {
        state.currentUser = newUser;
      });
    },

    loadDemoUser: (userId: string) => {
      const demoUser = DEMO_USERS.find((u) => u.id === userId);
      if (demoUser) {
        set((state) => {
          state.currentUser = { ...demoUser };
        });
      }
    },

    updateUser: (updates: Partial<User>) => {
      set((state) => {
        if (state.currentUser) {
          Object.assign(state.currentUser, updates);
          state.currentUser.lastActiveDate = new Date();
        }
      });
    },

    updatePreferences: (prefs: Partial<UserPreferences>) => {
      set((state) => {
        if (state.currentUser) {
          state.currentUser.preferences = {
            ...state.currentUser.preferences,
            ...prefs,
          };
        }
      });
    },

    addPoints: (points: number) => {
      set((state) => {
        if (state.currentUser) {
          state.currentUser.totalPoints += points;
          state.currentUser.level = calculateLevel(state.currentUser.totalPoints);
          state.currentUser.lastActiveDate = new Date();
        }
      });
    },

    updateStreak: (streakDays: number) => {
      set((state) => {
        if (state.currentUser) {
          state.currentUser.currentStreak = streakDays;
          if (streakDays > state.currentUser.longestStreak) {
            state.currentUser.longestStreak = streakDays;
          }
        }
      });
    },

    resetUser: () => {
      set((state) => {
        state.currentUser = null;
      });
    },
  }))
);

export default useUserStore;
