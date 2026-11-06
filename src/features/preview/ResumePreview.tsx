import React, { useState } from 'react';
import { ResumeDocument } from '@/types/resume';
import { getTemplateRenderer } from '@/templates/registry/templateRegistry';
import { ZoomIn, ZoomOut, RotateCcw, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ResumePreviewProps {
  resume: ResumeDocument;
  onPrint?: () => void;
  showControls?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  onPrint,
  showControls = true,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const TemplateComponent = getTemplateRenderer(resume.templateId);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 140));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 60));
  const handleResetZoom = () => setZoomLevel(100);

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-200/70 rounded-lg overflow-hidden border border-slate-300 shadow-inner print:border-none print:shadow-none print:bg-white print:p-0 print:m-0 print:overflow-visible print:h-auto">
      {/* Top Preview Toolbar */}
      {showControls && (
        <div className="no-print print:hidden flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 text-xs text-slate-600 select-none">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Preview:</span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
              A4 (210 × 297 mm)
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium text-[11px] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              1-Page Fit
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 60}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="font-mono text-xs w-10 text-center">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 140}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-40 text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <div className="h-4 w-[1px] bg-slate-200 mx-2" />

            <Button
              variant="primary"
              size="sm"
              onClick={handlePrintClick}
              className="gap-1.5 text-xs h-7 px-3"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Export PDF / Print</span>
            </Button>
          </div>
        </div>
      )}

      {/* Scrollable Container with A4 Sheet */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start print:p-0 print:m-0 print:overflow-visible print:block">
        <div
          id="resume-a4-sheet"
          className="print-sheet bg-white shadow-xl rounded-sm transition-transform origin-top print:shadow-none print:m-0 print:border-none print:w-full print:p-0 print:transform-none"
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '6mm 10mm',
            boxSizing: 'border-box',
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <TemplateComponent resume={resume} isPreview />
        </div>
      </div>
    </div>
  );
};
