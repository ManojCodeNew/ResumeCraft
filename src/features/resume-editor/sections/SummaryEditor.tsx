import React from 'react';
import { SummarySection } from '@/types/resume';
import { Textarea } from '@/components/ui/Textarea';

interface SummaryEditorProps {
  section: SummarySection;
  onChange: (updated: SummarySection) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({ section, onChange }) => {
  return (
    <div className="space-y-2">
      <Textarea
        label="Summary Content"
        rows={4}
        placeholder="Write a concise overview of your background, core strengths, and what value you bring..."
        value={section.content}
        onChange={(e) => onChange({ ...section, content: e.target.value })}
        helperText="Tip: Keep it focused on 3-5 sentences highlighting your core competencies and accomplishments."
      />
    </div>
  );
};

