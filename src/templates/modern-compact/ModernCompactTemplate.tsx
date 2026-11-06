import React from 'react';
import { ResumeDocument, ResumeSection } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  resume: ResumeDocument;
  isPreview?: boolean;
}

export const ModernCompactTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, sections } = resume;
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="w-full bg-white text-slate-900 font-sans leading-normal selection:bg-blue-100 print:text-black">
      {/* Modern Header with subtle blue accent bar */}
      <header className="pb-3 mb-4 border-b border-blue-600/30">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            {personalInfo.headline && (
              <p className="text-sm font-semibold text-blue-700 tracking-wide mt-0.5">
                {personalInfo.headline}
              </p>
            )}
          </div>

          {/* Quick contact list */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3 text-blue-600 print:text-black" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  {personalInfo.email}
                </a>
              </span>
            )}
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3 text-blue-600 print:text-black" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-blue-600 print:text-black" />
                <span>{personalInfo.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Links row */}
        {(personalInfo.linkedinUrl || personalInfo.githubUrl || personalInfo.portfolioUrl || (personalInfo.customLinks && personalInfo.customLinks.length > 0)) && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2 pt-2 border-t border-slate-100">
            {personalInfo.linkedinUrl && (
              <a
                href={personalInfo.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-blue-600 text-slate-700"
              >
                <Linkedin className="h-3 w-3 text-blue-600 print:text-black" />
                <span>LinkedIn</span>
              </a>
            )}
            {personalInfo.githubUrl && (
              <a
                href={personalInfo.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-blue-600 text-slate-700"
              >
                <Github className="h-3 w-3 text-blue-600 print:text-black" />
                <span>GitHub</span>
              </a>
            )}
            {personalInfo.portfolioUrl && (
              <a
                href={personalInfo.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-blue-600 text-slate-700"
              >
                <Globe className="h-3 w-3 text-blue-600 print:text-black" />
                <span>Portfolio</span>
              </a>
            )}
            {personalInfo.customLinks?.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 text-slate-700"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Sections Body */}
      <div className="space-y-4">
        {visibleSections.map((section) => (
          <ModernSectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};

function ModernSectionRenderer({ section }: { section: ResumeSection }) {
  switch (section.type) {
    case 'summary':
      if (!section.content.trim()) return null;
      return (
        <section className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">
            {section.content}
          </p>
        </section>
      );

    case 'experience':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="space-y-3">
            {section.entries.map((entry) => (
              <div key={entry.id} className="space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{entry.position}</span>
                    <span className="font-semibold text-blue-700"> @ {entry.company}</span>
                    {entry.location && <span className="text-slate-500"> ({entry.location})</span>}
                  </div>
                  <span className="text-slate-500 font-medium whitespace-nowrap text-[11px] bg-slate-100 px-2 py-0.5 rounded print:bg-transparent print:p-0">
                    {entry.startDate} {entry.startDate && (entry.endDate || entry.isCurrent) && '–'}{' '}
                    {entry.isCurrent ? 'Present' : entry.endDate}
                  </span>
                </div>

                {entry.description && (
                  <p className="text-xs text-slate-700 whitespace-pre-line">{entry.description}</p>
                )}

                {entry.highlights && entry.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-700">
                    {entry.highlights.map((bullet, idx) => (
                      <li key={idx} className="leading-snug">
                        {bullet}
                      </li>
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
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="space-y-2.5">
            {section.entries.map((proj) => (
              <div key={proj.id} className="space-y-1 text-xs">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    {proj.role && <span className="text-slate-600"> • {proj.role}</span>}
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 text-blue-600 hover:underline print:text-black"
                      >
                        [Link]
                      </a>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <span className="text-slate-500 text-[11px]">
                      {proj.startDate} {proj.startDate && proj.endDate && '–'} {proj.endDate}
                    </span>
                  )}
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 my-1">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-800 px-1.5 py-0.2 rounded text-[10px] font-medium border border-blue-200/50 print:border-none print:bg-transparent print:p-0"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {proj.description && <p className="text-slate-700">{proj.description}</p>}

                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700">
                    {proj.highlights.map((h, i) => (
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
        <section className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="space-y-1 text-xs">
            {section.categories.map((cat) => (
              <div key={cat.id}>
                <span className="font-semibold text-slate-800">{cat.categoryName}: </span>
                <span className="text-slate-700">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      );

    case 'education':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="space-y-2">
            {section.entries.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="flex items-baseline justify-between font-bold text-slate-900">
                  <span>{edu.degree}</span>
                  <span className="font-normal text-slate-500 text-[11px]">{edu.graduationDate}</span>
                </div>
                <div className="flex items-baseline justify-between text-slate-700">
                  <span>
                    {edu.institution}
                    {edu.location && <span className="text-slate-500"> — {edu.location}</span>}
                  </span>
                  {edu.gpa && <span className="text-blue-700 font-medium text-[11px]">GPA: {edu.gpa}</span>}
                </div>
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700 mt-1">
                    {edu.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case 'certifications':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="space-y-1 text-xs">
            {section.entries.map((c) => (
              <div key={c.id} className="flex items-baseline justify-between">
                <div>
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-600"> • {c.issuer}</span>
                </div>
                <span className="text-slate-500 text-[11px]">
                  {c.issueDate}
                  {c.expiryDate && ` – ${c.expiryDate}`}
                </span>
              </div>
            ))}
          </div>
        </section>
      );

    case 'achievements':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="space-y-1.5 text-xs">
            {section.entries.map((a) => (
              <div key={a.id}>
                <div className="flex items-baseline justify-between font-semibold text-slate-900">
                  <span>{a.title}</span>
                  {a.date && <span className="font-normal text-slate-500 text-[11px]">{a.date}</span>}
                </div>
                {a.description && <p className="text-slate-700">{a.description}</p>}
              </div>
            ))}
          </div>
        </section>
      );

    case 'languages':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {section.entries.map((l) => (
              <span
                key={l.id}
                className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] print:bg-transparent print:p-0"
              >
                <span className="font-semibold">{l.language}</span>
                {l.proficiency && <span className="text-slate-500"> ({l.proficiency})</span>}
              </span>
            ))}
          </div>
        </section>
      );

    case 'publications':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="space-y-1 text-xs">
            {section.entries.map((p) => (
              <div key={p.id}>
                <div className="flex items-baseline justify-between font-semibold text-slate-900">
                  <span>{p.title}</span>
                  {p.releaseDate && <span className="font-normal text-slate-500 text-[11px]">{p.releaseDate}</span>}
                </div>
                {p.publisher && <p className="text-slate-600 italic">{p.publisher}</p>}
                {p.summary && <p className="text-slate-700">{p.summary}</p>}
              </div>
            ))}
          </div>
        </section>
      );

    case 'volunteer':
      if (section.entries.length === 0) return null;
      return (
        <section className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          <div className="space-y-1 text-xs">
            {section.entries.map((v) => (
              <div key={v.id}>
                <div className="flex items-baseline justify-between font-semibold text-slate-900">
                  <span>{v.role} — {v.organization}</span>
                  <span className="font-normal text-slate-500 text-[11px]">
                    {v.startDate} {v.startDate && (v.endDate || v.isCurrent) && '–'} {v.isCurrent ? 'Present' : v.endDate}
                  </span>
                </div>
                {v.summary && <p className="text-slate-700">{v.summary}</p>}
              </div>
            ))}
          </div>
        </section>
      );

    case 'custom':
      return (
        <section className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {section.title}
            </h2>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>
          {section.layout === 'text' ? (
            <p className="text-xs text-slate-700 whitespace-pre-line">{section.textContent}</p>
          ) : (
            <div className="space-y-2 text-xs">
              {section.entries?.map((entry) => (
                <div key={entry.id}>
                  <div className="flex items-baseline justify-between font-semibold text-slate-900">
                    <span>{entry.title} {entry.subtitle && `— ${entry.subtitle}`}</span>
                    {entry.date && <span className="font-normal text-slate-500 text-[11px]">{entry.date}</span>}
                  </div>
                  {entry.description && <p className="text-slate-700 mt-0.5">{entry.description}</p>}
                  {entry.fields && entry.fields.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {entry.fields.map((f) => (
                        <span key={f.id} className="text-[11px] text-slate-600">
                          <strong>{f.label}:</strong> {f.value}
                        </span>
                      ))}
                    </div>
                  )}
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

