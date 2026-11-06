import React from 'react';
import { EducationSection, EducationEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface EducationEditorProps {
  section: EducationSection;
  onChange: (updated: EducationSection) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ section, onChange }) => {
  const handleAddEducation = () => {
    const newEdu: EducationEntry = {
      id: generateId('edu'),
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: '',
      highlights: [],
    };
    onChange({
      ...section,
      entries: [newEdu, ...section.entries],
    });
  };

  const handleUpdateEducation = (id: string, updates: Partial<EducationEntry>) => {
    onChange({
      ...section,
      entries: section.entries.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu)),
    });
  };

  const handleDeleteEducation = (id: string) => {
    onChange({
      ...section,
      entries: section.entries.filter((edu) => edu.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {section.entries.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No education entries added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAddEducation}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Education Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {section.entries.map((edu, index) => (
            <div
              key={edu.id}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1}: {edu.degree || 'Degree'} {edu.institution && `at ${edu.institution}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Degree / Major *"
                  placeholder="e.g. B.S. in Computer Science"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                />
                <Input
                  label="Institution / University *"
                  placeholder="e.g. University of California, Berkeley"
                  value={edu.institution}
                  onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                />
                <Input
                  label="Location"
                  placeholder="e.g. Berkeley, CA"
                  value={edu.location || ''}
                  onChange={(e) => handleUpdateEducation(edu.id, { location: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Graduation Year/Date"
                    placeholder="e.g. May 2021"
                    value={edu.graduationDate || ''}
                    onChange={(e) => handleUpdateEducation(edu.id, { graduationDate: e.target.value })}
                  />
                  <Input
                    label="GPA / Honors (optional)"
                    placeholder="e.g. 3.8 / 4.0"
                    value={edu.gpa || ''}
                    onChange={(e) => handleUpdateEducation(edu.id, { gpa: e.target.value })}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={handleAddEducation} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Education Entry
          </Button>
        </div>
      )}
    </div>
  );
};

