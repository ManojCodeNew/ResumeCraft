import { describe, it, expect } from 'vitest';
import resumeReducer, {
  setCurrentResume,
  updateResumeTitle,
  updatePersonalInfo,
  setTemplateId,
  addSection,
  removeSection,
  undo,
  redo,
} from '@/store/slices/resumeSlice';
import { createDefaultResume, createNewSection } from '@/utils/resumeDefaults';

describe('Resume Redux Slice', () => {
  const initialResume = createDefaultResume('Original Resume');

  it('sets the current resume', () => {
    const state = resumeReducer(undefined, setCurrentResume(initialResume));
    expect(state.currentResume?.id).toBe(initialResume.id);
    expect(state.saveStatus).toBe('saved');
    expect(state.isDirty).toBe(false);
  });

  it('updates resume title and marks dirty', () => {
    let state = resumeReducer(undefined, setCurrentResume(initialResume));
    state = resumeReducer(state, updateResumeTitle('Updated Title'));
    expect(state.currentResume?.title).toBe('Updated Title');
    expect(state.isDirty).toBe(true);
  });

  it('updates personal info cleanly', () => {
    let state = resumeReducer(undefined, setCurrentResume(initialResume));
    state = resumeReducer(
      state,
      updatePersonalInfo({ fullName: 'Sarah Connor', email: 'sarah@example.com' })
    );
    expect(state.currentResume?.personalInfo.fullName).toBe('Sarah Connor');
    expect(state.currentResume?.personalInfo.email).toBe('sarah@example.com');
  });

  it('switches template while preserving all user content', () => {
    let state = resumeReducer(undefined, setCurrentResume(initialResume));
    state = resumeReducer(state, setTemplateId({ templateId: 'modern-compact' }));
    expect(state.currentResume?.templateId).toBe('modern-compact');
    expect(state.currentResume?.sections.length).toBe(initialResume.sections.length);
  });

  it('adds and removes sections safely', () => {
    let state = resumeReducer(undefined, setCurrentResume(initialResume));
    const newSection = createNewSection('achievements', 'Honors & Awards', 99);
    state = resumeReducer(state, addSection(newSection));
    expect(state.currentResume?.sections.some((s) => s.id === newSection.id)).toBe(true);

    state = resumeReducer(state, removeSection(newSection.id));
    expect(state.currentResume?.sections.some((s) => s.id === newSection.id)).toBe(false);
  });

  it('supports undo and redo', () => {
    let state = resumeReducer(undefined, setCurrentResume(initialResume));
    state = resumeReducer(state, updateResumeTitle('First Change'));
    expect(state.currentResume?.title).toBe('First Change');

    state = resumeReducer(state, undo());
    expect(state.currentResume?.title).toBe('Original Resume');

    state = resumeReducer(state, redo());
    expect(state.currentResume?.title).toBe('First Change');
  });
});
