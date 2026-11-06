export type SectionType =
  | 'summary'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'achievements'
  | 'languages'
  | 'publications'
  | 'volunteer'
  | 'custom';

export interface CustomLink {
  id: string;
  label: string;
  url: string;
}

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  customLinks?: CustomLink[];
  photoUrl?: string;
  showPhoto?: boolean;
}

export interface ExperienceEntry {
  id: string;
  position: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  highlights?: string[];
}

export interface ProjectEntry {
  id: string;
  title: string;
  role?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  highlights?: string[];
  technologies?: string[];
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  graduationDate?: string;
  gpa?: string;
  highlights?: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface AchievementEntry {
  id: string;
  title: string;
  date?: string;
  description?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency?: string; // e.g. Native, Fluent, Intermediate
}

export interface PublicationEntry {
  id: string;
  title: string;
  publisher?: string;
  releaseDate?: string;
  url?: string;
  summary?: string;
}

export interface VolunteerEntry {
  id: string;
  role: string;
  organization: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  summary?: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface CustomEntry {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  fields?: CustomField[];
}

// Base Section interface
export interface SectionBase {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
}

// Discriminated union of sections
export interface SummarySection extends SectionBase {
  type: 'summary';
  content: string;
}

export interface ExperienceSection extends SectionBase {
  type: 'experience';
  entries: ExperienceEntry[];
}

export interface ProjectsSection extends SectionBase {
  type: 'projects';
  entries: ProjectEntry[];
}

export interface SkillsSection extends SectionBase {
  type: 'skills';
  categories: SkillCategory[];
}

export interface EducationSection extends SectionBase {
  type: 'education';
  entries: EducationEntry[];
}

export interface CertificationsSection extends SectionBase {
  type: 'certifications';
  entries: CertificationEntry[];
}

export interface AchievementsSection extends SectionBase {
  type: 'achievements';
  entries: AchievementEntry[];
}

export interface LanguagesSection extends SectionBase {
  type: 'languages';
  entries: LanguageEntry[];
}

export interface PublicationsSection extends SectionBase {
  type: 'publications';
  entries: PublicationEntry[];
}

export interface VolunteerSection extends SectionBase {
  type: 'volunteer';
  entries: VolunteerEntry[];
}

export interface CustomSection extends SectionBase {
  type: 'custom';
  layout: 'entries' | 'text';
  textContent?: string;
  entries?: CustomEntry[];
}

export type ResumeSection =
  | SummarySection
  | ExperienceSection
  | ProjectsSection
  | SkillsSection
  | EducationSection
  | CertificationsSection
  | AchievementsSection
  | LanguagesSection
  | PublicationsSection
  | VolunteerSection
  | CustomSection;

export interface ResumeDocument {
  id: string;
  title: string;
  targetRole?: string;
  isMaster?: boolean;
  templateId: string;
  templateVersion: number;
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeMetadata {
  id: string;
  title: string;
  targetRole?: string;
  isMaster?: boolean;
  templateId: string;
  createdAt: string;
  updatedAt: string;
  sectionCount: number;
}

