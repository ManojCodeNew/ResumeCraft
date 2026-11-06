import React from 'react';
import { ResumeDocument, ResumeSection } from '@/types/resume';
import {
  Phone,
  Mail,
  Linkedin,
  Github,
  Globe,
  MapPin,
  Calendar,
  GraduationCap,
} from 'lucide-react';

interface TemplateProps {
  resume: ResumeDocument;
  isPreview?: boolean;
}

function cleanDisplayUrl(url: string): string {
  if (!url) return '';
  return url.replace(/^https?:\/\//i, '');
}

export const AtsClassicTemplate: React.FC<TemplateProps> = ({ resume }) => {
  const { personalInfo, sections } = resume;
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const hasPhoto = Boolean(personalInfo.showPhoto && personalInfo.photoUrl);

  return (
    <div className="w-full bg-white text-slate-900 font-['Roboto',sans-serif] leading-[1.32] text-[8.75pt] selection:bg-blue-100 print:text-black">
      {/* Resume Top Contact Header */}
      <div className={`resume-header mb-1.5 ${hasPhoto ? 'flex items-center gap-4 justify-between' : 'text-center'}`}>
        {hasPhoto && (
          <div className="shrink-0">
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName || 'Profile'}
              className="h-16 w-16 rounded-full object-cover border-2 border-slate-300 shadow-xs print:border-slate-800"
            />
          </div>
        )}

        <div className={`space-y-0.5 ${hasPhoto ? 'flex-1 text-left' : ''}`}>
          {/* Candidate Name */}
          <h1 className="text-[21pt] font-bold tracking-tight text-slate-950 uppercase leading-none font-['Lato',sans-serif]">
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>

          {/* Optional Professional Headline */}
          {personalInfo.headline && (
            <p className="text-[9pt] font-semibold text-slate-700 tracking-wide mt-0.5">
              {personalInfo.headline}
            </p>
          )}

          {/* Contact Information - Row 1: Phone, Email, LinkedIn */}
          <div
            className={`flex flex-wrap items-center gap-x-3.5 gap-y-0.5 text-[8.5pt] text-slate-800 pt-0.5 ${
              hasPhoto ? 'justify-start' : 'justify-center'
            }`}
          >
            {personalInfo.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-800 shrink-0 fill-slate-800/10" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3 text-slate-800 shrink-0" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  {personalInfo.email}
                </a>
              </span>
            )}
            {personalInfo.linkedinUrl && (
              <span className="inline-flex items-center gap-1">
                <Linkedin className="h-3 w-3 text-slate-800 shrink-0 fill-slate-800" />
                <a
                  href={personalInfo.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline truncate max-w-xs"
                >
                  {cleanDisplayUrl(personalInfo.linkedinUrl)}
                </a>
              </span>
            )}
          </div>

          {/* Contact Information - Row 2: GitHub, Portfolio, Location, Custom Links */}
          <div
            className={`flex flex-wrap items-center gap-x-3.5 gap-y-0.5 text-[8.5pt] text-slate-800 ${
              hasPhoto ? 'justify-start' : 'justify-center'
            }`}
          >
            {personalInfo.githubUrl && (
              <span className="inline-flex items-center gap-1">
                <Github className="h-3 w-3 text-slate-800 shrink-0 fill-slate-800" />
                <a
                  href={personalInfo.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline truncate max-w-xs"
                >
                  {cleanDisplayUrl(personalInfo.githubUrl)}
                </a>
              </span>
            )}
            {personalInfo.portfolioUrl && (
              <span className="inline-flex items-center gap-1">
                <Globe className="h-3 w-3 text-slate-800 shrink-0" />
                <a
                  href={personalInfo.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline truncate max-w-xs"
                >
                  {cleanDisplayUrl(personalInfo.portfolioUrl)}
                </a>
              </span>
            )}
            {personalInfo.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-800 shrink-0" />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.customLinks?.map((link) => (
              <span key={link.id} className="inline-flex items-center gap-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {link.label}: {cleanDisplayUrl(link.url)}
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-2.5">
        {visibleSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-0.5 mt-1.5 first:mt-0">
      <h2 className="text-[10pt] font-bold text-slate-950 tracking-wider uppercase leading-none font-['Lato',sans-serif]">
        {title}
      </h2>
      <div className="h-[1px] w-full bg-slate-900 mt-0.5" />
    </div>
  );
}

function SectionRenderer({ section }: { section: ResumeSection }) {
  switch (section.type) {
    case 'experience':
      if (section.entries.length === 0) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <div className="space-y-1.5">
            {section.entries.map((entry) => (
              <div key={entry.id} className="space-y-0.5 text-[8.75pt]">
                {/* Role Title */}
                <h3 className="font-bold text-slate-950 text-[9.75pt] leading-tight">
                  {entry.position}
                </h3>

                {/* Subline: Company, Location on left; Date on right */}
                <div className="flex items-baseline justify-between text-slate-800 text-[8.75pt]">
                  <span className="font-medium text-slate-800">
                    {entry.company}
                    {entry.location && `, ${entry.location}`}
                  </span>
                  {(entry.startDate || entry.endDate || entry.isCurrent) && (
                    <span className="inline-flex items-center gap-1 text-[8.25pt] text-slate-700 whitespace-nowrap">
                      <Calendar className="h-2.5 w-2.5 text-slate-700 shrink-0 print:text-black" />
                      <span>
                        {entry.startDate}
                        {entry.startDate && (entry.endDate || entry.isCurrent) && ' - '}
                        {entry.isCurrent ? 'Present' : entry.endDate}
                      </span>
                    </span>
                  )}
                </div>

                {/* Description if present */}
                {entry.description && (
                  <p className="text-slate-800 leading-[1.32] whitespace-pre-line mt-0.5">{entry.description}</p>
                )}

                {/* Bullet Highlights */}
                {entry.highlights && entry.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800 text-[8.75pt] leading-[1.32] mt-0.5">
                    {entry.highlights.map((bullet, idx) => (
                      <li key={idx} className="pl-0.5">
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

    case 'education':
      if (section.entries.length === 0) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <div className="space-y-1">
            {section.entries.map((edu) => (
              <div key={edu.id} className="space-y-0.5 text-[8.75pt]">
                {/* Degree / Program */}
                <h3 className="font-bold text-slate-950 text-[9.75pt] leading-tight">
                  {edu.degree}
                </h3>

                {/* Institution, CGPA, Dates, Location line */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-slate-800 text-[8.75pt]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{edu.institution}</span>
                    {edu.gpa && (
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-950">
                        <GraduationCap className="h-3 w-3 text-slate-700 shrink-0" />
                        <span>CGPA: {edu.gpa}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[8.25pt] text-slate-700">
                    {edu.graduationDate && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5 text-slate-700 shrink-0 print:text-black" />
                        <span>{edu.graduationDate}</span>
                      </span>
                    )}
                    {edu.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5 text-slate-700 shrink-0 print:text-black" />
                        <span>{edu.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800 text-[8.75pt] leading-[1.32] mt-0.5">
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

    case 'skills':
      if (section.categories.length === 0) return null;
      const allSkills = section.categories.flatMap((cat) => cat.skills);
      const isSingleGroup =
        section.categories.length === 1 &&
        (!section.categories[0]?.categoryName ||
          section.categories[0]?.categoryName === 'General' ||
          section.categories[0]?.categoryName === 'All');

      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          {isSingleGroup ? (
            <p className="text-[8.75pt] text-slate-800 leading-[1.36]">
              {allSkills.join(' | ')}
            </p>
          ) : (
            <div className="space-y-0.5 text-[8.75pt] text-slate-800 leading-[1.36]">
              {section.categories.map((cat) => (
                <div key={cat.id}>
                  {cat.categoryName && cat.categoryName !== 'General' && cat.categoryName !== 'All' ? (
                    <>
                      <span className="font-semibold text-slate-950">{cat.categoryName}: </span>
                      <span>{cat.skills.join(' | ')}</span>
                    </>
                  ) : (
                    <span>{cat.skills.join(' | ')}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      );

    case 'projects':
      if (section.entries.length === 0) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <div className="space-y-1.5">
            {section.entries.map((proj) => (
              <div key={proj.id} className="space-y-0.5 text-[8.75pt]">
                {/* Project Title */}
                <h3 className="font-bold text-slate-950 text-[9.75pt] leading-tight">
                  {proj.title}
                </h3>

                {/* Project URL directly below title */}
                {proj.url && (
                  <p className="text-[8.5pt] text-blue-700 hover:underline underline print:text-black leading-tight">
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {proj.url}
                    </a>
                  </p>
                )}

                {/* Description if present */}
                {proj.description && (
                  <p className="text-slate-800 leading-[1.32] mt-0.5">{proj.description}</p>
                )}

                {/* Bullet Highlights */}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800 text-[8.75pt] leading-[1.32] mt-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="pl-0.5">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Stack Footer Line: Tech: React, Node, etc. */}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[8.25pt] text-slate-900 mt-0.5 leading-tight">
                    <span className="font-bold">Tech:</span> {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );

    case 'achievements':
      if (section.entries.length === 0) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <ul className="list-disc list-outside pl-4 space-y-0.5 text-[8.75pt] text-slate-800 leading-[1.32]">
            {section.entries.map((item) => {
              const colonIdx = item.title.indexOf(':');
              const hasColonPrefix = colonIdx > 0 && colonIdx < 30;
              const prefix = hasColonPrefix ? item.title.slice(0, colonIdx + 1) : '';
              const remainder = hasColonPrefix ? item.title.slice(colonIdx + 1) : item.title;

              return (
                <li key={item.id} className="pl-0.5">
                  {hasColonPrefix ? (
                    <>
                      <span className="font-semibold text-slate-950">{prefix}</span>
                      <span>{remainder}</span>
                    </>
                  ) : (
                    <span>{item.title}</span>
                  )}
                  {item.date && <span className="text-slate-650"> ({item.date})</span>}
                  {item.description && <span>: {item.description}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      );

    case 'certifications':
      if (section.entries.length === 0) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <ul className="list-disc list-outside pl-4 space-y-0.5 text-[8.75pt] text-slate-800 leading-[1.32]">
            {section.entries.map((cert) => (
              <li key={cert.id} className="pl-0.5">
                <span className="font-semibold text-slate-950">{cert.name}</span>
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.issueDate && <span className="text-slate-650"> ({cert.issueDate})</span>}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 text-blue-700 underline print:text-black"
                  >
                    [Verify]
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      );

    case 'summary':
      if (!section.content.trim()) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <p className="text-[8.75pt] text-slate-800 leading-[1.36] text-justify whitespace-pre-line">
            {section.content}
          </p>
        </section>
      );

    case 'languages':
      if (section.entries.length === 0) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <div className="flex flex-wrap gap-x-3.5 gap-y-0.5 text-[8.75pt] text-slate-800">
            {section.entries.map((l) => (
              <span key={l.id}>
                <strong className="text-slate-950">{l.language}</strong>
                {l.proficiency && ` (${l.proficiency})`}
              </span>
            ))}
          </div>
        </section>
      );

    case 'publications':
      if (section.entries.length === 0) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <ul className="list-disc list-outside pl-4 space-y-0.5 text-[8.75pt] text-slate-800 leading-[1.32]">
            {section.entries.map((pub) => (
              <li key={pub.id} className="pl-0.5">
                <span className="font-semibold text-slate-950">{pub.title}</span>
                {pub.publisher && <span> — {pub.publisher}</span>}
                {pub.releaseDate && <span className="text-slate-650"> ({pub.releaseDate})</span>}
                {pub.summary && <span>: {pub.summary}</span>}
              </li>
            ))}
          </ul>
        </section>
      );

    case 'volunteer':
      if (section.entries.length === 0) return null;
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          <ul className="list-disc list-outside pl-4 space-y-0.5 text-[8.75pt] text-slate-800 leading-[1.32]">
            {section.entries.map((v) => (
              <li key={v.id} className="pl-0.5">
                <span className="font-semibold text-slate-950">{v.role}</span>
                <span> — {v.organization}</span>
                {(v.startDate || v.endDate) && (
                  <span className="text-slate-650"> ({v.startDate} – {v.isCurrent ? 'Present' : v.endDate})</span>
                )}
                {v.summary && <span>: {v.summary}</span>}
              </li>
            ))}
          </ul>
        </section>
      );

    case 'custom':
      return (
        <section className="resume-entry">
          <SectionHeading title={section.title} />
          {section.layout === 'text' ? (
            <p className="text-[8.75pt] text-slate-800 leading-[1.32] whitespace-pre-line">{section.textContent}</p>
          ) : (
            <div className="space-y-1">
              {section.entries?.map((entry) => (
                <div key={entry.id} className="text-[8.75pt] space-y-0.5">
                  <div className="flex items-baseline justify-between font-semibold text-slate-950">
                    <span>
                      {entry.title}
                      {entry.subtitle && <span className="font-normal text-slate-700"> — {entry.subtitle}</span>}
                    </span>
                    {entry.date && <span className="font-normal text-slate-600 text-[8.25pt]">{entry.date}</span>}
                  </div>
                  {entry.description && <p className="text-slate-800 text-[8.75pt] leading-[1.32]">{entry.description}</p>}
                  {entry.fields && entry.fields.length > 0 && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[8.25pt] text-slate-700">
                      {entry.fields.map((f) => (
                        <span key={f.id}>
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
