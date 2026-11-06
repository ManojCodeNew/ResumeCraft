import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadResumesThunk, createNewResumeThunk, duplicateResumeThunk, deleteResumeThunk } from '@/store/slices/resumesListSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal, Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  FilePlus2,
  Copy,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Palette,
  Layers,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resumes } = useAppSelector((state) => state.resumesList);
  const availableTemplates = useAppSelector((state) => state.templates.availableTemplates);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTemplateId, setNewTemplateId] = useState('ats-classic');
  const [isMaster, setIsMaster] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(loadResumesThunk());
  }, [dispatch]);

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

  const handleDuplicate = async (sourceId: string) => {
    const source = resumes.find((r) => r.id === sourceId);
    if (!source) return;
    const action = await dispatch(duplicateResumeThunk({ source }));
    if (duplicateResumeThunk.fulfilled.match(action)) {
      navigate(`/edit/${action.payload.id}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidateId) return;
    await dispatch(deleteResumeThunk(deleteCandidateId));
    setDeleteCandidateId(null);
  };

  const recentResumes = [...resumes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const masterCount = resumes.filter((r) => r.isMaster).length;
  const versionsCount = resumes.length - masterCount;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-blue-400/30">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-200" />
            <span>Private & Local • 100% User Authored • Zero AI</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Design Resumes with Precision & Complete Control
          </h1>
          <p className="text-sm text-blue-100 sm:text-base leading-relaxed">
            Create tailored, ATS-conscious resumes for every application. Your content stays strictly
            yours, persisted in your browser's local database.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                setNewTitle('Master Resume');
                setIsMaster(true);
                setIsCreateModalOpen(true);
              }}
              className="gap-2 font-semibold text-blue-900 bg-white hover:bg-blue-50"
            >
              <FilePlus2 className="h-4 w-4" />
              <span>Create New Resume</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/templates')}
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Palette className="h-4 w-4 mr-2" />
              Explore Templates
            </Button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Total Resumes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{resumes.length}</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Master Resumes</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{masterCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">Tailored Versions</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{versionsCount}</h3>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Copy className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recently Edited Resumes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recently Edited Resumes</h2>
            <p className="text-xs text-slate-500">Quickly jump back into editing your latest documents.</p>
          </div>
          {resumes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/resumes')}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              <span>View all ({resumes.length})</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No resumes yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
              Get started by creating your master resume. You can later duplicate it into customized versions for specific job targets.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setNewTitle('Master Resume');
                setIsMaster(true);
                setIsCreateModalOpen(true);
              }}
              className="gap-2"
            >
              <FilePlus2 className="h-4 w-4" />
              <span>Create Your First Resume</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentResumes.map((resume) => (
              <Card key={resume.id} hoverable className="flex flex-col justify-between group">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {resume.isMaster ? (
                      <Badge variant="default" className="text-[10px]">
                        Master Resume
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Tailored Copy
                      </Badge>
                    )}
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
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>
                      {resume.sections.filter((s) => s.visible).length} visible sections
                    </span>
                  </div>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicate(resume.id)}
                      title="Duplicate version"
                      className="h-7 w-7 text-slate-500 hover:text-slate-800"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteCandidateId(resume.id)}
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
      </div>

      {/* Available Templates Quick Showcase */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Featured Templates</h2>
            <p className="text-xs text-slate-500">
              Clean, ATS-conscious designs tested for optimal readability and export accuracy.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/templates')}
            className="text-xs text-blue-600"
          >
            <span>Browse All</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    {template.category}
                  </Badge>
                  <span className="text-[10px] text-slate-400">v{template.version}.0</span>
                </div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-xs">{template.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewTemplateId(template.id);
                    setNewTitle(`Resume (${template.name})`);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full text-xs"
                >
                  Create with this Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Resume Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Resume"
        description="Choose a title and starting template for your resume."
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Resume Title *"
            placeholder="e.g. Master Resume, Senior React Developer"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Template</label>
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

      {/* Confirm Delete Resume Modal */}
      <ConfirmModal
        isOpen={deleteCandidateId !== null}
        onClose={() => setDeleteCandidateId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Resume?"
        message="Are you sure you want to permanently delete this resume? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};
