import React from 'react';
import { PublicationsSection, PublicationEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface PublicationsEditorProps {
  section: PublicationsSection;
  onChange: (updated: PublicationsSection) => void;
}

export const PublicationsEditor: React.FC<PublicationsEditorProps> = ({ section, onChange }) => {
  const handleAdd = () => {
    const newEntry: PublicationEntry = {
      id: generateId('pub'),
      title: '',
      publisher: '',
      releaseDate: '',
      url: '',
      summary: '',
    };
    onChange({
      ...section,
      entries: [...section.entries, newEntry],
    });
  };

  const handleUpdate = (id: string, updates: Partial<PublicationEntry>) => {
    onChange({
      ...section,
      entries: section.entries.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const handleDelete = (id: string) => {
    onChange({
      ...section,
      entries: section.entries.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {section.entries.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No publications added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Publication
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.entries.map((pub) => (
            <div key={pub.id} className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">{pub.title || 'Untitled Publication'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(pub.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <Input
                  label="Title *"
                  placeholder="e.g. Scalable State Management in Distributed SPAs"
                  value={pub.title}
                  onChange={(e) => handleUpdate(pub.id, { title: e.target.value })}
                />
                <Input
                  label="Publisher / Journal"
                  placeholder="e.g. IEEE Software"
                  value={pub.publisher || ''}
                  onChange={(e) => handleUpdate(pub.id, { publisher: e.target.value })}
                />
                <Input
                  label="Date / Year"
                  placeholder="e.g. June 2023"
                  value={pub.releaseDate || ''}
                  onChange={(e) => handleUpdate(pub.id, { releaseDate: e.target.value })}
                />
                <Input
                  label="URL / DOI"
                  placeholder="https://..."
                  value={pub.url || ''}
                  onChange={(e) => handleUpdate(pub.id, { url: e.target.value })}
                />
              </div>
              <Textarea
                label="Summary"
                rows={2}
                placeholder="Brief summary..."
                value={pub.summary || ''}
                onChange={(e) => handleUpdate(pub.id, { summary: e.target.value })}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Publication
          </Button>
        </div>
      )}
    </div>
  );
};

