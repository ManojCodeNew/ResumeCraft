# Project Requirements — Personal Resume Builder

**Version:** 1.0  
**Project type:** Personal resume editing and PDF export application  
**Status:** Initial implementation specification

---

## 1. Project Overview

Build a production-quality, responsive web application that allows a user to create, edit, organize, preview, and download professional resumes using reusable resume templates.

The user controls all resume content manually. The application must **not** generate, rewrite, improve, or suggest resume content using AI.

The core idea is:

1. The user creates or imports their resume content.
2. The user selects a saved resume template.
3. The user edits individual fields and sections at any time.
4. The application updates a live resume preview.
5. The user saves multiple resume versions for different job applications.
6. The user downloads the selected resume as a PDF while preserving the selected template's design.

The application is a resume editor and template manager, not an AI resume writer or job application platform.

## 2. Product Goals

- Provide a simple and reliable resume editing experience.
- Keep resume content separate from template design.
- Allow users to create and manage multiple templates.
- Allow users to create multiple resume versions from the same master content.
- Support flexible sections and repeatable entries such as work experience and projects.
- Show an accurate live A4 resume preview.
- Export a clean, selectable-text PDF with consistent formatting.
- Avoid accidental loss or overwriting of resume content.
- Work well on desktop, tablet, and mobile screens.

## 3. Explicitly Out of Scope

Do not implement the following unless separately requested:

- AI content generation, rewriting, suggestions, or job-description matching.
- OpenAI or other LLM API integration.
- Automatic claims about ATS scores or guaranteed ATS compatibility.
- Job search, job application tracking, or employer integrations.
- Payment, subscriptions, or billing.
- Public resume sharing or public profile pages.
- Collaborative editing.
- Multi-user organization or team administration.
- Arbitrary PDF editing or pixel-perfect editing of every uploaded PDF.

The user supplies and edits all content manually.

## 4. Recommended Architecture and Backend Decision

### 4.1 Initial version: frontend-only

For the first version, a backend is **not required** if this is a personal application used in one browser and the user is comfortable with data staying on that device.

Recommended initial stack:

| Area | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| UI components | shadcn/ui where useful |
| State management | Redux Toolkit |
| Form handling | React Hook Form |
| Validation | Zod |
| Local persistence | IndexedDB using a maintained wrapper such as Dexie |
| Small preferences | localStorage |
| PDF export | Browser print-to-PDF using print-specific HTML/CSS; evaluate a client-side PDF library only if needed |
| Testing | Vitest, React Testing Library, Playwright |
| Deployment | Vercel or equivalent static hosting |

Do not add Node.js, Express, MongoDB, JWT, or server infrastructure to the first version without a demonstrated requirement. A static React application can be deployed to Vercel.

### 4.2 When a backend becomes necessary

Add a backend only if the user later needs one or more of these:

- Sign in and access resumes from multiple devices.
- Cloud backup and synchronization.
- Server-side file storage.
- Account recovery.
- Shared access or collaboration.
- Centralized template distribution.
- Server-generated PDFs for consistent output across environments.

If those requirements are approved, use Node.js + Express + TypeScript, MongoDB, authentication with secure session/refresh-token handling, and private object storage for uploaded files. Define authorization and ownership checks for every resume and template. Do not build this backend speculatively in the MVP.

### 4.3 Data ownership and portability

- Resume data belongs to the user.
- Persist data locally in IndexedDB in the initial version.
- Provide a way to export a resume's structured data as JSON for backup/portability.
- Provide import and validation for the application's own JSON backup format.
- Never silently overwrite an existing resume during import.
- Explain that browser-local data may be lost if browser storage is cleared or the device is lost. Encourage periodic JSON backup.
- Do not store sensitive resume files in localStorage.

## 5. User Roles

The initial version has one role:

- **Resume owner:** can create, edit, duplicate, rename, delete, import, export, and manage their resumes and templates.

No admin role is required.

## 6. Main Application Navigation

Provide a clean application shell with navigation for:

1. Dashboard
2. My Resumes
3. Templates
4. Settings / Data Backup

