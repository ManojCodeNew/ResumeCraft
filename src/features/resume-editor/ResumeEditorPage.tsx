import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setCurrentResume,
  updatePersonalInfo,
  updateSection,
  reorderSections,
  addSection,
  removeSection,
  toggleSectionVisibility,
  updateSectionTitle,
} from '@/store/slices/resumeSlice';
import { resumeRepository } from '@/services/storage/db';
import { EditorHeader } from './EditorHeader';
import { PersonalInformationEditor } from './PersonalInformationEditor';
import { SectionListManager } from './SectionListManager';
import { ResumePreview } from '../preview/ResumePreview';
import { useAutosave } from '@/hooks/useAutosave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ExportPdfModal } from '@/features/export/ExportPdfModal';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ResumeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentResume = useAppSelector((state) => state.resume.currentResume);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Trigger autosave
  useAutosave(1000);

  // Open Export PDF modal
  const handlePrint = () => {
    setIsExportModalOpen(true);
  };

  useKeyboardShortcuts(handlePrint);

  useEffect(() => {
    async function loadResume() {
      if (!id) return;
      setIsLoading(true);
      setLoadError(null);
      try {
        const resume = await resumeRepository.getById(id);
        if (resume) {
          dispatch(setCurrentResume(resume));
        } else {
          setLoadError(`Resume not found (ID: ${id})`);
        }
      } catch (err: unknown) {
        setLoadError('Failed to load resume from local database');
      } finally {
        setIsLoading(false);
      }
    }
    loadResume();
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 font-medium">Loading your resume...</p>
      </div>
    );
  }

  if (loadError || !currentResume) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="rounded-full bg-red-100 p-3 text-red-600">
          <ArrowLeft className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Resume Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          {loadError || 'The requested resume could not be located in your local storage.'}
        </p>
        <Button onClick={() => navigate('/resumes')}>Back to My Resumes</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100 print:h-auto print:overflow-visible print:bg-white print:block">
      {/* Top Editor Header Toolbar */}
      <EditorHeader
        activeView={mobileView}
        onViewChange={(v) => {
          if (v === 'editor' || v === 'preview') setMobileView(v);
        }}
        onPrintPdf={handlePrint}
      />

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden print:block print:overflow-visible print:h-auto">
        {/* Left Side: Form Editor (scrollable) - HIDDEN IN PRINT */}
        <div
          id="editor-form-panel"
          data-print-hidden="true"
          className={`no-print print:hidden flex-1 lg:w-1/2 lg:flex-none overflow-y-auto p-4 sm:p-6 space-y-6 ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Back link */}
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={() => navigate('/resumes')}
              className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              All Resumes
            </button>
            <span className="text-[11px] text-slate-400">
              Template: <span className="font-medium text-slate-600">{currentResume.templateId}</span>
            </span>
          </div>

          {/* Personal Details Form */}
          <PersonalInformationEditor
            personalInfo={currentResume.personalInfo}
            onChange={(info) => dispatch(updatePersonalInfo(info))}
          />

          {/* Sections Manager Form */}
          <SectionListManager
            sections={currentResume.sections}
            onUpdateSection={(updated) => dispatch(updateSection(updated))}
            onReorderSections={(reordered) => dispatch(reorderSections(reordered))}
            onAddSection={(newSec) => dispatch(addSection(newSec))}
            onRemoveSection={(secId) => dispatch(removeSection(secId))}
            onToggleVisibility={(secId) => dispatch(toggleSectionVisibility(secId))}
            onUpdateTitle={(secId, title) => dispatch(updateSectionTitle({ sectionId: secId, title }))}
          />
        </div>

        {/* Right Side: Live A4 Preview - EXPANDED IN PRINT */}
        <div
          className={`flex-1 lg:w-1/2 p-4 sm:p-6 bg-slate-200/50 flex flex-col overflow-hidden print:!block print:!w-full print:!p-0 print:!m-0 print:!bg-white print:!overflow-visible ${
            mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <ResumePreview resume={currentResume} onPrint={handlePrint} />
        </div>
      </div>

      {/* Export PDF Modal with Custom Filename Rename */}
      <ExportPdfModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        defaultTitle={currentResume.title}
        fullName={currentResume.personalInfo.fullName}
      />
    </div>
  );
};
