import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resumeRepository } from '@/services/storage/db';
import {
  setSavingStatus,
  markSavedSuccess,
  markSaveError,
} from '@/store/slices/resumeSlice';
import { updateResumeInList } from '@/store/slices/resumesListSlice';

export function useAutosave(delayMs = 800) {
  const dispatch = useAppDispatch();
  const currentResume = useAppSelector((state) => state.resume.currentResume);
  const isDirty = useAppSelector((state) => state.resume.isDirty);

  // Keep track of latest save request to avoid race conditions
  const latestSaveSeq = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentResume || !isDirty) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const currentSeq = ++latestSaveSeq.current;

    timerRef.current = setTimeout(async () => {
      try {
        dispatch(setSavingStatus('saving'));

        // Persist to Dexie IndexedDB
        await resumeRepository.save(currentResume);

        // Check if a newer change hasn't dispatched already
        if (latestSaveSeq.current === currentSeq) {
          dispatch(markSavedSuccess());
          dispatch(updateResumeInList(currentResume));
        }
      } catch (err: unknown) {
        if (latestSaveSeq.current === currentSeq) {
          const msg = err instanceof Error ? err.message : 'Storage write failed';
          dispatch(markSaveError(msg));
        }
      }
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentResume, isDirty, delayMs, dispatch]);
}

