import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ResumeDocument, ResumeMetadata } from '@/types/resume';
import { resumeRepository } from '@/services/storage/db';
import { createDefaultResume, duplicateResume } from '@/utils/resumeDefaults';

interface ResumesListState {
  resumes: ResumeDocument[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ResumesListState = {
  resumes: [],
  isLoading: false,
  error: null,
};

export const loadResumesThunk = createAsyncThunk('resumesList/loadAll', async () => {
  return await resumeRepository.getAll();
});

export const createNewResumeThunk = createAsyncThunk(
  'resumesList/create',
  async ({ title, templateId, isMaster }: { title: string; templateId?: string; isMaster?: boolean }) => {
    const newResume = createDefaultResume(title, templateId, isMaster);
    await resumeRepository.save(newResume);
    return newResume;
  }
);

export const duplicateResumeThunk = createAsyncThunk(
  'resumesList/duplicate',
  async ({ source, newTitle }: { source: ResumeDocument; newTitle?: string }) => {
    const copy = duplicateResume(source, newTitle);
    await resumeRepository.save(copy);
    return copy;
  }
);

export const deleteResumeThunk = createAsyncThunk('resumesList/delete', async (id: string) => {
  await resumeRepository.delete(id);
  return id;
});

export const saveResumeThunk = createAsyncThunk('resumesList/save', async (resume: ResumeDocument) => {
  await resumeRepository.save(resume);
  return resume;
});

export const resumesListSlice = createSlice({
  name: 'resumesList',
  initialState,
  reducers: {
    setResumes: (state, action: PayloadAction<ResumeDocument[]>) => {
      state.resumes = action.payload;
    },
    updateResumeInList: (state, action: PayloadAction<ResumeDocument>) => {
      const index = state.resumes.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.resumes[index] = action.payload;
      } else {
        state.resumes.unshift(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // loadResumesThunk
      .addCase(loadResumesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadResumesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload;
      })
      .addCase(loadResumesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load resumes';
      })
      // createNewResumeThunk
      .addCase(createNewResumeThunk.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
      })
      // duplicateResumeThunk
      .addCase(duplicateResumeThunk.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
      })
      // deleteResumeThunk
      .addCase(deleteResumeThunk.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r.id !== action.payload);
      })
      // saveResumeThunk
      .addCase(saveResumeThunk.fulfilled, (state, action) => {
        const index = state.resumes.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        } else {
          state.resumes.unshift(action.payload);
        }
      });
  },
});

export const { setResumes, updateResumeInList } = resumesListSlice.actions;

// Selectors
export const selectAllResumes = (state: { resumesList: ResumesListState }): ResumeDocument[] =>
  state.resumesList.resumes;

export const selectResumeMetadatas = (state: { resumesList: ResumesListState }): ResumeMetadata[] =>
  state.resumesList.resumes.map((r) => ({
    id: r.id,
    title: r.title,
    targetRole: r.targetRole,
    isMaster: r.isMaster,
    templateId: r.templateId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    sectionCount: r.sections.filter((s) => s.visible).length,
  }));

export default resumesListSlice.reducer;

