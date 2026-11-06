import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateSettings } from '@/store/slices/settingsSlice';
import { loadResumesThunk } from '@/store/slices/resumesListSlice';
import { backupService, ImportResult } from '@/services/backup/backupService';
import { resumeRepository } from '@/services/storage/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';
import {
  Download,
  Upload,
  Trash2,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const availableTemplates = useAppSelector((state) => state.templates.availableTemplates);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isClearDbModalOpen, setIsClearDbModalOpen] = useState<boolean>(false);

  const handleExportBackup = async () => {
    await backupService.exportAllResumes();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const result = await backupService.importBackup(text);
        setImportResult(result);
        if (result.success) {
          dispatch(loadResumesThunk());
        }
      } catch (err: unknown) {
        setImportResult({
          success: false,
          importedCount: 0,
          resumes: [],
          warnings: [],
          error: 'Failed to read file contents',
        });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = async () => {
    await resumeRepository.clearAll();
    dispatch(loadResumesThunk());
    setIsClearDbModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings & Data Management</h1>
        <p className="text-xs text-slate-500">
          Control application preferences, manage local storage, and export/import full JSON backups.
        </p>
      </div>

      {/* Local Storage Transparency Callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <HardDrive className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold">Your data is stored 100% locally on your machine</h4>
          <p className="text-blue-800 leading-relaxed">
            ResumeForge is an offline-capable, privacy-respecting application. All resumes, edits, and
            sections reside strictly inside your browser's IndexedDB database. Nothing is sent to an external server.
            Because data lives in your browser, clearing your browser cache/storage or changing devices will not
            carry over resumes unless you take a JSON backup. We strongly recommend downloading a backup periodically.
          </p>
        </div>
      </div>

      {/* Backup & Portability Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4 text-blue-600" />
            <span>Data Backup & Portability</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Export all your resumes into a single structured JSON backup file, or import an existing backup.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Export all button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportBackup}
              className="text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Full Backup (JSON)</span>
            </Button>

            {/* Import file button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isImporting}
              className="text-xs gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Import Backup JSON</span>
            </Button>
          </div>

          {/* Import Result Notification */}
          {importResult && (
            <div
              className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                importResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {importResult.success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Successfully imported {importResult.importedCount} resume(s)!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span>Import failed: {importResult.error}</span>
                  </>
                )}
              </div>

              {importResult.warnings.length > 0 && (
                <div className="space-y-0.5 pt-1 text-slate-700">
                  {importResult.warnings.map((w, idx) => (
                    <p key={idx} className="text-[11px]">
                      • {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Editor & Export Preferences</CardTitle>
          <CardDescription className="text-xs">Configure defaults used during resume creation and saving.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Template</label>
              <select
                value={settings.defaultTemplateId}
                onChange={(e) => dispatch(updateSettings({ defaultTemplateId: e.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {availableTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Page Format</label>
              <input
                disabled
                value="Standard A4 (210 × 297 mm)"
                className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Autosave Delay</label>
              <select
                value={settings.autoSaveDelayMs}
                onChange={(e) => dispatch(updateSettings({ autoSaveDelayMs: Number(e.target.value) }))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={500}>Fast (500 ms)</option>
                <option value={1000}>Standard (1000 ms)</option>
                <option value={2000}>Relaxed (2000 ms)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone: Clear Local Storage */}
      <Card className="border-red-200 bg-red-50/20">
        <CardHeader>
          <CardTitle className="text-base text-red-700 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Irreversible destructive actions. Ensure you have downloaded a JSON backup before clearing data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsClearDbModalOpen(true)}
            className="text-xs"
          >
            Clear All Resumes from IndexedDB
          </Button>
        </CardContent>
      </Card>

      {/* Safe confirmation modal for clearing entire database */}
      <ConfirmModal
        isOpen={isClearDbModalOpen}
        onClose={() => setIsClearDbModalOpen(false)}
        onConfirm={handleClearAllData}
        title="Permanently Delete All Resumes?"
        message="This will completely clear your local browser database. All resumes and custom versions will be permanently lost unless you have previously downloaded a JSON backup."
        confirmLabel="Wipe Local Data"
        variant="danger"
      />
    </div>
  );
};
