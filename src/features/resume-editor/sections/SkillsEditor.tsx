import React from 'react';
import { SkillsSection, SkillCategory } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface SkillsEditorProps {
  section: SkillsSection;
  onChange: (updated: SkillsSection) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ section, onChange }) => {
  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: generateId('cat'),
      categoryName: '',
      skills: [],
    };
    onChange({
      ...section,
      categories: [...section.categories, newCat],
    });
  };

  const handleUpdateCategory = (id: string, updates: Partial<SkillCategory>) => {
    onChange({
      ...section,
      categories: section.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const handleDeleteCategory = (id: string) => {
    onChange({
      ...section,
      categories: section.categories.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      {section.categories.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No skill categories added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Skill Category
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {section.categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-slate-50/50 border border-slate-200 rounded-lg"
            >
              <Input
                placeholder="Category (e.g. Languages, Frameworks, Tools)"
                value={category.categoryName}
                onChange={(e) => handleUpdateCategory(category.id, { categoryName: e.target.value })}
                className="w-full sm:w-1/3 text-xs"
              />
              <Input
                placeholder="Skills (comma-separated, e.g. React, TypeScript, Node.js, GraphQL)"
                value={category.skills.join(', ')}
                onChange={(e) =>
                  handleUpdateCategory(category.id, {
                    skills: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full sm:flex-1 text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0"
                title="Remove category"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={handleAddCategory} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Skill Category
          </Button>
        </div>
      )}
    </div>
  );
};

