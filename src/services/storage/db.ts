import Dexie, { type Table } from 'dexie';
import { ResumeDocument } from '@/types/resume';

export interface PersistedTemplate {
  id: string;
  name: string;
  version: number;
  isBuiltIn: boolean;
  createdAt: string;
}

export interface AppSetting {
  key: string;
  value: unknown;
}

export class ResumeDatabase extends Dexie {
  resumes!: Table<ResumeDocument, string>;
  templates!: Table<PersistedTemplate, string>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super('ResumeForgeDB');
    this.version(1).stores({
      resumes: 'id, title, updatedAt, createdAt, isMaster, templateId',
      templates: 'id, name, version, isBuiltIn',
      settings: 'key',
    });
  }
}

export const db = new ResumeDatabase();

// Repository functions for Resumes
export const resumeRepository = {
  async getAll(): Promise<ResumeDocument[]> {
    try {
      return await db.resumes.orderBy('updatedAt').reverse().toArray();
    } catch (error) {
      console.error('Failed to get resumes from IndexedDB:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<ResumeDocument | undefined> {
    try {
      return await db.resumes.get(id);
    } catch (error) {
      console.error(`Failed to get resume ${id} from IndexedDB:`, error);
      throw error;
    }
  },

  async save(resume: ResumeDocument): Promise<void> {
    try {
      await db.resumes.put(resume);
    } catch (error) {
      console.error(`Failed to save resume ${resume.id}:`, error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await db.resumes.delete(id);
    } catch (error) {
      console.error(`Failed to delete resume ${id}:`, error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await db.resumes.clear();
    } catch (error) {
      console.error('Failed to clear resumes:', error);
      throw error;
    }
  },
};

