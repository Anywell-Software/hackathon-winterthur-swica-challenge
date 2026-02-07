// ============================================
// Zustand Task Store (No Persistence - Prototyping Mode)
// ============================================

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import {
  UserTaskInstance,
  TaskTemplate,
  TaskCompletion,
  TaskStatus,
} from '../types';
import { TASK_TEMPLATES } from '../data';
import {
  calculateNextDueDate,
  calculateTaskPoints,
  getTaskStatus,
  filterTasksForUser,
} from '../services/calculators';
import { startOfDay, addDays } from 'date-fns';
import { useUserStore } from './userStore';

interface TaskState {
  taskInstances: UserTaskInstance[];
  taskTemplates: TaskTemplate[];
  isLoading: boolean;
  error: string | null;

  // Filters
  searchQuery: string;
  activeTab: 'all' | 'today' | 'week' | 'overdue';

  // Actions
  initializeTasks: (userId: string) => Promise<void>;
  completeTask: (instanceId: string, notes?: string) => Promise<{ points: number; bonusPoints: number }>;
  undoCompletion: (instanceId: string) => void;
  updateTaskNotes: (instanceId: string, notes: string) => void;
  setTaskStatus: (instanceId: string, status: TaskStatus) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: 'all' | 'today' | 'week' | 'overdue') => void;

  // Getters
  getTaskById: (taskId: string) => TaskTemplate | undefined;
  getInstanceById: (instanceId: string) => UserTaskInstance | undefined;
  getTodaysTasks: () => UserTaskInstance[];
  getUpcomingTasks: (days: number) => UserTaskInstance[];
  getOverdueTasks: () => UserTaskInstance[];
  getFilteredTasks: () => UserTaskInstance[];
}

