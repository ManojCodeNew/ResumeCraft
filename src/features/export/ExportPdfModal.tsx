import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Printer, CheckCircle2 } from 'lucide-react';
import { printResumeElement } from '@/utils/printPdf';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle: string;
  fullName?: string;
  elementId?: string;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  defaultTitle,
  fullName,
  elementId = 'resume-a4-sheet',
}) => {
  const [filename, setFilename] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Suggest clean default filename: e.g. "MANOJ_C_Resume"
      const namePart = (fullName || defaultTitle || 'Resume')
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '');
      const suggested = namePart.toLowerCase().includes('resume') ? namePart : `${namePart}_Resume`;
      setFilename(suggested);
      setIsExporting(false);
    }
  }, [isOpen, fullName, defaultTitle]);

const handleDownload = async () => {
  if (!filename.trim()) return;

  try {
    setIsExporting(true);

    await printResumeElement(elementId, filename.trim());

    onClose();
  } catch (error) {
    console.error("PDF download failed:", error);
    // Show an error message to the user
  } finally {
    setIsExporting(false);
  }
};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download Resume as PDF"
      description="Customize your PDF file name before printing or saving."
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* File Name Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            PDF File Name
          </label>
          <div className="flex items-center">
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. MANOJ_C_Resume"
              autoFocus
              className="rounded-r-none font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDownload();
              }}
            />
            <span className="inline-flex items-center px-3 h-9 rounded-r-md border border-l-0 border-slate-300 bg-slate-100 text-slate-500 font-mono text-xs select-none">
              .pdf
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            This name will be suggested automatically when saving the PDF to your computer.
          </p>
        </div>

        {/* Print Settings Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
          <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Recommended Browser Print Settings:</span>
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-600 pl-5 list-disc">
            <li>
              <strong>Destination:</strong> Select <strong className="text-blue-700">"Save as PDF"</strong> (Recommended: produces crisp vector text without dark-letter pixel-snapping artifacts).
            </li>
            <li>
              <strong>Paper Size:</strong> Ensure <em>"A4"</em> is selected.
            </li>
            <li>
              <strong>Margins:</strong> Select <em>"None"</em> or <em>"Default"</em>.
            </li>
            <li>
              <strong>More Settings:</strong> Uncheck <em>"Headers and footers"</em> (to remove browser URLs and timestamps).
            </li>
            <li>
              <strong>Background Graphics:</strong> Check <em>"Background graphics"</em> for crisp divider lines.
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            isLoading={isExporting}
            className="gap-1.5 font-semibold"
          >
            <Printer className="h-4 w-4" />
            <span>Open PDF / Print Dialog</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
