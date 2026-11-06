import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  version: number;
  isBuiltIn: boolean;
  thumbnail?: string;
  category: 'Modern' | 'Classic' | 'Minimal' | 'Executive';
}

interface TemplatesState {
  availableTemplates: TemplateSummary[];
  selectedTemplateId: string;
}

const initialTemplates: TemplateSummary[] = [
  {
    id: 'ats-classic',
    name: 'Standard ATS (With & Without Photo)',
    description: 'Clean single-column layout with solid section dividers, inline contacts, calendar/pin icons, and selectable text. Supports with-photo and without-photo modes.',
    version: 1,
    isBuiltIn: true,
    category: 'Classic',
  },
];

const initialState: TemplatesState = {
  availableTemplates: initialTemplates,
  selectedTemplateId: 'ats-classic',
};

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    selectTemplate: (state, action: PayloadAction<string>) => {
      state.selectedTemplateId = action.payload;
    },
  },
});

export const { selectTemplate } = templatesSlice.actions;

export default templatesSlice.reducer;

