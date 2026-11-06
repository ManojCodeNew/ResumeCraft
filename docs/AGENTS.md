# AGENTS.md — Personal Resume Builder

This file defines mandatory development rules for AI coding agents and human contributors working on this repository.

Follow these rules before making code changes. `PROJECT_REQUIREMENTS.md` is the source of truth for product behavior and acceptance criteria.

---

## 1. Project Mission

Build a reliable, production-quality personal resume builder using React, TypeScript, and Vite.

The user manually controls every word in every resume field. The application provides:

- Resume creation and editing.
- Reusable template management.
- Dynamic standard and custom sections.
- Live preview.
- Multiple independent resume versions.
- Local persistence and JSON backup.
- A4 PDF export.

**AI generation, AI rewriting, AI suggestions, and job-description analysis are explicitly prohibited in this project unless the owner later changes the requirements.**

Do not add an AI API, AI SDK, prompt workflow, or AI-related UI.

## 2. Source of Truth and Change Control

1. Read `PROJECT_REQUIREMENTS.md` before implementation.
2. Follow this `AGENTS.md` for engineering standards.
3. If requirements appear ambiguous or contradictory, do not invent major product behavior. Record the ambiguity and ask the owner or choose the safest minimal implementation.
4. Do not silently remove or weaken an existing requirement.
5. Do not add unrequested features merely because they are common in other resume builders.
6. Update documentation when implementation changes architecture or user-facing behavior.
7. Keep implementation aligned with the acceptance criteria in `PROJECT_REQUIREMENTS.md`.

## 3. Technology Rules

### Frontend
- React.
- TypeScript with strict mode enabled.
- Vite.
- Tailwind CSS.
- shadcn/ui components where useful; do not add the entire component library unnecessarily.
- React Router for routing if multiple routes are required.
- Redux Toolkit for application state management.
- React Hook Form for complex forms.
- Zod for runtime validation and form/schema validation.
- IndexedDB for persistent resume data in the frontend-only MVP.

### Backend
- Do not create a backend for the MVP.
- Do not add Node.js/Express/MongoDB/JWT solely because they are familiar technologies.
- A backend may be added only after an approved requirement such as cloud sync, accounts, or server-side storage.
- If a backend is approved later, use Node.js + Express + TypeScript and MongoDB with secure authentication and authorization.

### PDF
- Prefer HTML/CSS rendering with print-specific styles and browser print-to-PDF for the initial version.
- Evaluate a client-side PDF library only if a specific requirement cannot be met with browser printing.
- Do not rasterize the entire resume into an image. Export selectable text.
- Do not add a Puppeteer server to the frontend-only MVP.

## 4. State Management Rules

- Use Redux Toolkit as the application-wide state management solution.
- Do not introduce Zustand, MobX, Recoil, or another global state library.
- Do not use React Context as a replacement for Redux application state.
- Local component state with `useState` is allowed for temporary UI state such as an open dialog, active tab, or hover state.
- Use typed hooks such as `useAppDispatch` and `useAppSelector`.
- Keep reducers pure and immutable; use Redux Toolkit's Immer support correctly.
- Use selectors for derived state.
- Avoid storing values in Redux that can be safely derived from existing state.
- Do not store large uploaded file blobs in Redux. Store file metadata/references in state and persist file bytes in IndexedDB only when needed.

## 5. TypeScript Rules

- Enable and maintain TypeScript strict mode.
- Do not use `any`. Use `unknown` and narrow it safely when input is not known.
- Do not silence type errors using broad casts or `@ts-ignore`.
- Avoid non-null assertions unless a documented invariant makes them safe.
- Define explicit interfaces and types for resume documents, personal information, templates, sections, entries, actions, and API/storage boundaries.
- Use discriminated unions for standard resume section types.
- Validate data at runtime when reading imports or persisted data.
- Keep shared types in a clear, reusable location.
- Prefer small, cohesive types over one enormous interface with many unrelated optional fields.

## 6. Resume Data and Template Separation

This is a core architectural rule.

- Resume content and template presentation must remain separate.
- A resume stores content and a reference to a template ID/version.
- A template controls visual presentation; it must not own or silently mutate resume content.
- Changing a template must not delete or rewrite resume content.
- Changing content must not mutate the template definition.
- Use stable IDs for resumes, sections, and repeatable entries.
- Never use array indexes as React keys for editable or reorderable records.
- Preserve unknown or custom section content during save, load, duplicate, and template switching.
- If a template does not have a specialized renderer for a custom section, use a safe generic renderer instead of dropping the section.

