import React from 'react';
import { CustomSection, CustomEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface CustomSectionEditorProps {
  section: CustomSection;
  onChange: (updated: CustomSection) => void;
}

export const CustomSectionEditor: React.FC<CustomSectionEditorProps> = ({ section, onChange }) => {
  const handleToggleLayout = (layout: 'entries' | 'text') => {
    onChange({
      ...section,
      layout,
    });
  };

  const handleAddEntry = () => {
    const newEntry: CustomEntry = {
      id: generateId('cst_ent'),
      title: '',
      subtitle: '',
      date: '',
      description: '',
      fields: [],
    };
    onChange({
      ...section,
      entries: [...(section.entries || []), newEntry],
    });
  };

  const handleUpdateEntry = (id: string, updates: Partial<CustomEntry>) => {
    onChange({
      ...section,
      entries: (section.entries || []).map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const handleDeleteEntry = (id: string) => {
    onChange({
      ...section,
      entries: (section.entries || []).filter((e) => e.id !== id),
    });
  };

  const handleAddField = (entryId: string) => {
    const entry = (section.entries || []).find((e) => e.id === entryId);
    if (!entry) return;
    const currentFields = entry.fields || [];
    handleUpdateEntry(entryId, {
      fields: [...currentFields, { id: generateId('cst_fld'), label: '', value: '' }],
    });
  };

  const handleUpdateField = (entryId: string, fieldId: string, updates: { label?: string; value?: string }) => {
    const entry = (section.entries || []).find((e) => e.id === entryId);
    if (!entry || !entry.fields) return;
    const updated = entry.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f));
    handleUpdateEntry(entryId, { fields: updated });
  };

  const handleDeleteField = (entryId: string, fieldId: string) => {
    const entry = (section.entries || []).find((e) => e.id === entryId);
    if (!entry || !entry.fields) return;
    const updated = entry.fields.filter((f) => f.id !== fieldId);
    handleUpdateEntry(entryId, { fields: updated });
  };

  return (
    <div className="space-y-4">
      {/* Layout Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg w-fit text-xs">
        <button
          type="button"
          onClick={() => handleToggleLayout('entries')}
          className={`px-3 py-1 rounded font-medium transition-colors ${
            section.layout === 'entries'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Structured Entries
        </button>
        <button
          type="button"
          onClick={() => handleToggleLayout('text')}
          className={`px-3 py-1 rounded font-medium transition-colors ${
            section.layout === 'text'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Freeform Paragraph
        </button>
      </div>

      {section.layout === 'text' ? (
        <Textarea
          label="Section Text Content"
          rows={5}
          placeholder="Enter custom content for this section..."
          value={section.textContent || ''}
          onChange={(e) => onChange({ ...section, textContent: e.target.value })}
        />
      ) : (
        <div className="space-y-4">
          {(!section.entries || section.entries.length === 0) ? (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-sm text-slate-500 mb-2">No entries in this custom section yet.</p>
              <Button variant="outline" size="sm" onClick={handleAddEntry}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add First Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {section.entries.map((entry) => (
                <div key={entry.id} className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-700">{entry.title || 'Untitled Entry'}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 px-2 text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <Input
                      label="Title *"
                      placeholder="e.g. Lead Project / Workshop"
                      value={entry.title}
                      onChange={(e) => handleUpdateEntry(entry.id, { title: e.target.value })}
                    />
                    <Input
                      label="Subtitle / Context"
                      placeholder="e.g. Keynote Speaker"
                      value={entry.subtitle || ''}
                      onChange={(e) => handleUpdateEntry(entry.id, { subtitle: e.target.value })}
                    />
                    <Input
                      label="Date / Period"
                      placeholder="e.g. Spring 2024"
                      value={entry.date || ''}
                      onChange={(e) => handleUpdateEntry(entry.id, { date: e.target.value })}
                    />
                  </div>
                  <Textarea
                    label="Description"
                    rows={2}
                    placeholder="Details..."
                    value={entry.description || ''}
                    onChange={(e) => handleUpdateEntry(entry.id, { description: e.target.value })}
                  />

                  {/* Dynamic key-value fields inside entry */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-600">Custom Attributes / Tags</span>
                      <button
                        type="button"
                        onClick={() => handleAddField(entry.id)}
                        className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" /> Add Attribute
                      </button>
                    </div>
                    {entry.fields && entry.fields.length > 0 && (
                      <div className="space-y-1.5">
                        {entry.fields.map((f) => (
                          <div key={f.id} className="flex items-center gap-2">
                            <Input
                              placeholder="Label (e.g. Role)"
                              value={f.label}
                              onChange={(e) => handleUpdateField(entry.id, f.id, { label: e.target.value })}
                              className="w-1/3 text-xs h-7"
                            />
                            <Input
                              placeholder="Value"
                              value={f.value}
                              onChange={(e) => handleUpdateField(entry.id, f.id, { value: e.target.value })}
                              className="flex-1 text-xs h-7"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteField(entry.id, f.id)}
                              className="text-slate-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddEntry} className="w-full">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Another Entry
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

