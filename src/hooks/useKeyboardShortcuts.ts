import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { undo, redo } from '@/store/slices/resumeSlice';

export function useKeyboardShortcuts(onPrint?: () => void) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing inside an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Handle Ctrl+Z / Cmd+Z for global undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !isInput) {
        e.preventDefault();
        dispatch(undo());
        return;
      }

      // Handle Ctrl+Y or Ctrl+Shift+Z for redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && !isInput) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z' && !isInput)
      ) {
        e.preventDefault();
        dispatch(redo());
        return;
      }

      // Handle Ctrl+P for PDF print
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p' && onPrint) {
        e.preventDefault();
        onPrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, onPrint]);
}