## 7. Editing and User Content Rules

- The user writes all resume content manually.
- Do not automatically rewrite, correct, summarize, expand, or generate the user's text.
- Do not invent skills, experience, metrics, achievements, certifications, employers, or education.
- Do not change a field's content as a side effect of formatting or preview generation.
- Add, edit, delete, duplicate, hide/show, and reorder behavior must be explicit user actions.
- Ask for confirmation before destructive actions such as deleting a resume, template, or section with content.
- When duplicating a resume, deep-copy its editable content and assign new IDs to the copied document, sections, and entries.
- Editing a duplicate must never modify its source resume.

## 8. Forms and Validation

- Use React Hook Form for complex forms and Zod for validation.
- Keep validation messages clear and close to the relevant field.
- Validate email and URL formats without being unnecessarily restrictive.
- Do not make optional resume fields mandatory.
- Do not prevent the user from saving a partially completed resume.
- Avoid losing field input when sections are reordered or conditionally hidden.
- Use stable field-array IDs for repeatable form entries.
- Sanitize and safely render user-provided content. Never render arbitrary user HTML as trusted markup.

## 9. Persistence and Autosave

- Use IndexedDB for resume and template persistence in the MVP.
- Use localStorage only for small, non-sensitive preferences.
- Never store resume documents or uploaded file contents in localStorage.
- Autosave with a short debounce.
- Prevent older asynchronous writes from overwriting newer edits.
- Display truthful saving states: `Saving`, `Saved`, and `Save failed`.
- Do not display `Saved` before the persistence operation succeeds.
- Handle storage quota errors and IndexedDB failures with a useful message.
- Provide an explicit save/retry path.
- Confirm that data remains available after a page refresh.
- Provide JSON export/import so the user can back up and move data.
- Never silently replace an existing resume during import.
- Explain that local-only storage is tied to the browser/device and can be lost if browser data is cleared.

## 10. Template and Preview Rules

- Build the first template as reusable HTML/CSS, based on the user's supplied resume reference.
- Do not treat an uploaded PDF as an editable DOM template.
- Do not claim exact reproduction of arbitrary PDF files.
- Match the reference design's key visual characteristics as closely as practical.
- Keep template styles scoped to the template renderer; do not let one template's CSS leak into the editor or another template.
- Use A4 dimensions and print-specific CSS.
- Keep preview and PDF export rendering consistent.
- Do not silently truncate long content.
- Handle page breaks, long entries, columns, links, and Unicode text.
- Test both short and long resumes.
- Empty optional fields should not leave empty labels or awkward gaps.
- Custom sections must render using a generic fallback when required.

## 11. PDF Export Rules

- PDF output must contain selectable/searchable text.
- Use semantic HTML where practical.
- Set A4 page size and appropriate margins.
- Wait for fonts and images to load before printing.
- Avoid clipped content, overlap, broken columns, missing fonts, and accidental blank pages.
- Verify page breaks across multi-page resumes.
- Generate a safe filename from the resume title or user's name.
- Give the user a preview or clear print flow before export.
- Handle browser print limitations honestly.
- Never claim export succeeded unless the export/print flow has actually completed or the user has received clear instructions to save the PDF.

## 12. React and Performance Rules

- Use functional components and hooks.
- Keep components focused and reasonably small.
- Separate business logic, state, storage, validation, and presentation.
- Use `useMemo`, `useCallback`, and `useRef` where they provide a clear performance or correctness benefit.
- Do not add memoization mechanically to every component or function.
- Avoid unnecessary re-renders of the live resume preview.
- Use stable callbacks and selectors where appropriate.
- Lazy-load heavy routes or modules when beneficial.
- Clean up event listeners, subscriptions, and object URLs.
- Do not introduce premature abstractions or over-engineering.

## 13. UI/UX and Accessibility Rules

- Use a clean, professional, minimal design.
- Prioritize usability and content editing over decorative effects.
- Maintain consistent spacing, typography, colors, form controls, and dialogs.
- Support desktop, tablet, and mobile.
- The desktop editor should provide convenient access to editing fields and live preview.
- On mobile, avoid forcing a narrow two-column editor; use a practical editor/preview switch.
- Use semantic HTML and accessible labels.
- Support keyboard navigation and visible focus states.
- Maintain sufficient color contrast.
- Provide loading, empty, success, and error states.
- Confirm destructive actions.
- Do not use fake buttons, inert controls, or placeholder interactions.
- Do not show sample resume data as if it belongs to the user.

