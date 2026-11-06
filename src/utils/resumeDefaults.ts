import { ResumeDocument, ResumeSection, SectionType } from '@/types/resume';
import { generateId } from './id';

export function createDefaultResume(
  title = 'Untitled Resume',
  templateId = 'ats-classic',
  isMaster = false
): ResumeDocument {
  const now = new Date().toISOString();

  return {
    id: generateId('res'),
    title,
    isMaster,
    templateId,
    templateVersion: 1,
    personalInfo: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      linkedinUrl: '',
      portfolioUrl: '',
      githubUrl: '',
      customLinks: [],
      photoUrl: '',
      showPhoto: false,
    },
    sections: [
      {
        id: generateId('sec'),
        type: 'summary',
        title: 'Professional Summary',
        visible: true,
        order: 0,
        content: '',
      },
      {
        id: generateId('sec'),
        type: 'experience',
        title: 'Work Experience',
        visible: true,
        order: 1,
        entries: [],
      },
      {
        id: generateId('sec'),
        type: 'projects',
        title: 'Projects',
        visible: true,
        order: 2,
        entries: [],
      },
      {
        id: generateId('sec'),
        type: 'skills',
        title: 'Technical Skills',
        visible: true,
        order: 3,
        categories: [],
      },
      {
        id: generateId('sec'),
        type: 'education',
        title: 'Education',
        visible: true,
        order: 4,
        entries: [],
      },
      {
        id: generateId('sec'),
        type: 'certifications',
        title: 'Certifications',
        visible: true,
        order: 5,
        entries: [],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates an independent duplicate of a resume with fresh IDs for the document,
 * sections, and all nested repeatable entries.
 */
export function duplicateResume(source: ResumeDocument, newTitle?: string): ResumeDocument {
  const now = new Date().toISOString();

  const clonedSections: ResumeSection[] = source.sections.map((section, idx) => {
    const newSectionId = generateId('sec');

    switch (section.type) {
      case 'summary':
        return {
          ...section,
          id: newSectionId,
          order: idx,
        };

      case 'experience':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries.map((entry) => ({
            ...entry,
            id: generateId('exp'),
            highlights: entry.highlights ? [...entry.highlights] : [],
          })),
        };

      case 'projects':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries.map((entry) => ({
            ...entry,
            id: generateId('proj'),
            highlights: entry.highlights ? [...entry.highlights] : [],
            technologies: entry.technologies ? [...entry.technologies] : [],
          })),
        };

      case 'skills':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          categories: section.categories.map((cat) => ({
            ...cat,
            id: generateId('cat'),
            skills: [...cat.skills],
          })),
        };

      case 'education':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries.map((entry) => ({
            ...entry,
            id: generateId('edu'),
            highlights: entry.highlights ? [...entry.highlights] : [],
          })),
        };

      case 'certifications':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries.map((entry) => ({
            ...entry,
            id: generateId('cert'),
          })),
        };

      case 'achievements':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries.map((entry) => ({
            ...entry,
            id: generateId('ach'),
          })),
        };

      case 'languages':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries.map((entry) => ({
            ...entry,
            id: generateId('lang'),
          })),
        };

      case 'publications':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries.map((entry) => ({
            ...entry,
            id: generateId('pub'),
          })),
        };

      case 'volunteer':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries.map((entry) => ({
            ...entry,
            id: generateId('vol'),
          })),
        };

      case 'custom':
        return {
          ...section,
          id: newSectionId,
          order: idx,
          entries: section.entries?.map((entry) => ({
            ...entry,
            id: generateId('cst_ent'),
            fields: entry.fields?.map((f) => ({ ...f, id: generateId('cst_fld') })),
          })),
        };

      default: {
        const fallbackSection = section as ResumeSection;
        return {
          ...fallbackSection,
          id: newSectionId,
          order: idx,
        };
      }
    }
  });

  return {
    ...source,
    id: generateId('res'),
    title: newTitle || `${source.title} (Copy)`,
    isMaster: false, // Duplicates default to tailored copies
    personalInfo: {
      ...source.personalInfo,
      customLinks: source.personalInfo.customLinks?.map((link) => ({
        ...link,
        id: generateId('link'),
      })),
    },
    sections: clonedSections,
    createdAt: now,
    updatedAt: now,
  };
}

export function createNewSection(type: SectionType, title?: string, order = 0): ResumeSection {
  const id = generateId('sec');

  switch (type) {
    case 'summary':
      return { id, type: 'summary', title: title || 'Professional Summary', visible: true, order, content: '' };
    case 'experience':
      return { id, type: 'experience', title: title || 'Work Experience', visible: true, order, entries: [] };
    case 'projects':
      return { id, type: 'projects', title: title || 'Projects', visible: true, order, entries: [] };
    case 'skills':
      return { id, type: 'skills', title: title || 'Technical Skills', visible: true, order, categories: [] };
    case 'education':
      return { id, type: 'education', title: title || 'Education', visible: true, order, entries: [] };
    case 'certifications':
      return { id, type: 'certifications', title: title || 'Certifications', visible: true, order, entries: [] };
    case 'achievements':
      return { id, type: 'achievements', title: title || 'Achievements', visible: true, order, entries: [] };
    case 'languages':
      return { id, type: 'languages', title: title || 'Languages', visible: true, order, entries: [] };
    case 'publications':
      return { id, type: 'publications', title: title || 'Publications', visible: true, order, entries: [] };
    case 'volunteer':
      return { id, type: 'volunteer', title: title || 'Volunteer Experience', visible: true, order, entries: [] };
    case 'custom':
      return {
        id,
        type: 'custom',
        title: title || 'Custom Section',
        visible: true,
        order,
        layout: 'entries',
        entries: [],
      };
  }
}
