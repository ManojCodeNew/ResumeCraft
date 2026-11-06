import React from 'react';
import { ProjectsSection, ProjectEntry } from '@/types/resume';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/utils/id';

interface ProjectsEditorProps {
  section: ProjectsSection;
  onChange: (updated: ProjectsSection) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ section, onChange }) => {
  const handleAddProject = () => {
    const newProject: ProjectEntry = {
      id: generateId('proj'),
      title: '',
      role: '',
      url: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: [],
      technologies: [],
    };
    onChange({
      ...section,
      entries: [newProject, ...section.entries],
    });
  };

  const handleUpdateProject = (id: string, updates: Partial<ProjectEntry>) => {
    onChange({
      ...section,
      entries: section.entries.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const handleDeleteProject = (id: string) => {
    onChange({
      ...section,
      entries: section.entries.filter((p) => p.id !== id),
    });
  };

  const handleAddHighlight = (projId: string) => {
    const proj = section.entries.find((p) => p.id === projId);
    if (!proj) return;
    const currentHighlights = proj.highlights || [];
    handleUpdateProject(projId, { highlights: [...currentHighlights, ''] });
  };

  const handleUpdateHighlight = (projId: string, index: number, text: string) => {
    const proj = section.entries.find((p) => p.id === projId);
    if (!proj || !proj.highlights) return;
    const updated = [...proj.highlights];
    updated[index] = text;
    handleUpdateProject(projId, { highlights: updated });
  };

  const handleDeleteHighlight = (projId: string, index: number) => {
    const proj = section.entries.find((p) => p.id === projId);
    if (!proj || !proj.highlights) return;
    const updated = proj.highlights.filter((_, i) => i !== index);
    handleUpdateProject(projId, { highlights: updated });
  };

  return (
    <div className="space-y-4">
      {section.entries.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500 mb-2">No projects added yet.</p>
          <Button variant="outline" size="sm" onClick={handleAddProject}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {section.entries.map((project, index) => (
            <div
              key={project.id}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  #{index + 1}: {project.title || 'Untitled Project'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 px-2 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Project Title *"
                  placeholder="e.g. Real-Time Analytics Dashboard"
                  value={project.title}
                  onChange={(e) => handleUpdateProject(project.id, { title: e.target.value })}
                />
                <Input
                  label="Role / Contribution"
                  placeholder="e.g. Lead Frontend Developer"
                  value={project.role || ''}
                  onChange={(e) => handleUpdateProject(project.id, { role: e.target.value })}
                />
                <Input
                  label="Project URL"
                  placeholder="https://..."
                  value={project.url || ''}
                  onChange={(e) => handleUpdateProject(project.id, { url: e.target.value })}
                />
                <Input
                  label="Technologies (comma-separated)"
                  placeholder="React, TypeScript, Redux, Tailwind"
                  value={project.technologies ? project.technologies.join(', ') : ''}
                  onChange={(e) =>
                    handleUpdateProject(project.id, {
                      technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />
              </div>

              <Textarea
                label="Project Description"
                rows={2}
                placeholder="Brief summary of the project scope and results..."
                value={project.description || ''}
                onChange={(e) => handleUpdateProject(project.id, { description: e.target.value })}
              />

              {/* Bullet highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Highlights & Metrics (Bullet Points)
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddHighlight(project.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 h-6 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Bullet
                  </Button>
                </div>

                {project.highlights && project.highlights.length > 0 ? (
                  <div className="space-y-2">
                    {project.highlights.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-2 text-xs font-mono">•</span>
                        <Textarea
                          rows={2}
                          placeholder="Implemented caching which lowered query latency by 45%..."
                          value={bullet}
                          onChange={(e) => handleUpdateHighlight(project.id, bIdx, e.target.value)}
                          className="flex-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteHighlight(project.id, bIdx)}
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

          <Button variant="outline" size="sm" onClick={handleAddProject} className="w-full">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Another Project
          </Button>
        </div>
      )}
    </div>
  );
};

