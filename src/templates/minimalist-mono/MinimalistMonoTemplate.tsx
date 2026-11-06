import React from 'react';
import { ResumeDocument, ResumeSection } from '@/types/resume';

interface TemplateProps {
  resume: ResumeDocument;
  isPreview?: boolean;
}

export const MinimalistMonoTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, sections } = resume;
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="w-full bg-white text-slate-900 font-sans leading-relaxed selection:bg-slate-200 print:text-black">
      {/* Minimalist Header */}
      <header className="mb-5 pb-3 border-b-2 border-black">
        <h1 className="text-3xl font-light tracking-tight text-black">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        {personalInfo.headline && (
          <p className="text-xs font-medium text-slate-700 uppercase tracking-widest mt-1">
            {personalInfo.headline}
          </p>
        )}

        {/* Minimal Contact List */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedinUrl && (
            <span>
              •{' '}
              <a href={personalInfo.linkedinUrl} target="_blank" rel="noreferrer" className="underline">
                LinkedIn
              </a>
            </span>
          )}
          {personalInfo.githubUrl && (
            <span>
              •{' '}
              <a href={personalInfo.githubUrl} target="_blank" rel="noreferrer" className="underline">
                GitHub
              </a>
            </span>
          )}
          {personalInfo.portfolioUrl && (
            <span>
              •{' '}
              <a href={personalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="underline">
                Portfolio
              </a>
            </span>
          )}
          {personalInfo.customLinks?.map((link) => (
            <span key={link.id}>
              •{' '}
              <a href={link.url} target="_blank" rel="noreferrer" className="underline">
                {link.label}
              </a>
            </span>
          ))}
        </div>
      </header>

      {/* Sections Body */}
      <div className="space-y-4">
        {visibleSections.map((section) => (
          <MinimalistSectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};

function MinimalistSectionRenderer({ section }: { section: ResumeSection }) {
  switch (section.type) {
    case 'summary':
      if (!section.content.trim()) return null;
      return (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-300 pb-0.5">
            {section.title}
          </h2>
          <p className="text-xs text-slate-800 leading-normal text-justify whitespace-pre-line">
            {section.content}
          </p>
        </section>
      );

    case 'experience':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-300 pb-0.5">
            {section.title}
          </h2>
          <div className="space-y-3">
            {section.entries.map((entry) => (
              <div key={entry.id} className="space-y-1 text-xs">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-semibold text-black">{entry.position}</span>
                    <span className="text-slate-600">, {entry.company}</span>
                    {entry.location && <span className="text-slate-500"> ({entry.location})</span>}
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    {entry.startDate} {entry.startDate && (entry.endDate || entry.isCurrent) && '–'}{' '}
                    {entry.isCurrent ? 'Present' : entry.endDate}
                  </span>
                </div>
                {entry.description && <p className="text-slate-700">{entry.description}</p>}
                {entry.highlights && entry.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                    {entry.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case 'projects':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-300 pb-0.5">
            {section.title}
          </h2>
          <div className="space-y-2 text-xs">
            {section.entries.map((p) => (
              <div key={p.id} className="space-y-0.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-black">
                    {p.title}
                    {p.role && <span className="font-normal text-slate-600"> — {p.role}</span>}
                  </span>
                  {(p.startDate || p.endDate) && (
                    <span className="text-slate-500 text-[11px]">
                      {p.startDate} {p.startDate && p.endDate && '–'} {p.endDate}
                    </span>
                  )}
                </div>
                {p.technologies && p.technologies.length > 0 && (
                  <p className="text-[11px] text-slate-600">Tools: {p.technologies.join(', ')}</p>
                )}
                {p.description && <p className="text-slate-700">{p.description}</p>}
                {p.highlights && p.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                    {p.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case 'skills':
      if (section.categories.length === 0) return null;
      return (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-300 pb-0.5">
            {section.title}
          </h2>
          <div className="space-y-1 text-xs">
            {section.categories.map((c) => (
              <div key={c.id}>
                <span className="font-semibold text-black">{c.categoryName}: </span>
                <span className="text-slate-700">{c.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      );

    case 'education':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-300 pb-0.5">
            {section.title}
          </h2>
          <div className="space-y-1.5 text-xs">
            {section.entries.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <div>
                  <span className="font-semibold text-black">{edu.degree}</span>
                  <span className="text-slate-600">, {edu.institution}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{edu.graduationDate}</span>
              </div>
            ))}
          </div>
        </section>
      );

    case 'certifications':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-300 pb-0.5">
            {section.title}
          </h2>
          <div className="space-y-1 text-xs">
            {section.entries.map((c) => (
              <div key={c.id} className="flex items-baseline justify-between">
                <div>
                  <span className="font-semibold text-black">{c.name}</span>
                  <span className="text-slate-600"> — {c.issuer}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{c.issueDate}</span>
              </div>
            ))}
          </div>
        </section>
      );

    case 'custom':
      return (
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-slate-300 pb-0.5">
            {section.title}
          </h2>
          {section.layout === 'text' ? (
            <p className="text-xs text-slate-700 whitespace-pre-line">{section.textContent}</p>
          ) : (
            <div className="space-y-1.5 text-xs">
              {section.entries?.map((entry) => (
                <div key={entry.id}>
                  <div className="flex items-baseline justify-between font-semibold text-black">
                    <span>{entry.title}</span>
                    {entry.date && <span className="font-normal text-slate-500 text-[11px]">{entry.date}</span>}
                  </div>
                  {entry.description && <p className="text-slate-700 mt-0.5">{entry.description}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      );

    default:
      return null;
  }
}

