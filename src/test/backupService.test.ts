import { describe, it, expect, beforeEach } from 'vitest';
import { backupService } from '@/services/backup/backupService';
import { resumeRepository } from '@/services/storage/db';
import { createDefaultResume } from '@/utils/resumeDefaults';

describe('Backup Service', () => {
  beforeEach(async () => {
    await resumeRepository.clearAll();
  });

  it('imports valid backup and prevents silent overwrite of existing ID', async () => {
    const existingResume = createDefaultResume('Existing Resume');
    await resumeRepository.save(existingResume);

    // Prepare import payload containing the same resume ID
    const importPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      resumes: [
        {
          ...existingResume,
          title: 'Imported Collision Resume',
        },
      ],
    };

    const result = await backupService.importBackup(JSON.stringify(importPayload));

    expect(result.success).toBe(true);
    expect(result.importedCount).toBe(1);
    expect(result.warnings.length).toBeGreaterThan(0);

    const allResumes = await resumeRepository.getAll();
    expect(allResumes.length).toBe(2);

    const original = allResumes.find((r) => r.id === existingResume.id);
    expect(original?.title).toBe('Existing Resume'); // Untouched!
  });

  it('handles invalid JSON gracefully without throwing', async () => {
    const result = await backupService.importBackup('NOT_JSON_DATA');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Failed to parse');
  });
});

