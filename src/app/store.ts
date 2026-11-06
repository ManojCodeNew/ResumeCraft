import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from '@/store/slices/resumeSlice';
import resumesListReducer from '@/store/slices/resumesListSlice';
import templatesReducer from '@/store/slices/templatesSlice';
import settingsReducer from '@/store/slices/settingsSlice';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    resumesList: resumesListReducer,
    templates: templatesReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Warn if non-serializable values are put in Redux state
        warnAfter: 128,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

