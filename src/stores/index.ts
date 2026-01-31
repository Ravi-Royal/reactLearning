import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Example: Theme store
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'theme-storage',
      },
    ),
  ),
);

// Example: User store
interface UserState {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      {
        name: 'user-storage',
      },
    ),
  ),
);
