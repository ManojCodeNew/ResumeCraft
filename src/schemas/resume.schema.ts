import { z } from 'zod';

export const customLinkSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Label is required'),
  url: z.string().url('Invalid URL format').or(z.string().min(1)),
});

export const personalInfoSchema = z.object({
  fullName: z.string().default(''),
  headline: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  linkedinUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  customLinks: z.array(customLinkSchema).optional().default([]),
  photoUrl: z.string().optional(),
  showPhoto: z.boolean().optional().default(false),
});

export const experienceEntrySchema = z.object({
  id: z.string(),
  position: z.string().default(''),
  company: z.string().default(''),
  location: z.string().optional(),
  startDate: z.string().default(''),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional().default([]),
});

export const projectEntrySchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  role: z.string().optional(),
  url: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
});

export const skillCategorySchema = z.object({
  id: z.string(),
  categoryName: z.string().default(''),
  skills: z.array(z.string()).default([]),
});

export const educationEntrySchema = z.object({
  id: z.string(),
  degree: z.string().default(''),
  institution: z.string().default(''),
  location: z.string().optional(),
  graduationDate: z.string().optional(),
  gpa: z.string().optional(),
  highlights: z.array(z.string()).optional().default([]),
});

export const certificationEntrySchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  issuer: z.string().default(''),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().optional(),
});

export const achievementEntrySchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  date: z.string().optional(),
  description: z.string().optional(),
});

export const languageEntrySchema = z.object({
  id: z.string(),
  language: z.string().default(''),
  proficiency: z.string().optional(),
});

export const publicationEntrySchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  publisher: z.string().optional(),
  releaseDate: z.string().optional(),
  url: z.string().optional(),
  summary: z.string().optional(),
});

export const volunteerEntrySchema = z.object({
  id: z.string(),
  role: z.string().default(''),
  organization: z.string().default(''),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional().default(false),
  summary: z.string().optional(),
});

export const customFieldSchema = z.object({
  id: z.string(),
  label: z.string().default(''),
  value: z.string().default(''),
});

export const customEntrySchema = z.object({
  id: z.string(),
  title: z.string().default(''),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(customFieldSchema).optional().default([]),
});

// Section Schemas
export const summarySectionSchema = z.object({
  id: z.string(),
  type: z.literal('summary'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  content: z.string().default(''),
});

export const experienceSectionSchema = z.object({
  id: z.string(),
  type: z.literal('experience'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  entries: z.array(experienceEntrySchema).default([]),
});

export const projectsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('projects'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  entries: z.array(projectEntrySchema).default([]),
});

export const skillsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('skills'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  categories: z.array(skillCategorySchema).default([]),
});

export const educationSectionSchema = z.object({
  id: z.string(),
  type: z.literal('education'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  entries: z.array(educationEntrySchema).default([]),
});

export const certificationsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('certifications'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  entries: z.array(certificationEntrySchema).default([]),
});

export const achievementsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('achievements'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  entries: z.array(achievementEntrySchema).default([]),
});

export const languagesSectionSchema = z.object({
  id: z.string(),
  type: z.literal('languages'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  entries: z.array(languageEntrySchema).default([]),
});

export const publicationsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('publications'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  entries: z.array(publicationEntrySchema).default([]),
});

export const volunteerSectionSchema = z.object({
  id: z.string(),
  type: z.literal('volunteer'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  entries: z.array(volunteerEntrySchema).default([]),
});

export const customSectionSchema = z.object({
  id: z.string(),
  type: z.literal('custom'),
  title: z.string().min(1),
  visible: z.boolean(),
  order: z.number(),
  layout: z.enum(['entries', 'text']).default('entries'),
  textContent: z.string().optional(),
  entries: z.array(customEntrySchema).optional().default([]),
});

export const resumeSectionSchema = z.discriminatedUnion('type', [
  summarySectionSchema,
  experienceSectionSchema,
  projectsSectionSchema,
  skillsSectionSchema,
  educationSectionSchema,
  certificationsSectionSchema,
  achievementsSectionSchema,
  languagesSectionSchema,
  publicationsSectionSchema,
  volunteerSectionSchema,
  customSectionSchema,
]);

export const resumeDocumentSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Resume title is required'),
  targetRole: z.string().optional(),
  isMaster: z.boolean().optional().default(false),
  templateId: z.string().default('ats-classic'),
  templateVersion: z.number().default(1),
  personalInfo: personalInfoSchema,
  sections: z.array(resumeSectionSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const backupExportSchema = z.object({
  version: z.number().default(1),
  exportedAt: z.string(),
  resumes: z.array(resumeDocumentSchema),
  settings: z.record(z.unknown()).optional(),
});
