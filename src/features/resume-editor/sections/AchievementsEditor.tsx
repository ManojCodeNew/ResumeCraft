import React from 'react';
import { AchievementsSection, AchievementEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface AchievementsEditorProps {
  section: AchievementsSection;
  onChange: (updated: AchievementsSection) => void;
}

export const AchievementsEditor: React.FC<AchievementsEditorProps> = ({ section, onChange }) => {
  const handleAdd = () => {
    const newEntry: AchievementEntry = {
      id: generateId('ach'),
      title: '',
      date: '',
      description: '',
    };
    onChange({
      ...section,
      entries: [...section.entries, newEntry],
    });
  };

  const handleUpdate = (id: string, updates: Partial<AchievementEntry>) => {
    onChange({
      ...section,
      entries: section.entries.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  };

  const handleDelete = (id: string) => {
    onChange({
      ...section,
      entries: section.entries.filter((a) => a.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {section.entries.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No achievements added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Achievement
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.entries.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">{item.title || 'Untitled Achievement'}</span>
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
                  label="Title / Honor *"
                  placeholder="e.g. 1st Place National Hackathon Winner"
                  value={item.title}
                  onChange={(e) => handleUpdate(item.id, { title: e.target.value })}
                />
                <Input
                  label="Date / Year"
                  placeholder="e.g. 2023"
                  value={item.date || ''}
                  onChange={(e) => handleUpdate(item.id, { date: e.target.value })}
                />
              </div>
              <Textarea
                label="Description"
                rows={2}
                placeholder="Brief description of the achievement..."
                value={item.description || ''}
                onChange={(e) => handleUpdate(item.id, { description: e.target.value })}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Achievement
          </Button>
        </div>
      )}
    </div>
  );
};

