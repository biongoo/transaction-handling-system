import { AlertColor } from '@mui/material';
import create from 'zustand';

type Alert = {
  open: boolean;
  time?: number;
  body?: string;
  title?: string;
  variant?: AlertColor;
};

type Ui = {
  alert: Alert;
  hideAlert: () => void;
  showAlert: (payload: Omit<Alert, 'open'>) => void;
};

export const useUiStore = create<Ui>()((set) => ({
  alert: { open: false },

  showAlert: (payload) => {
    if (!payload.body && !payload.title) {
      return;
    }

    set(() => ({
      alert: {
        open: true,
        body: payload.body,
        title: payload.title,
        time: (payload.time ?? 6) * 1000,
        variant: payload.variant ?? 'success',
      },
    }));
  },

  hideAlert: () => {
    set((ui) => ({
      alert: {
        ...ui.alert,
        open: false,
      },
    }));
  },
}));
