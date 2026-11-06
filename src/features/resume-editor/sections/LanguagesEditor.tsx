import React from 'react';
import { LanguagesSection, LanguageEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface LanguagesEditorProps {
  section: LanguagesSection;
  onChange: (updated: LanguagesSection) => void;
}

export const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ section, onChange }) => {
  const handleAdd = () => {
    const newEntry: LanguageEntry = {
      id: generateId('lang'),
      language: '',
      proficiency: 'Fluent',
    };
    onChange({
      ...section,
      entries: [...section.entries, newEntry],
    });
  };

  const handleUpdate = (id: string, updates: Partial<LanguageEntry>) => {
    onChange({
      ...section,
      entries: section.entries.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    });
  };

  const handleDelete = (id: string) => {
    onChange({
      ...section,
      entries: section.entries.filter((l) => l.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {section.entries.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No languages added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Language
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {section.entries.map((lang) => (
            <div key={lang.id} className="flex items-center gap-2 p-2 bg-slate-50/50 border border-slate-200 rounded-md">
              <Input
                placeholder="Language (e.g. English, Spanish)"
                value={lang.language}
                onChange={(e) => handleUpdate(lang.id, { language: e.target.value })}
                className="w-1/2 text-xs"
              />
              <Input
                placeholder="Proficiency (e.g. Native, Fluent, Intermediate)"
                value={lang.proficiency || ''}
                onChange={(e) => handleUpdate(lang.id, { proficiency: e.target.value })}
                className="flex-1 text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(lang.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Language
          </Button>
        </div>
      )}
    </div>
  );
};

