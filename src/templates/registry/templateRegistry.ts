import React from 'react';
import { ResumeDocument } from '@/types/resume';
import { AtsClassicTemplate } from '../ats-classic/AtsClassicTemplate';
import { ModernCompactTemplate } from '../modern-compact/ModernCompactTemplate';
import { MinimalistMonoTemplate } from '../minimalist-mono/MinimalistMonoTemplate';

export interface RegisteredTemplate {
  id: string;
  name: string;
  description: string;
  version: number;
  component: React.ComponentType<{ resume: ResumeDocument; isPreview?: boolean }>;
}

export const templateRegistry: Record<string, RegisteredTemplate> = {
  'ats-classic': {
    id: 'ats-classic',
    name: 'ATS Classic Clean',
    description: 'High-clarity single column layout optimized for applicant tracking systems and executive print clarity.',
    version: 1,
    component: AtsClassicTemplate,
  },
  'modern-compact': {
    id: 'modern-compact',
    name: 'Modern Professional',
    description: 'Refined contemporary design with subtle accent lines, optimal vertical spacing, and modern pills.',
    version: 1,
    component: ModernCompactTemplate,
  },
  'minimalist-mono': {
    id: 'minimalist-mono',
    name: 'Minimalist Focus',
    description: 'Distraction-free typographic layout with clean borders and understated elegance.',
    version: 1,
    component: MinimalistMonoTemplate,
  },
};

export function getTemplateRenderer(templateId: string): React.ComponentType<{ resume: ResumeDocument; isPreview?: boolean }> {
  const registered = templateRegistry[templateId];
  if (registered) {
    return registered.component;
  }
  // Safe fallback to ats-classic to avoid breaking
  return AtsClassicTemplate;
}

