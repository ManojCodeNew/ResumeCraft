import React, { useState } from 'react';
import { ResumeSection, SectionType } from '@/types/resume';
import {
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  GripVertical,
  Edit2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { SummaryEditor } from './sections/SummaryEditor';
import { ExperienceEditor } from './sections/ExperienceEditor';
import { ProjectsEditor } from './sections/ProjectsEditor';
import { SkillsEditor } from './sections/SkillsEditor';
import { EducationEditor } from './sections/EducationEditor';
import { CertificationsEditor } from './sections/CertificationsEditor';
import { AchievementsEditor } from './sections/AchievementsEditor';
import { LanguagesEditor } from './sections/LanguagesEditor';
import { PublicationsEditor } from './sections/PublicationsEditor';
import { VolunteerEditor } from './sections/VolunteerEditor';
import { CustomSectionEditor } from './sections/CustomSectionEditor';
import { createNewSection } from '@/utils/resumeDefaults';

interface SectionListManagerProps {
  sections: ResumeSection[];
  onUpdateSection: (section: ResumeSection) => void;
  onReorderSections: (sections: ResumeSection[]) => void;
  onAddSection: (section: ResumeSection) => void;
  onRemoveSection: (sectionId: string) => void;
  onToggleVisibility: (sectionId: string) => void;
  onUpdateTitle: (sectionId: string, title: string) => void;
}

const SECTION_OPTIONS: { type: SectionType; label: string; description: string }[] = [
  { type: 'summary', label: 'Professional Summary', description: 'Concise background overview and core strengths' },
  { type: 'experience', label: 'Work Experience', description: 'Employment history, roles, and achievements' },
  { type: 'projects', label: 'Projects', description: 'Key technical projects, architecture, and live links' },
  { type: 'skills', label: 'Technical Skills', description: 'Categorized technical capabilities and toolsets' },
  { type: 'education', label: 'Education', description: 'Degrees, universities, honors, and dates' },
  { type: 'certifications', label: 'Certifications', description: 'Professional certificates and credentials' },
  { type: 'achievements', label: 'Achievements & Awards', description: 'Honors, competitions, and milestones' },
  { type: 'languages', label: 'Languages', description: 'Spoken languages and proficiencies' },
  { type: 'publications', label: 'Publications', description: 'Published papers, articles, and research' },
  { type: 'volunteer', label: 'Volunteer Experience', description: 'Community leadership and service' },
  { type: 'custom', label: 'Custom Section', description: 'Add your own section with custom headings & fields' },
];

export const SectionListManager: React.FC<SectionListManagerProps> = ({
  sections,
  onUpdateSection,
  onReorderSections,
  onAddSection,
  onRemoveSection,
  onToggleVisibility,
  onUpdateTitle,
}) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(sections[0]?.id || null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [deleteConfirmSection, setDeleteConfirmSection] = useState<ResumeSection | null>(null);

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...sortedSections];
    const prev = items[index - 1]!;
    const curr = items[index]!;
    items[index - 1] = curr;
    items[index] = prev;
    onReorderSections(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedSections.length - 1) return;
    const items = [...sortedSections];
    const next = items[index + 1]!;
    const curr = items[index]!;
    items[index + 1] = curr;
    items[index] = next;
    onReorderSections(items);
  };

  const handleStartTitleEdit = (section: ResumeSection) => {
    setEditingTitleId(section.id);
    setTitleDraft(section.title);
  };

  const handleSaveTitleEdit = (sectionId: string) => {
    if (titleDraft.trim()) {
      onUpdateTitle(sectionId, titleDraft.trim());
    }
    setEditingTitleId(null);
  };

  const handleCreateSection = (type: SectionType, label: string) => {
    const newSec = createNewSection(type, label, sections.length);
    onAddSection(newSec);
    setIsAddModalOpen(false);
    setOpenSectionId(newSec.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Resume Sections</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Section</span>
        </Button>
      </div>

      <div className="space-y-3">
        {sortedSections.map((section, index) => {
          const isOpen = openSectionId === section.id;
          const isFirst = index === 0;
          const isLast = index === sortedSections.length - 1;

          return (
            <div
              key={section.id}
              className={`rounded-lg border transition-all ${
                section.visible
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200/60 opacity-70'
              }`}
            >
              {/* Section Header Controls */}
              <div className="flex items-center justify-between px-4 py-3 select-none">
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                  <span className="text-slate-400">
                    <GripVertical className="h-4 w-4" />
                  </span>

                  {editingTitleId === section.id ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <Input
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        className="h-7 text-xs font-semibold py-0"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitleEdit(section.id);
                          if (e.key === 'Escape') setEditingTitleId(null);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveTitleEdit(section.id)}
                        className="h-7 w-7 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 truncate">
                      <button
                        onClick={() => setOpenSectionId(isOpen ? null : section.id)}
                        className="text-sm font-semibold text-slate-800 hover:text-blue-600 truncate text-left"
                      >
                        {section.title}
                      </button>
                      <button
                        onClick={() => handleStartTitleEdit(section)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                        title="Rename section"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Reorder Buttons */}
                  <button
                    disabled={isFirst}
                    onClick={() => handleMoveUp(index)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    disabled={isLast}
                    onClick={() => handleMoveDown(index)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => onToggleVisibility(section.id)}
                    className={`p-1 rounded ${
                      section.visible
                        ? 'text-slate-500 hover:text-blue-600'
                        : 'text-amber-500 hover:text-amber-700'
                    }`}
                    title={section.visible ? 'Hide section from resume' : 'Show section'}
                  >
                    {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  {/* Delete Section */}
                  <button
                    onClick={() => setDeleteConfirmSection(section)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded ml-1"
                    title="Delete section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                  {/* Expand / Collapse Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenSectionId(isOpen ? null : section.id)}
                    className="h-7 px-2 text-xs font-medium text-slate-600"
                  >
                    {isOpen ? 'Collapse' : 'Edit'}
                  </Button>
                </div>
              </div>

              {/* Section Content Editor Accordion Body */}
              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100">
                  <SectionRendererByType section={section} onChange={onUpdateSection} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Resume Section"
        description="Choose a standard section type or create a custom one."
        maxWidth="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
          {SECTION_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => handleCreateSection(opt.type, opt.label)}
              className="flex flex-col text-left p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
            >
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                {opt.label}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">{opt.description}</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Safe Confirmation Modal for Deleting Section */}
      <ConfirmModal
        isOpen={deleteConfirmSection !== null}
        onClose={() => setDeleteConfirmSection(null)}
        onConfirm={() => {
          if (deleteConfirmSection) {
            onRemoveSection(deleteConfirmSection.id);
            setDeleteConfirmSection(null);
          }
        }}
        title="Delete Section?"
        message={`Are you sure you want to remove the "${deleteConfirmSection?.title}" section? All content inside this section will be permanently deleted.`}
        confirmLabel="Delete Section"
        variant="danger"
      />
    </div>
  );
};

function SectionRendererByType({
  section,
  onChange,
}: {
  section: ResumeSection;
  onChange: (s: ResumeSection) => void;
}) {
  switch (section.type) {
    case 'summary':
      return <SummaryEditor section={section} onChange={onChange} />;
    case 'experience':
      return <ExperienceEditor section={section} onChange={onChange} />;
    case 'projects':
      return <ProjectsEditor section={section} onChange={onChange} />;
    case 'skills':
      return <SkillsEditor section={section} onChange={onChange} />;
    case 'education':
      return <EducationEditor section={section} onChange={onChange} />;
    case 'certifications':
      return <CertificationsEditor section={section} onChange={onChange} />;
    case 'achievements':
      return <AchievementsEditor section={section} onChange={onChange} />;
    case 'languages':
      return <LanguagesEditor section={section} onChange={onChange} />;
    case 'publications':
      return <PublicationsEditor section={section} onChange={onChange} />;
    case 'volunteer':
      return <VolunteerEditor section={section} onChange={onChange} />;
    case 'custom':
      return <CustomSectionEditor section={section} onChange={onChange} />;
    default:
      return null;
  }
}

