import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createNewResumeThunk } from '@/store/slices/resumesListSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, FilePlus2, Eye } from 'lucide-react';
import { ResumeDocument } from '@/types/resume';
import { createDefaultResume } from '@/utils/resumeDefaults';
import { getTemplateRenderer } from '@/templates/registry/templateRegistry';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const availableTemplates = useAppSelector((state) => state.templates.availableTemplates);

  const [selectedTemplateForCreate, setSelectedTemplateForCreate] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // Sample resume for previewing templates in action
  const sampleResume: ResumeDocument = {
    ...createDefaultResume('Sample Template Preview', previewTemplateId || 'ats-classic'),
    personalInfo: {
      fullName: 'Jordan Taylor',
      headline: 'Staff Software Architect & Tech Lead',
      email: 'jordan.taylor@example.com',
      phone: '+1 (555) 432-8765',
      location: 'Seattle, WA',
      linkedinUrl: 'https://linkedin.com',
      githubUrl: 'https://github.com',
      portfolioUrl: 'https://example.com',
      customLinks: [],
    },
    sections: [
      {
        id: 's_sum',
        type: 'summary',
        title: 'Professional Summary',
        visible: true,
        order: 0,
        content:
          'Passionate engineering leader with 10+ years architecting fault-tolerant web applications. Deep expertise in React ecosystem, distributed TypeScript architectures, and high-throughput real-time systems.',
      },
      {
        id: 's_exp',
        type: 'experience',
        title: 'Work Experience',
        visible: true,
        order: 1,
        entries: [
          {
            id: 'e1',
            position: 'Principal Frontend Engineer',
            company: 'TechSphere Global',
            location: 'Seattle, WA',
            startDate: '2021',
            endDate: 'Present',
            isCurrent: true,
            description: 'Directed architectural modernization of core enterprise web applications.',
            highlights: [
              'Spearheaded transition to modular micro-frontends, decreasing release cycle from 2 weeks to daily deployments.',
              'Mentored 14 senior engineers and established engineering quality guidelines.',
            ],
          },
        ],
      },
      {
        id: 's_skills',
        type: 'skills',
        title: 'Technical Skills',
        visible: true,
        order: 2,
        categories: [
          {
            id: 'c1',
            categoryName: 'Languages & Core',
            skills: ['TypeScript', 'JavaScript (ESNext)', 'HTML5', 'CSS3/Tailwind'],
          },
          {
            id: 'c2',
            categoryName: 'Frameworks & Libraries',
            skills: ['React', 'Redux Toolkit', 'Next.js', 'Vite', 'Node.js'],
          },
        ],
      },
    ],
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplateForCreate || !resumeTitle.trim()) return;
    const action = await dispatch(
      createNewResumeThunk({
        title: resumeTitle.trim(),
        templateId: selectedTemplateForCreate,
        isMaster: false,
      })
    );
    if (createNewResumeThunk.fulfilled.match(action)) {
      setSelectedTemplateForCreate(null);
      setResumeTitle('');
      navigate(`/edit/${action.payload.id}`);
    }
  };

  const PreviewComponent = previewTemplateId
    ? getTemplateRenderer(previewTemplateId)
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Resume Templates</h1>
        <p className="text-xs text-slate-500">
          Choose from professionally crafted, ATS-conscious designs. All templates support all resume sections
          and custom sections seamlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availableTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Visual Thumbnail Area */}
            <div className="h-44 bg-slate-100 border-b border-slate-200 flex flex-col justify-between p-4 relative group">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="text-[10px]">
                  {template.category}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">A4 Ready</span>
              </div>

              {/* Simplified mock wireframe */}
              <div className="w-full bg-white rounded shadow-2xs p-3 space-y-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="h-2.5 w-1/3 bg-slate-800 rounded-xs" />
                <div className="h-1.5 w-1/2 bg-slate-300 rounded-xs" />
                <div className="h-[1px] w-full bg-slate-200 my-1" />
                <div className="h-1.5 w-3/4 bg-slate-300 rounded-xs" />
                <div className="h-1.5 w-2/3 bg-slate-200 rounded-xs" />
              </div>

              <div className="flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPreviewTemplateId(template.id)}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview Layout</span>
                </Button>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription className="text-xs">{template.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 text-xs text-slate-600 py-2">
              <div className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Linear ATS-friendly single column structure</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Compatible with all standard & custom sections</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>High-fidelity A4 browser print stylesheet</span>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedTemplateForCreate(template.id);
                  setResumeTitle(`My ${template.name} Resume`);
                }}
                className="w-full text-xs gap-1.5"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                <span>Use This Template</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Live Preview Modal */}
      <Modal
        isOpen={previewTemplateId !== null}
        onClose={() => setPreviewTemplateId(null)}
        title="Template Preview"
        description="Here is how sample content renders in this design."
        maxWidth="lg"
      >
        <div className="max-h-[70vh] overflow-y-auto p-4 bg-slate-100 rounded-lg border border-slate-200 flex justify-center">
          <div className="bg-white shadow-md p-8 rounded-sm w-[210mm] max-w-full text-xs">
            {PreviewComponent && <PreviewComponent resume={sampleResume} isPreview />}
          </div>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={selectedTemplateForCreate !== null}
        onClose={() => setSelectedTemplateForCreate(null)}
        title="Create Resume with Template"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Resume Title *"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setSelectedTemplateForCreate(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateFromTemplate}
              disabled={!resumeTitle.trim()}
            >
              Start Editing
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
