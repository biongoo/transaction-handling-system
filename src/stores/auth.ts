import { queryClient } from 'index';
import { User } from 'types';
import create from 'zustand';
import { persist } from 'zustand/middleware';

type Auth = {
  user?: User;
  token?: string;
  isRefreshing: boolean;
  setEmail: (email: string) => void;
  logOut: () => void;
  logIn: (token: string, user: User) => void;
};

export const useAuthStore = create<Auth>()(
  persist(
    (set, get) => ({
      token: undefined,

      user: undefined,

      isRefreshing: false,

      setEmail: (email: string) => {
        const current = get().user;

        if (!current) {
          return;
        }

        set(() => ({ user: { ...current, email } }));
      },

      logIn: (token: string, user: User) => {
        set(() => ({ token, user }));
      },

      logOut: () => {
        set(() => ({
          token: undefined,
          user: undefined,
          isRefreshing: false,
        }));

        queryClient.removeQueries();
      },
    }),
    {
      name: 'auth',

      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
