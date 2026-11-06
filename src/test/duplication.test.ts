import { describe, it, expect } from 'vitest';
import { createDefaultResume, duplicateResume } from '@/utils/resumeDefaults';
import { ExperienceSection } from '@/types/resume';

describe('Resume Duplication Independence', () => {
  it('assigns fresh IDs to duplicated document, sections, and repeatable entries', () => {
    const source = createDefaultResume('Master Resume', 'ats-classic', true);
    // Add an experience entry to source
    const expSec = source.sections.find((s) => s.type === 'experience') as ExperienceSection;
    expSec.entries.push({
      id: 'original_exp_1',
      position: 'Staff Engineer',
      company: 'Original Corp',
      startDate: '2020',
      highlights: ['Shipped flagship feature', 'Reduced load times'],
    });

    const copy = duplicateResume(source, 'Tailored Role Copy');

    // Document ID must be distinct
    expect(copy.id).not.toBe(source.id);
    expect(copy.title).toBe('Tailored Role Copy');
    expect(copy.isMaster).toBe(false);

    // Section IDs must be distinct
    const copyExpSec = copy.sections.find((s) => s.type === 'experience') as ExperienceSection;
    expect(copyExpSec.id).not.toBe(expSec.id);

    // Nested entry IDs must be distinct
    expect(copyExpSec.entries[0]!.id).not.toBe(expSec.entries[0]!.id);
    expect(copyExpSec.entries[0]!.position).toBe('Staff Engineer');

    // Mutating copy must NOT affect source
    copyExpSec.entries[0]!.position = 'Modified in Copy';
    expect(expSec.entries[0]!.position).toBe('Staff Engineer');
  });
});