The navigation may be a sidebar on desktop and a compact navigation pattern on mobile.

## 7. Functional Requirements

### 7.1 Dashboard

The dashboard must provide:

- Create Resume action.
- View all saved resumes.
- View available templates.
- Recently edited resumes.
- Resume title and last-updated date.
- Quick actions to edit, duplicate, rename, and delete a resume.
- Empty state with a clear first action.
- Confirmation before destructive actions.

### 7.2 Resume creation

The user must be able to:

- Create a blank resume using a selected template.
- Create a resume by duplicating an existing resume.
- Create a new version from a master resume without changing the master.
- Give each resume a meaningful title, such as `Master Resume`, `React Developer`, or `Full Stack Developer`.
- Choose a template at creation time.
- Change the template later without losing resume content, where the template supports the relevant section types.

### 7.3 Resume content model

Keep resume content independent from template presentation.

A resume should contain:

- Unique ID.
- Resume title.
- Selected template ID and template version.
- Personal information.
- Ordered list of sections.
- Created and updated timestamps.
- Optional metadata such as notes or target role.

Personal information should support configurable fields such as:

- Full name.
- Professional headline / job title.
- Email.
- Phone.
- Location.
- LinkedIn URL.
- Portfolio URL.
- GitHub URL.
- Other user-defined contact links.

Do not require every field. Optional fields should not render when empty.

### 7.4 Standard sections

Provide reusable section types for:

1. Professional Summary
2. Work Experience
3. Projects
4. Technical Skills
5. Education
6. Certifications
7. Achievements
8. Languages
9. Publications
10. Volunteer Experience
11. Custom Section

Each section must have:

- Unique ID.
- Section type.
- Editable title.
- Visibility toggle.
- Display order.
- Relevant content entries.

Repeatable sections (for example, Work Experience, Projects, Education, Certifications) must support adding, editing, deleting, and reordering entries.

### 7.5 Custom sections and fields

The user must be able to:

- Add a custom section with any title.
- Add text content or repeatable entries to a custom section.
- Edit the custom section title.
- Reorder, hide, show, and delete custom sections.
- Add and remove supported fields inside custom entries where practical.

Do not hardcode the editor so that only the initial standard sections are possible. Use a typed, extensible section model and safe rendering by section type.

### 7.6 Resume editor

The editor should provide:

- A structured form for each section.
- Add, edit, delete, duplicate, and reorder actions where applicable.
- Add/remove individual entries in repeatable sections.
- Section visibility controls.
- Editable section headings.
- Clear labels and helpful placeholders.
- Validation for URLs, email addresses, and required fields where appropriate.
- No forced content or invented examples in the saved resume.
- A clear indication of unsaved/saving/saved state.
- Undo/redo if it can be implemented reliably without compromising data integrity.

The user must be able to enter all wording manually. Do not alter the user's wording automatically.

### 7.7 Live preview

- Display the selected template with the current resume data.
- Update the preview when content, visibility, order, or template settings change.
- Provide an A4 page preview with realistic margins.
- Support multiple pages when content exceeds one page.
- Ensure the preview is readable at common desktop widths.
- On mobile, prioritize the editor and provide a practical preview toggle or separate preview view.
- Do not truncate content silently.
- Empty optional fields and empty sections should not create awkward blank labels or large gaps.
- Preview and PDF export must use the same rendering rules as closely as possible.

### 7.8 Template management

The application should initially include one polished, professional, ATS-conscious template recreated in HTML/CSS from the user's supplied resume reference.

The user should be able to manage multiple templates over time.

A template should define presentation, not user content. It may contain:

- Template ID and name.
- Version.
- Page size and margins.
- Font family and sizes.
- Colors.
- Spacing.
- Column/layout configuration.
- Section heading style.
- Entry layout.
- Supported section types.
- Template-specific rendering components and CSS.

Template management requirements:

