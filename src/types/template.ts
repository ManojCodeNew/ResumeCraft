import React from 'react';
import { ResumeDocument, SectionType } from './resume';

export interface TemplateMargins {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export interface TemplateColors {
  primary: string;
  secondary?: string;
  text: string;
  muted: string;
  border: string;
  background: string;
}

export interface TemplateTypography {
  fontFamily: string;
  headingFont?: string;
  baseFontSize: string; // e.g., '10pt' or '11pt'
  lineHeight: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  version: number;
  isBuiltIn: boolean;
  supportedSections: SectionType[];
  pageSize: 'A4';
  margins: TemplateMargins;
  colors: TemplateColors;
  typography: TemplateTypography;
  renderer: React.ComponentType<{ resume: ResumeDocument; isPreview?: boolean }>;
}

