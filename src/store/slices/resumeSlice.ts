import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PersonalInfo, ResumeDocument, ResumeSection } from '@/types/resume';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ResumeState {
  currentResume: ResumeDocument | null;
  saveStatus: SaveStatus;
  isDirty: boolean;
  lastSavedAt: string | null;
  errorMessage: string | null;
  past: ResumeDocument[];
  future: ResumeDocument[];
}

const initialState: ResumeState = {
  currentResume: null,
  saveStatus: 'idle',
  isDirty: false,
  lastSavedAt: null,
  errorMessage: null,
  past: [],
  future: [],
};

const MAX_HISTORY = 20;

function pushHistory(state: ResumeState) {
  if (!state.currentResume) return;
  state.past.push(JSON.parse(JSON.stringify(state.currentResume)));
  if (state.past.length > MAX_HISTORY) {
    state.past.shift();
  }
  state.future = []; // clear redo on new change
}

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setCurrentResume: (state, action: PayloadAction<ResumeDocument>) => {
      state.currentResume = action.payload;
      state.saveStatus = 'saved';
      state.isDirty = false;
      state.errorMessage = null;
      state.past = [];
      state.future = [];
    },

    updateResumeTitle: (state, action: PayloadAction<string>) => {
      if (!state.currentResume) return;
      pushHistory(state);
      state.currentResume.title = action.payload;
      state.currentResume.updatedAt = new Date().toISOString();
      state.isDirty = true;
      state.saveStatus = 'idle';
    },

    updateTargetRole: (state, action: PayloadAction<string>) => {
      if (!state.currentResume) return;
      pushHistory(state);
      state.currentResume.targetRole = action.payload;
      state.currentResume.updatedAt = new Date().toISOString();
      state.isDirty = true;
      state.saveStatus = 'idle';
    },

    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      if (!state.currentResume) return;
      pushHistory(state);
      state.currentResume.personalInfo = {
        ...state.currentResume.personalInfo,
        ...action.payload,
      };
      state.currentResume.updatedAt = new Date().toISOString();
      state.isDirty = true;
      state.saveStatus = 'idle';
    },

    setTemplateId: (state, action: PayloadAction<{ templateId: string; version?: number }>) => {
      if (!state.currentResume) return;
      pushHistory(state);
      state.currentResume.templateId = action.payload.templateId;
      if (action.payload.version) {
        state.currentResume.templateVersion = action.payload.version;
      }
      state.currentResume.updatedAt = new Date().toISOString();
      state.isDirty = true;
      state.saveStatus = 'idle';
    },

    toggleSectionVisibility: (state, action: PayloadAction<string>) => {
      if (!state.currentResume) return;
      const section = state.currentResume.sections.find((s) => s.id === action.payload);
      if (section) {
        pushHistory(state);
        section.visible = !section.visible;
        state.currentResume.updatedAt = new Date().toISOString();
        state.isDirty = true;
        state.saveStatus = 'idle';
      }
    },

    updateSectionTitle: (state, action: PayloadAction<{ sectionId: string; title: string }>) => {
      if (!state.currentResume) return;
      const section = state.currentResume.sections.find((s) => s.id === action.payload.sectionId);
      if (section) {
        pushHistory(state);
        section.title = action.payload.title;
        state.currentResume.updatedAt = new Date().toISOString();
        state.isDirty = true;
        state.saveStatus = 'idle';
      }
    },

    reorderSections: (state, action: PayloadAction<ResumeSection[]>) => {
      if (!state.currentResume) return;
      pushHistory(state);
      state.currentResume.sections = action.payload.map((s, idx) => ({
        ...s,
        order: idx,
      }));
      state.currentResume.updatedAt = new Date().toISOString();
      state.isDirty = true;
      state.saveStatus = 'idle';
    },

    addSection: (state, action: PayloadAction<ResumeSection>) => {
      if (!state.currentResume) return;
      pushHistory(state);
      const newOrder = state.currentResume.sections.length;
      state.currentResume.sections.push({
        ...action.payload,
        order: newOrder,
      });
      state.currentResume.updatedAt = new Date().toISOString();
      state.isDirty = true;
      state.saveStatus = 'idle';
    },

    removeSection: (state, action: PayloadAction<string>) => {
      if (!state.currentResume) return;
      pushHistory(state);
      state.currentResume.sections = state.currentResume.sections
        .filter((s) => s.id !== action.payload)
        .map((s, idx) => ({ ...s, order: idx }));
      state.currentResume.updatedAt = new Date().toISOString();
      state.isDirty = true;
      state.saveStatus = 'idle';
    },

    updateSection: (state, action: PayloadAction<ResumeSection>) => {
      if (!state.currentResume) return;
      const index = state.currentResume.sections.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        pushHistory(state);
        state.currentResume.sections[index] = action.payload;
        state.currentResume.updatedAt = new Date().toISOString();
        state.isDirty = true;
        state.saveStatus = 'idle';
      }
    },

    setSavingStatus: (state, action: PayloadAction<SaveStatus>) => {
      state.saveStatus = action.payload;
    },

    markSavedSuccess: (state) => {
      state.saveStatus = 'saved';
      state.isDirty = false;
      state.lastSavedAt = new Date().toISOString();
      state.errorMessage = null;
    },

    markSaveError: (state, action: PayloadAction<string>) => {
      state.saveStatus = 'error';
      state.errorMessage = action.payload;
    },

    undo: (state) => {
      if (state.past.length === 0 || !state.currentResume) return;
      const previous = state.past.pop();
      if (previous) {
        state.future.unshift(JSON.parse(JSON.stringify(state.currentResume)));
        state.currentResume = previous;
        state.isDirty = true;
        state.saveStatus = 'idle';
      }
    },

    redo: (state) => {
      if (state.future.length === 0 || !state.currentResume) return;
      const next = state.future.shift();
      if (next) {
        state.past.push(JSON.parse(JSON.stringify(state.currentResume)));
        state.currentResume = next;
        state.isDirty = true;
        state.saveStatus = 'idle';
      }
    },
  },
});

export const {
  setCurrentResume,
  updateResumeTitle,
  updateTargetRole,
  updatePersonalInfo,
  setTemplateId,
  toggleSectionVisibility,
  updateSectionTitle,
  reorderSections,
  addSection,
  removeSection,
  updateSection,
  setSavingStatus,
  markSavedSuccess,
  markSaveError,
  undo,
  redo,
} = resumeSlice.actions;

export default resumeSlice.reducer;