## 14. Security and Privacy

- Treat resume content and uploaded documents as personal data.
- Keep data local in the MVP unless the user explicitly chooses another storage model.
- Do not send resume content to external services.
- Do not add analytics that capture resume field contents.
- Validate imported JSON and uploaded files.
- Restrict accepted file types and file sizes if import/upload is implemented.
- Do not execute or inject uploaded HTML, scripts, or arbitrary markup.
- Revoke object URLs when no longer needed.
- If a backend is added later, enforce authentication, authorization, ownership checks, input validation, secure file storage, and appropriate rate limits.

## 15. Code Quality and Project Structure

Use a feature-oriented structure. Adapt names if necessary, but keep responsibilities separated.

Suggested frontend structure:

```text
src/
├── app/
│   ├── store.ts
│   ├── hooks.ts
│   └── router.tsx
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── dashboard/
│   ├── resumes/
│   ├── resume-editor/
│   ├── templates/
│   ├── preview/
│   ├── export/
│   └── settings/
├── templates/
│   ├── registry/
│   └── professional/
├── services/
│   ├── storage/
│   └── backup/
├── store/
│   └── slices/
├── schemas/
├── types/
├── hooks/
├── utils/
├── styles/
└── main.tsx
```

Rules:
- Keep components out of giant monolithic files.
- Keep storage access behind a service/repository layer.
- Keep template registration explicit.
- Keep reusable UI components separate from feature-specific components.
- Avoid circular dependencies.
- Remove unused imports, dead code, debug logs, and abandoned experiments.
- Use meaningful names and consistent formatting.

## 16. Testing Rules

Add tests as features are implemented; do not postpone all testing until the end.

Required coverage:

- Zod schemas and import validation.
- Redux reducers and selectors.
- Add/edit/delete/reorder sections.
- Custom section behavior.
- Resume duplication independence.
- Template switching without content loss.
- IndexedDB save/load and failure states.
- Autosave race-condition handling.
- JSON backup and restore.
- Preview updates after editing.
- PDF print layout for short and long resumes.
- Responsive editor behavior.

Before declaring a feature complete:
1. Run the relevant tests.
2. Run TypeScript type checking.
3. Run linting.
4. Run the production build.
5. Fix introduced errors.
6. Summarize what changed and any remaining limitations.

## 17. Git and Dependency Rules

- Make focused, logical changes.
- Do not overwrite unrelated user changes.
- Do not delete files or dependencies without checking their usage.
- Avoid adding dependencies for trivial functionality.
- Prefer maintained packages with clear purpose.
- Do not commit secrets, credentials, personal resume data, or real uploaded documents.
- Provide an `.env.example` only if environment variables are actually required.
- Keep lockfiles in sync with dependency changes.

## 18. Required Documentation

Maintain:
- `README.md` with project overview, features, stack, setup, scripts, architecture, storage limitations, backup/restore, and deployment.
- `PROJECT_REQUIREMENTS.md` with product scope and acceptance criteria.
- `AGENTS.md` with these development rules.

Document any browser-specific PDF export behavior and the fact that the MVP stores data locally.

## 19. Definition of Done

A task is not complete merely because the page looks correct.

A feature is complete only when:
- It meets the relevant product requirement.
- It is fully connected to application state and persistence where required.
- It handles success, loading, empty, and error states.
- It is accessible and responsive.
- It has appropriate tests.
- It passes TypeScript, lint, and production build checks.
- It does not break existing resume content or templates.
- Documentation is updated where needed.

## 20. Final Non-Negotiable Rules

1. No AI generation or rewriting.
2. No backend in the MVP unless an approved requirement makes it necessary.
3. Redux Toolkit is the only global state management library.
4. TypeScript strict mode; no `any`.
5. Resume content and template design must remain separate.
6. All user content edits must be explicit and reversible where practical.
7. Never lose or silently overwrite resume data.
8. PDF export must be tested with real multi-page layouts.
9. Do not claim a feature works until it has been implemented and tested.
10. Follow `PROJECT_REQUIREMENTS.md` and ask before making major scope changes.
