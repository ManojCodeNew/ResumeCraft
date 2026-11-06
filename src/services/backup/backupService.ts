import { ResumeDocument } from '@/types/resume';
import { backupExportSchema, resumeDocumentSchema } from '@/schemas/resume.schema';
import { resumeRepository } from '@/services/storage/db';
import { generateId } from '@/utils/id';

export interface BackupPayload {
  version: number;
  exportedAt: string;
  resumes: ResumeDocument[];
  settings?: Record<string, unknown>;
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  resumes: ResumeDocument[];
  warnings: string[];
  error?: string;
}

export const backupService = {
  /**
   * Generates a backup JSON payload of all resumes and triggers browser download.
   */
  async exportAllResumes(): Promise<void> {
    const resumes = await resumeRepository.getAll();
    const payload: BackupPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      resumes,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `resumeforge_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Exports a single resume as a JSON document.
   */
  exportSingleResume(resume: ResumeDocument): void {
    const safeTitle = resume.title.toLowerCase().replace(/[^a-z0-9]/gi, '_');
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeTitle}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Validates and imports a JSON backup string or single resume JSON.
   * Guarantees NO SILENT OVERWRITES: if a resume ID already exists,
   * generates a new ID and appends '(Imported)' to avoid clobbering existing data.
   */
  async importBackup(jsonContent: string): Promise<ImportResult> {
    try {
      const parsedData = JSON.parse(jsonContent);
      const warnings: string[] = [];
      let resumesToImport: ResumeDocument[] = [];

      // Check if it's a multi-resume backup format
      const multiBackupValidation = backupExportSchema.safeParse(parsedData);
      if (multiBackupValidation.success) {
        resumesToImport = multiBackupValidation.data.resumes;
      } else {
        // Check if it's a single resume document
        const singleResumeValidation = resumeDocumentSchema.safeParse(parsedData);
        if (singleResumeValidation.success) {
          resumesToImport = [singleResumeValidation.data];
        } else {
          return {
            success: false,
            importedCount: 0,
            resumes: [],
            warnings: [],
            error: 'Invalid backup file format. The file does not conform to the expected ResumeForge schema.',
          };
        }
      }

      if (resumesToImport.length === 0) {
        return {
          success: true,
          importedCount: 0,
          resumes: [],
          warnings: ['Backup file contained no resumes to import.'],
        };
      }

      const existingResumes = await resumeRepository.getAll();
      const existingIds = new Set(existingResumes.map((r) => r.id));
      const savedResumes: ResumeDocument[] = [];

      for (const res of resumesToImport) {
        let resumeToSave = { ...res };

        // Safe import guard: prevent silent overwriting
        if (existingIds.has(resumeToSave.id)) {
          const newId = generateId('res');
          warnings.push(`Resume "${resumeToSave.title}" has an existing ID. Saved as a copy with title "${resumeToSave.title} (Imported)".`);
          resumeToSave = {
            ...resumeToSave,
            id: newId,
            title: `${resumeToSave.title} (Imported)`,
            updatedAt: new Date().toISOString(),
          };
        }

        await resumeRepository.save(resumeToSave);
        savedResumes.push(resumeToSave);
      }

      return {
        success: true,
        importedCount: savedResumes.length,
        resumes: savedResumes,
        warnings,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error during import';
      return {
        success: false,
        importedCount: 0,
        resumes: [],
        warnings: [],
        error: `Failed to parse import file: ${msg}`,
      };
    }
  },
};

