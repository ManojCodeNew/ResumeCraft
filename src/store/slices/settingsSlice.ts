import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppSettings {
  defaultTemplateId: string;
  defaultPageSize: 'A4';
  filenameFormat: 'name-role' | 'name-resume' | 'title';
  autoSaveDelayMs: number;
}

const SETTINGS_STORAGE_KEY = 'resumeforge_settings';

const loadInitialSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore localStorage read errors
  }

  return {
    defaultTemplateId: 'ats-classic',
    defaultPageSize: 'A4',
    filenameFormat: 'name-role',
    autoSaveDelayMs: 1000,
  };
};

const initialState: AppSettings = loadInitialSettings();

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      Object.assign(state, action.payload);
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.error('Failed to save settings to localStorage:', err);
      }
    },
    resetSettings: () => {
      try {
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear settings from localStorage:', err);
      }
      return {
        defaultTemplateId: 'ats-classic',
        defaultPageSize: 'A4' as const,
        filenameFormat: 'name-role' as const,
        autoSaveDelayMs: 1000,
      };
    },
  },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