- View available templates.
- Select a template for a resume.
- Duplicate a template if template customization is supported.
- Rename user-created templates.
- Delete user-created templates only after checking whether resumes use them.
- Do not allow deletion of a built-in template unless a replacement exists.
- Preserve resume content when switching templates.
- If a template cannot render a custom section in a special layout, render it safely in a default section style rather than dropping the content.

**Important PDF limitation:** An uploaded PDF is a visual reference, not automatically an editable template. For the first template, recreate the reference design using HTML/CSS and map the user's content into it. Do not promise pixel-perfect reproduction of arbitrary uploaded PDFs. Preserve the important visual characteristics such as typography, columns, spacing, headings, and alignment as closely as practical.

### 7.9 Save and persistence

- Save changes automatically with a short debounce.
- Show `Saving`, `Saved`, and `Save failed` states.
- Ensure a refresh does not lose saved changes.
- Avoid race conditions where an older save overwrites newer content.
- Provide an explicit Save action as a fallback.
- Warn before navigating away only when changes genuinely remain unsaved.
- Handle IndexedDB unavailable, quota exceeded, and storage errors gracefully.
- Do not claim a save succeeded until persistence succeeds.

### 7.10 Resume versions

- Allow duplication of any resume.
- Keep duplicated resume content independent from the source.
- Editing one version must not modify another.
- Allow rename and delete.
- Display last-updated information.
- Provide a clear distinction between a master resume and tailored copies if the user chooses to designate one.

### 7.11 PDF export and printing

PDF export is a core feature and must be tested carefully.

Requirements:

- Export the selected resume using its selected template.
- Use A4 page size by default.
- Preserve fonts, colors, margins, spacing, links, and section order.
- Keep text selectable/searchable; do not export the whole resume as a screenshot.
- Avoid clipped text, overlapping content, broken columns, and unexpected blank pages.
- Handle long entries and page breaks safely.
- Use print CSS such as `@page` and print media rules.
- Wait for fonts and images to load before triggering print/export.
- Provide a clear filename, for example `Manoj_React_Developer_Resume.pdf`.
- Provide a preview before download.
- If browser print-to-PDF is used, clearly guide the user to save as PDF in the browser print dialog.
- Do not claim a PDF was generated if the browser export/print action failed.

### 7.12 Import and backup

MVP import scope:

- Import the application's own validated JSON backup format.
- Optionally accept PDF/DOCX as a source/reference file in a later phase.
- If PDF/DOCX upload is implemented, treat it as content extraction/reference input, not a guaranteed editable design.
- Show extracted content for user review before saving.
- Never silently replace existing content.
- Validate file type, size, and parsing errors.
- Keep uploaded source files local unless the user explicitly chooses otherwise.

### 7.13 Settings

Include:

- Default template selection.
- Default page size (A4 initially).
- Export filename preference if useful.
- Export all data / backup JSON.
- Import backup JSON.
- Clear local data with strong confirmation.
- Short explanation of local-only storage and backup responsibility.

## 8. User Interface and UX Requirements

- Modern, professional, minimal interface.
- Prioritize clarity and editing speed over decorative visuals.
- Use consistent spacing, typography, buttons, dialogs, and form controls.
- Responsive desktop, tablet, and mobile layouts.
- Accessible labels, keyboard navigation, focus states, and sufficient contrast.
- Loading, empty, success, and error states for all meaningful operations.
- Confirm destructive operations.
- Use toast notifications sparingly and meaningfully.
- Avoid unnecessary animations.
- Do not use placeholder content as if it were the user's real resume data.

### Suggested editor layout

Desktop:
- Left: editor navigation and fields.
- Right: live A4 preview.
- Top: resume title, save status, template selector, preview/export actions.

Mobile:
- Compact header.
- Editor and preview as separate views or tabs.
- Forms must remain usable without horizontal scrolling.

## 9. Data Model Guidance

Use TypeScript discriminated unions for standard section types rather than untyped arbitrary objects wherever practical.

Illustrative conceptual model (adapt and refine during implementation):

