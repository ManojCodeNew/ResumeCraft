import React from 'react';
import { ExperienceSection, ExperienceEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface ExperienceEditorProps {
  section: ExperienceSection;
  onChange: (updated: ExperienceSection) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ section, onChange }) => {
  const handleAddEntry = () => {
    const newEntry: ExperienceEntry = {
      id: generateId('exp'),
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      highlights: [],
    };
    onChange({
      ...section,
      entries: [newEntry, ...section.entries],
    });
  };

  const handleUpdateEntry = (id: string, updates: Partial<ExperienceEntry>) => {
    onChange({
      ...section,
      entries: section.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    });
  };

  const handleDeleteEntry = (id: string) => {
    onChange({
      ...section,
      entries: section.entries.filter((entry) => entry.id !== id),
    });
  };

  const handleAddHighlight = (entryId: string) => {
    const entry = section.entries.find((e) => e.id === entryId);
    if (!entry) return;
    const currentHighlights = entry.highlights || [];
    handleUpdateEntry(entryId, { highlights: [...currentHighlights, ''] });
  };

  const handleUpdateHighlight = (entryId: string, index: number, text: string) => {
    const entry = section.entries.find((e) => e.id === entryId);
    if (!entry || !entry.highlights) return;
    const updated = [...entry.highlights];
    updated[index] = text;
    handleUpdateEntry(entryId, { highlights: updated });
  };

  const handleDeleteHighlight = (entryId: string, index: number) => {
    const entry = section.entries.find((e) => e.id === entryId);
    if (!entry || !entry.highlights) return;
    const updated = entry.highlights.filter((_, i) => i !== index);
    handleUpdateEntry(entryId, { highlights: updated });
  };

  return (
    <div className="space-y-4">
      {section.entries.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No work experience entries added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAddEntry}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Role
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {section.entries.map((entry, index) => (
            <div
              key={entry.id}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3 relative group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1}: {entry.position || 'Untitled Position'}{' '}
                  {entry.company && `at ${entry.company}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Job Title / Position *"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={entry.position}
                  onChange={(e) => handleUpdateEntry(entry.id, { position: e.target.value })}
                />
                <Input
                  label="Company Name *"
                  placeholder="e.g. Acme Corporation"
                  value={entry.company}
                  onChange={(e) => handleUpdateEntry(entry.id, { company: e.target.value })}
                />
                <Input
                  label="Location"
                  placeholder="e.g. New York, NY (Remote)"
                  value={entry.location || ''}
                  onChange={(e) => handleUpdateEntry(entry.id, { location: e.target.value })}
                />
                <div className="space-y-1">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Start Date"
                      placeholder="e.g. Jan 2022"
                      value={entry.startDate}
                      onChange={(e) => handleUpdateEntry(entry.id, { startDate: e.target.value })}
                    />
                    <Input
                      label="End Date"
                      placeholder="e.g. Present"
                      disabled={entry.isCurrent}
                      value={entry.isCurrent ? 'Present' : entry.endDate || ''}
                      onChange={(e) => handleUpdateEntry(entry.id, { endDate: e.target.value })}
                    />
                  </div>
                  <label className="flex items-center gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entry.isCurrent || false}
                      onChange={(e) =>
                        handleUpdateEntry(entry.id, {
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? '' : entry.endDate,
                        })
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <span className="text-xs text-slate-600 font-medium">I currently work here</span>
                  </label>
                </div>
              </div>

              {/* Bullet highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Key Achievements & Responsibilities (Bullet Points)
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddHighlight(entry.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 h-6 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Bullet
                  </Button>
                </div>

                {entry.highlights && entry.highlights.length > 0 ? (
                  <div className="space-y-2">
                    {entry.highlights.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-2 text-xs font-mono">•</span>
                        <Textarea
                          rows={2}
                          placeholder="Accomplished [X], measured by [Y], by doing [Z]..."
                          value={bullet}
                          onChange={(e) => handleUpdateHighlight(entry.id, bIdx, e.target.value)}
                          className="flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteHighlight(entry.id, bIdx)}
                          className="text-slate-400 hover:text-red-500 p-1 mt-1 rounded"
                          title="Remove bullet"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No bullet points added.</p>
                )}
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={handleAddEntry} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Experience Entry
          </Button>
        </div>
      )}
    </div>
  );
};
