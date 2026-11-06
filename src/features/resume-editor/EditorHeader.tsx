import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  updateResumeTitle,
  setTemplateId,
  undo,
  redo,
  setSavingStatus,
  markSavedSuccess,
  markSaveError,
} from '@/store/slices/resumeSlice';
import { resumeRepository } from '@/services/storage/db';
import { backupService } from '@/services/backup/backupService';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Undo2,
  Redo2,
  Printer,
  Download,
  Edit3,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EditorHeaderProps {
  activeView: 'split' | 'editor' | 'preview';
  onViewChange: (view: 'split' | 'editor' | 'preview') => void;
  onPrintPdf: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  activeView,
  onViewChange,
  onPrintPdf,
}) => {
  const dispatch = useAppDispatch();
  const currentResume = useAppSelector((state) => state.resume.currentResume);
  const saveStatus = useAppSelector((state) => state.resume.saveStatus);
  const isDirty = useAppSelector((state) => state.resume.isDirty);
  const canUndo = useAppSelector((state) => state.resume.past.length > 0);
  const canRedo = useAppSelector((state) => state.resume.future.length > 0);
  const availableTemplates = useAppSelector((state) => state.templates.availableTemplates);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentResume?.title || 'Untitled Resume');

  if (!currentResume) return null;

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      dispatch(updateResumeTitle(titleInput.trim()));
    }
    setIsEditingTitle(false);
  };

  const handleManualSave = async () => {
    try {
      dispatch(setSavingStatus('saving'));
      await resumeRepository.save(currentResume);
      dispatch(markSavedSuccess());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Storage write failed';
      dispatch(markSaveError(msg));
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTemplateId({ templateId: e.target.value }));
  };

  const handleExportJson = () => {
    backupService.exportSingleResume(currentResume);
  };

  return (
    <header className="no-print print:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs select-none">
      {/* Title & Editable Header */}
      <div className="flex items-center gap-3">
        {isEditingTitle ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              className="text-base font-bold text-slate-900 border border-blue-400 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            <h1 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
              {currentResume.title}
            </h1>
            <Edit3 className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        )}

        {/* Truthful Autosave Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              Save failed
            </span>
          )}
          {saveStatus === 'idle' && isDirty && (
            <span className="text-slate-400 text-[11px]">Unsaved edits</span>
          )}
        </div>
      </div>

      {/* Middle: Template selector & History (Undo/Redo) */}
      <div className="flex items-center gap-2">
        {/* Template Selector */}
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Palette className="h-3.5 w-3.5 text-slate-400 hidden sm:inline" />
          <select
            value={currentResume.templateId}
            onChange={handleTemplateChange}
            className="text-xs rounded border border-slate-300 bg-white px-2 py-1 font-medium text-slate-800 shadow-2xs hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            title="Switch template"
          >
            {availableTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                Template: {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center border border-slate-200 rounded-md bg-slate-50/60 p-0.5">
          <button
            onClick={() => dispatch(undo())}
            disabled={!canUndo}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => dispatch(redo())}
            disabled={!canRedo}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Right Actions: Mobile Toggle, JSON Backup & PDF Export */}
      <div className="flex items-center gap-2">
        {/* Mobile/Tablet View Switcher */}
        <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-md text-xs font-medium text-slate-600">
          <button
            onClick={() => onViewChange('editor')}
            className={`px-2.5 py-1 rounded ${
              activeView === 'editor' ? 'bg-white text-blue-700 font-semibold shadow-xs' : ''
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => onViewChange('preview')}
            className={`px-2.5 py-1 rounded ${
              activeView === 'preview' ? 'bg-white text-blue-700 font-semibold shadow-xs' : ''
            }`}
          >
            Preview
          </button>
        </div>

        {/* Fallback Manual Save */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualSave}
          title="Force save changes to local database"
          className="text-xs h-7 px-2.5 text-slate-600 hidden sm:inline-flex"
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>

        {/* Export JSON Backup */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportJson}
          title="Export resume data as JSON"
          className="text-xs h-7 px-2.5 text-slate-600 hidden sm:inline-flex"
        >
          <Download className="h-3 w-3 mr-1" />
          JSON
        </Button>

        {/* PDF Export / Print */}
        <Button
          variant="primary"
          size="sm"
          onClick={onPrintPdf}
          className="text-xs h-7 px-3 gap-1.5"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Export PDF</span>
        </Button>
      </div>
    </header>
  );
};
