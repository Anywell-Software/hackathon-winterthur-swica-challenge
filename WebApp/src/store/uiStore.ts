// ============================================
// Zustand UI Store (Toasts, Modals, Theme)
// ============================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { Toast, ModalState } from '../types';

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  
  // Toasts
  toasts: Toast[];
  
  // Modal
  modal: ModalState;
  
  // Sidebar (mobile)
  sidebarOpen: boolean;
  
  // Loading states
  isAppLoading: boolean;
  
  // Actions
  initTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  openModal: (type: ModalState['type'], data?: unknown) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAppLoading: (loading: boolean) => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

export const useUIStore = create<UIState>()(
  persist(
    immer((set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),
      toasts: [],
      modal: { isOpen: false, type: null },
      sidebarOpen: false,
      isAppLoading: true,

      initTheme: () => {
        const { theme } = get();
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        set((state) => {
          state.resolvedTheme = resolved;
        });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(resolved);
        }
      },

      setTheme: (theme: 'light' | 'dark' | 'system') => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        
        set((state) => {
          state.theme = theme;
          state.resolvedTheme = resolved;
        });
        
        // Apply to document
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(resolved);
        }
      },

      addToast: (toast: Omit<Toast, 'id'>) => {
        const id = uuidv4();
        const newToast: Toast = { ...toast, id };
        
        set((state) => {
          state.toasts.push(newToast);
        });
        
        // Auto-remove after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
        
        return id;
      },

      removeToast: (id: string) => {
        set((state) => {
          state.toasts = state.toasts.filter((t) => t.id !== id);
        });
      },

      clearToasts: () => {
        set((state) => {
          state.toasts = [];
        });
      },

      openModal: (type: ModalState['type'], data?: unknown) => {
        set((state) => {
          state.modal = { isOpen: true, type, data };
        });
      },

      closeModal: () => {
        set((state) => {
          state.modal = { isOpen: false, type: null, data: undefined };
        });
      },

      toggleSidebar: () => {
        set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        });
      },

      setSidebarOpen: (open: boolean) => {
        set((state) => {
          state.sidebarOpen = open;
        });
      },

      setAppLoading: (loading: boolean) => {
        set((state) => {
          state.isAppLoading = loading;
        });
      },
    })),
    {
      name: 'vorsorge-ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export default useUIStore;
