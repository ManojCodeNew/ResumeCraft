import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  loadResumesThunk,
  createNewResumeThunk,
  duplicateResumeThunk,
  deleteResumeThunk,
  saveResumeThunk,
} from '@/store/slices/resumesListSlice';
import { backupService } from '@/services/backup/backupService';
import { ResumeDocument } from '@/types/resume';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import {
  FileText,
  FilePlus2,
  Copy,
  Trash2,
  Edit2,
  Download,
  Search,
  Filter,
} from 'lucide-react';

export const ResumesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { resumes } = useAppSelector((state) => state.resumesList);
  const availableTemplates = useAppSelector((state) => state.templates.availableTemplates);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'master' | 'tailored'>('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTemplateId, setNewTemplateId] = useState('ats-classic');
  const [isMaster, setIsMaster] = useState(false);

  // Rename states
  const [renameTarget, setRenameTarget] = useState<ResumeDocument | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Delete confirmation
  const [deleteCandidate, setDeleteCandidate] = useState<ResumeDocument | null>(null);

  useEffect(() => {
    dispatch(loadResumesThunk());
  }, [dispatch]);

  // Check query param for "?new=true"
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsCreateModalOpen(true);
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const action = await dispatch(
      createNewResumeThunk({
        title: newTitle.trim(),
        templateId: newTemplateId,
        isMaster,
      })
    );
    if (createNewResumeThunk.fulfilled.match(action)) {
      setIsCreateModalOpen(false);
      setNewTitle('');
      navigate(`/edit/${action.payload.id}`);
    }
  };

  const handleDuplicate = async (source: ResumeDocument) => {
    const action = await dispatch(duplicateResumeThunk({ source }));
    if (duplicateResumeThunk.fulfilled.match(action)) {
      navigate(`/edit/${action.payload.id}`);
    }
  };

  const handleStartRename = (resume: ResumeDocument) => {
    setRenameTarget(resume);
    setRenameValue(resume.title);
  };

  const handleSaveRename = async () => {
    if (!renameTarget || !renameValue.trim()) return;
    const updated = {
      ...renameTarget,
      title: renameValue.trim(),
      updatedAt: new Date().toISOString(),
    };
    await dispatch(saveResumeThunk(updated));
    setRenameTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    await dispatch(deleteResumeThunk(deleteCandidate.id));
    setDeleteCandidate(null);
  };

  const filteredResumes = resumes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.personalInfo.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.personalInfo.headline?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'master') return r.isMaster;
    if (filterType === 'tailored') return !r.isMaster;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Resumes</h1>
          <p className="text-xs text-slate-500">
            Organize, duplicate, and tailor multiple resume versions for specific applications.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setNewTitle('Untitled Resume');
            setIsMaster(false);
            setIsCreateModalOpen(true);
          }}
          className="gap-2 text-xs"
        >
          <FilePlus2 className="h-4 w-4" />
          <span>New Resume</span>
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resumes by title, role, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({resumes.length})
          </button>
          <button
            onClick={() => setFilterType('master')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              filterType === 'master'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Master Resumes ({resumes.filter((r) => r.isMaster).length})
          </button>
          <button
            onClick={() => setFilterType('tailored')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              filterType === 'tailored'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tailored Copies ({resumes.filter((r) => !r.isMaster).length})
          </button>
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredResumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <FileText className="h-10 w-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No resumes match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {searchTerm
              ? `No resumes found matching "${searchTerm}". Try a different search term.`
              : 'You have not created any resumes yet in this category.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResumes.map((resume) => (
            <Card key={resume.id} hoverable className="flex flex-col justify-between group">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {resume.isMaster ? (
                      <Badge variant="default" className="text-[10px]">
                        Master Resume
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Tailored Copy
                      </Badge>
                    )}
                    <span className="text-[10px] text-slate-500 font-medium">
                      {resume.templateId}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-base group-hover:text-blue-600 transition-colors truncate">
                  {resume.title}
                </CardTitle>
                <CardDescription className="text-xs truncate">
                  {resume.personalInfo.fullName
                    ? `${resume.personalInfo.fullName} • ${resume.personalInfo.headline || 'No title set'}`
                    : 'Personal details unpopulated'}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-xs text-slate-500 py-1">
                <p className="text-[11px] text-slate-500">
                  {resume.sections.filter((s) => s.visible).length} visible sections (
                  {resume.sections.map((s) => s.title).slice(0, 3).join(', ')}
                  {resume.sections.length > 3 ? '...' : ''})
                </p>
              </CardContent>

              <CardFooter className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/edit/${resume.id}`)}
                  className="text-xs h-7 px-3"
                >
                  Edit Resume
                </Button>

                <div className="flex items-center gap-1">
                  {/* Duplicate */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDuplicate(resume)}
                    title="Duplicate version"
                    className="h-7 w-7 text-slate-500 hover:text-slate-800"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>

                  {/* Rename */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleStartRename(resume)}
                    title="Rename resume"
                    className="h-7 w-7 text-slate-500 hover:text-slate-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>

                  {/* Export JSON single */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => backupService.exportSingleResume(resume)}
                    title="Download JSON data"
                    className="h-7 w-7 text-slate-500 hover:text-slate-800"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteCandidate(resume)}
                    title="Delete resume"
                    className="h-7 w-7 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Resume"
        description="Choose a title and template for your new resume."
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Resume Title *"
            placeholder="e.g. Master Resume, React Specialist, Fullstack"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Template</label>
            <select
              value={newTemplateId}
              onChange={(e) => setNewTemplateId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {availableTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isMaster}
              onChange={(e) => setIsMaster(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span className="text-xs text-slate-700 font-medium">Designate as Master Resume</span>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate} disabled={!newTitle.trim()}>
              Create Resume
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        title="Rename Resume"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <Input
            label="New Title"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveRename();
            }}
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveRename} disabled={!renameValue.trim()}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Safe Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteCandidate !== null}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Resume?"
        message={`Are you sure you want to delete "${deleteCandidate?.title}"? All sections and edits in this document will be permanently removed.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};
