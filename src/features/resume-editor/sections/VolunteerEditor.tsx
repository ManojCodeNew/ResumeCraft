import React from 'react';
import { VolunteerSection, VolunteerEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface VolunteerEditorProps {
  section: VolunteerSection;
  onChange: (updated: VolunteerSection) => void;
}

export const VolunteerEditor: React.FC<VolunteerEditorProps> = ({ section, onChange }) => {
  const handleAdd = () => {
    const newEntry: VolunteerEntry = {
      id: generateId('vol'),
      role: '',
      organization: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      summary: '',
    };
    onChange({
      ...section,
      entries: [...section.entries, newEntry],
    });
  };

  const handleUpdate = (id: string, updates: Partial<VolunteerEntry>) => {
    onChange({
      ...section,
      entries: section.entries.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    });
  };

  const handleDelete = (id: string) => {
    onChange({
      ...section,
      entries: section.entries.filter((v) => v.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {section.entries.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No volunteer experience added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Volunteer Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.entries.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  {item.role || 'Volunteer'} {item.organization && `at ${item.organization}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <Input
                  label="Role *"
                  placeholder="e.g. Volunteer Coding Instructor"
                  value={item.role}
                  onChange={(e) => handleUpdate(item.id, { role: e.target.value })}
                />
                <Input
                  label="Organization *"
                  placeholder="e.g. Code for Good"
                  value={item.organization}
                  onChange={(e) => handleUpdate(item.id, { organization: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Start Date"
                    placeholder="e.g. 2021"
                    value={item.startDate || ''}
                    onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })}
                  />
                  <Input
                    label="End Date"
                    placeholder="e.g. Present"
                    value={item.isCurrent ? 'Present' : item.endDate || ''}
                    onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })}
                  />
                </div>
              </div>
              <Textarea
                label="Impact Summary"
                rows={2}
                placeholder="Mentored 20+ students in web development..."
                value={item.summary || ''}
                onChange={(e) => handleUpdate(item.id, { summary: e.target.value })}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Volunteer Entry
          </Button>
        </div>
      )}
    </div>
  );
};