```ts
type SectionType =
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "achievements"
  | "languages"
  | "publications"
  | "volunteer"
  | "custom";

interface ResumeSectionBase {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
}

interface ResumeDocument {
  id: string;
  title: string;
  templateId: string;
  templateVersion: number;
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  createdAt: string;
  updatedAt: string;
}
```

This is guidance, not permission to use `any`. Define strongly typed entry interfaces for each section. For custom sections, define a safe, validated schema.

## 10. Quality, Performance, and Reliability

- Use stable IDs for resumes, sections, and entries.
- Never use array indexes as React keys for reorderable content.
- Keep state updates immutable.
- Avoid unnecessary preview re-renders.
- Use `useMemo`, `useCallback`, and `useRef` when they provide measurable or clear benefits; do not add them mechanically.
- Lazy-load noncritical routes or heavy modules when appropriate.
- Keep template rendering deterministic.
- Test long resumes and edge cases, not only short sample resumes.
- Handle special characters and Unicode names correctly.
- Ensure links render correctly in the PDF.
- Do not lose data after a failed export.

## 11. Testing Requirements

### Unit tests
- Resume and section validation.
- Reducers and state updates.
- Add/remove/reorder section behavior.
- Resume duplication independence.
- Template selection.
- Import/export JSON validation.
- Filename generation.

### Component/integration tests
- Edit a field and verify preview updates.
- Add and remove an experience entry.
- Add, hide, show, and reorder sections.
- Save, refresh, and verify persisted data.
- Duplicate a resume and verify independence.
- Switch templates without losing content.

### End-to-end tests
- Create a resume from the dashboard.
- Enter personal information and sections.
- Save and reload.
- Preview a multi-page resume.
- Export/print a PDF.
- Import a valid backup.
- Reject invalid backup data.
- Verify destructive-action confirmation.

### PDF acceptance checks
- A4 page size.
- No clipping or overlap.
- No missing fonts.
- No accidental blank pages.
- Text is selectable.
- Multi-page content remains in the correct order.

## 12. Acceptance Criteria

The MVP is complete when:

1. The user can create and save a resume.
2. The user can edit personal details and all standard sections.
3. The user can add, edit, delete, hide, show, and reorder sections.
4. The user can create custom sections.
5. The user can view a live preview.
6. The user can use the initial HTML/CSS template.
7. The user can save multiple independent resume versions.
8. The user can select among available templates.
9. Changes persist after refresh.
10. The user can export a clean A4 PDF.
11. The user can back up and restore resume data using JSON.
12. No AI feature or automatic content rewriting exists.
13. The application handles errors and destructive actions safely.
14. The application is responsive and passes the agreed test suite.

## 13. Implementation Milestones

### Milestone 1 — Foundation
- Initialize React + Vite + TypeScript.
- Configure Tailwind, shadcn/ui if useful, Redux Toolkit, routing, linting, and testing.
- Build the application shell and dashboard.

### Milestone 2 — Resume data and editor
- Define typed resume models.
- Implement Redux slices and selectors.
- Build personal information and standard section editors.
- Implement custom sections and reordering.

### Milestone 3 — Persistence and versions
- Add IndexedDB persistence.
- Implement debounced autosave and save status.
- Implement duplicate, rename, and delete.
- Verify independent resume versions.

### Milestone 4 — Template and preview
- Recreate the first supplied resume design as an HTML/CSS template.
- Build the template rendering system.
- Implement live A4 preview.
- Add template selection and safe fallback rendering.

### Milestone 5 — PDF and backup
- Implement print stylesheet and PDF export flow.
- Test page breaks and long content.
- Implement JSON backup/import with validation.

### Milestone 6 — Hardening and deployment
- Add unit, integration, and end-to-end tests.
- Improve accessibility and responsive behavior.
- Test browser storage failures and export edge cases.
- Deploy the frontend to Vercel or equivalent static hosting.
- Document setup, usage, limitations, and backup instructions.

## 14. Final Product Principle

The user is the author of the resume. The application is responsible for structure, editing, storage, presentation, and export—not for inventing or changing the user's professional story.

**Never introduce AI generation or automatic rewriting without a separate, explicit requirement.**