export const useTaskStore = create<TaskState>()(
  immer((set, get) => ({
    taskInstances: [],
    taskTemplates: TASK_TEMPLATES,
    isLoading: true,
    error: null,
    searchQuery: '',
    activeTab: 'today',

    initializeTasks: async (userId: string) => {
      set((state) => {
        state.isLoading = true;
      });

      // Always create fresh instances for prototyping (no persistence)
      const user = useUserStore.getState().currentUser;
      const filteredTasks = user
        ? filterTasksForUser(TASK_TEMPLATES, user)
        : TASK_TEMPLATES;

      const today = startOfDay(new Date());
      const instances = filteredTasks.map((task) => ({
        id: uuidv4(),
        oderId: userId,
        taskId: task.id,
        lastCompleted: null,
        nextDue: today,
        streakCount: 0,
        completionHistory: [],
        status: 'active' as const,
        customReminder: null,
        notes: '',
        snoozedUntil: null,
      }));

      set((state) => {
        state.taskInstances = instances;
        state.isLoading = false;
      });
    },

    completeTask: async (instanceId: string, notes?: string) => {
      const instance = get().taskInstances.find((t) => t.id === instanceId);
      const template = get().taskTemplates.find((t) => t.id === instance?.taskId);

      if (!instance || !template) {
        return { points: 0, bonusPoints: 0 };
      }

      const user = useUserStore.getState().currentUser;
      const currentStreak = user?.currentStreak || 0;

      // Calculate points
      const { total, bonus } = calculateTaskPoints(
        template.points,
        currentStreak,
        false // isEarly - could check time
      );

      const completion: TaskCompletion = {
        completedAt: new Date(),
        pointsEarned: total,
        notes,
      };

      const nextDue = calculateNextDueDate(
        template.frequency,
        new Date(),
        template.frequencyValue
      );

      set((state) => {
        const idx = state.taskInstances.findIndex((t) => t.id === instanceId);
        if (idx !== -1) {
          state.taskInstances[idx].lastCompleted = new Date();
          state.taskInstances[idx].nextDue = nextDue;
          state.taskInstances[idx].streakCount += 1;
          state.taskInstances[idx].completionHistory.push(completion);
        }
      });

      // Update user points and streak
      useUserStore.getState().addPoints(total);
      useUserStore.getState().updateStreak(currentStreak + 1);

      return { points: total, bonusPoints: bonus };
    },

    undoCompletion: (instanceId: string) => {
      set((state) => {
        const idx = state.taskInstances.findIndex((t) => t.id === instanceId);
        if (idx !== -1 && state.taskInstances[idx].completionHistory.length > 0) {
          const lastCompletion = state.taskInstances[idx].completionHistory.pop();

          // Revert points
          if (lastCompletion) {
            useUserStore.getState().addPoints(-lastCompletion.pointsEarned);
          }

          // Reset last completed
          const history = state.taskInstances[idx].completionHistory;
          state.taskInstances[idx].lastCompleted =
            history.length > 0 ? history[history.length - 1].completedAt : null;

          state.taskInstances[idx].streakCount = Math.max(0, state.taskInstances[idx].streakCount - 1);
        }
      });
    },

    updateTaskNotes: (instanceId: string, notes: string) => {
      set((state) => {
        const idx = state.taskInstances.findIndex((t) => t.id === instanceId);
        if (idx !== -1) {
          state.taskInstances[idx].notes = notes;
        }
      });
    },

    setTaskStatus: (instanceId: string, status: TaskStatus) => {
      set((state) => {
        const idx = state.taskInstances.findIndex((t) => t.id === instanceId);
        if (idx !== -1) {
          state.taskInstances[idx].status = status;
        }
      });
    },

    setSearchQuery: (query: string) => {
      set((state) => {
        state.searchQuery = query;
      });
    },

    setActiveTab: (tab: 'all' | 'today' | 'week' | 'overdue') => {
      set((state) => {
        state.activeTab = tab;
      });
    },

    getTaskById: (taskId: string) => {
      return get().taskTemplates.find((t) => t.id === taskId);
    },

    getInstanceById: (instanceId: string) => {
      return get().taskInstances.find((t) => t.id === instanceId);
    },

    getTodaysTasks: () => {
      return get().taskInstances.filter((instance) => {
        if (instance.status !== 'active') return false;
        const status = getTaskStatus(instance);
        return status === 'due_today' || status === 'completed_today' || status === 'overdue';
      });
    },

    getUpcomingTasks: (days: number) => {
      const today = startOfDay(new Date());
      const futureDate = addDays(today, days);

      return get().taskInstances.filter((instance) => {
        if (instance.status !== 'active') return false;
        const nextDue = new Date(instance.nextDue);
        return nextDue > today && nextDue <= futureDate;
      });
    },

    getOverdueTasks: () => {
      return get().taskInstances.filter((instance) => {
        if (instance.status !== 'active') return false;
        return getTaskStatus(instance) === 'overdue';
      });
    },

    getFilteredTasks: () => {
      const { taskInstances, taskTemplates, searchQuery, activeTab } = get();

      let filtered = taskInstances.filter((inst) => inst.status === 'active');

      // Filter by tab
      switch (activeTab) {
        case 'today':
          filtered = filtered.filter((inst) => {
            const status = getTaskStatus(inst);
            return status === 'due_today' || status === 'completed_today' || status === 'overdue';
          });
          break;
        case 'week':
          const weekFromNow = addDays(new Date(), 7);
          filtered = filtered.filter((inst) => {
            const nextDue = new Date(inst.nextDue);
            return nextDue <= weekFromNow;
          });
          break;
        case 'overdue':
          filtered = filtered.filter((inst) => getTaskStatus(inst) === 'overdue');
          break;
      }

      // Filter by search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((inst) => {
          const template = taskTemplates.find((t) => t.id === inst.taskId);
          return template?.title.toLowerCase().includes(query) ||
            template?.description.toLowerCase().includes(query);
        });
      }

      return filtered;
    },
  }))
);

export default useTaskStore;
