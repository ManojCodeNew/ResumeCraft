import { describe, it, expect } from 'vitest';
import { resumeDocumentSchema, backupExportSchema } from '@/schemas/resume.schema';
import { createDefaultResume } from '@/utils/resumeDefaults';

describe('Resume Zod Schemas', () => {
  it('validates a properly formatted default resume document', () => {
    const defaultResume = createDefaultResume('Engineering Resume');
    const result = resumeDocumentSchema.safeParse(defaultResume);
    expect(result.success).toBe(true);
  });

  it('fails validation when title is missing or empty', () => {
    const invalidResume = {
      ...createDefaultResume(''),
      title: '',
    };
    const result = resumeDocumentSchema.safeParse(invalidResume);
    expect(result.success).toBe(false);
  });

  it('validates multi-resume backup schema', () => {
    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      resumes: [
        createDefaultResume('Master Resume', 'ats-classic', true),
        createDefaultResume('Tailored React', 'modern-compact', false),
      ],
    };
    const result = backupExportSchema.safeParse(backupData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.resumes.length).toBe(2);
    }
  });

  it('rejects corrupted or incomplete backup files', () => {
    const corruptBackup = {
      version: 1,
      exportedAt: 'now',
      resumes: [{ id: '123' }], // missing title, personalInfo, etc.
    };
    const result = backupExportSchema.safeParse(corruptBackup);
    expect(result.success).toBe(false);
  });
});

