# ResumeForge — Personal Resume Builder

A production-grade, privacy-first personal resume builder web application built with React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, and IndexedDB.

---

## 🌟 Core Philosophy & Principles

1. **100% User Authored (Explicitly Zero AI):** You own and write every word of your professional story. No AI generation, suggestions, rewriting, hallucination, or ATS claiming tricks.
2. **Strict Separation of Content and Presentation:** Resumes contain data and a reference to a template. You can switch templates anytime without losing data, and custom sections always safely render via generic fallback formatters.
3. **Multi-Version Architecture:** Maintain a master resume and duplicate it into independent versions tailored for specific roles. Duplicating deep-copies all entries and assigns new IDs, ensuring no cross-version mutation.
4. **Local-First & Offline:** Your resume documents are saved directly to your browser's IndexedDB database via Dexie. No cloud servers, no account tracking, and no external API transmissions.
5. **A4 Live Preview & True Selectable PDF:** Realistic A4 print preview and high-fidelity browser print engine with `@page` CSS and printable media rules that export selectable, searchable text (no full-page image screenshots).
6. **Full Portability:** Download individual resumes as JSON or export all resumes into a single structured backup. Validated imports ensure safety and prevent silent overwriting.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Framework** | React 18 + TypeScript (Strict Mode) + Vite |
| **Styling** | Tailwind CSS + Lucide Icons |
| **State Management** | Redux Toolkit (`useAppDispatch`, `useAppSelector`) |
| **Validation & Schemas** | Zod + React Hook Form |
| **Local Persistence** | Dexie.js (IndexedDB wrapper) |
| **PDF Generation** | Native Browser Print Engine + Print Stylesheet (`@media print`, `@page`) |
| **Testing** | Vitest + React Testing Library + Fake IndexedDB |
| **Deployment Target** | Static SPA (Vercel, Cloudflare Pages, Netlify, GitHub Pages) |

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── store.ts               # Configured Redux Toolkit store
│   ├── hooks.ts               # Typed useAppDispatch & useAppSelector
│   └── router.tsx             # React Router route definitions
├── components/
│   ├── ui/                    # Reusable primitives (Button, Input, Textarea, Card, Modal, Badge)
│   └── shared/                # App shell, responsive header, navigation
├── features/
│   ├── dashboard/             # Stats, recent documents, template showcase
│   ├── resumes/               # Multi-version list, search, duplicate, delete
│   ├── resume-editor/         # Section list, drag/reorder, inline editors, autosave
│   ├── templates/             # Template gallery & layout preview
│   ├── preview/               # A4 live preview with zoom & print trigger
│   └── settings/              # JSON backup export/import & storage controls
├── templates/
│   ├── ats-classic/           # ATS Classic Clean template
│   ├── modern-compact/        # Modern Professional template with accent pills
│   ├── minimalist-mono/       # Minimalist Focus typographic layout
│   └── registry/              # Template registry with safe fallback renderer
├── services/
│   ├── storage/               # Dexie IndexedDB database & repository
│   └── backup/                # Backup payload export & import validation
├── store/
│   └── slices/                # Redux slices (resume, resumesList, templates, settings)
├── schemas/                   # Zod schemas for runtime validation
├── types/                     # TypeScript interfaces and discriminated unions
├── hooks/                     # Custom hooks (useAutosave, useKeyboardShortcuts)
├── utils/                     # Helpers (cn, generateId, resumeDefaults)
├── styles/                    # Tailwind and print media rules
└── main.tsx                   # Application bootstrap & initial data seeding
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 22+)
- npm 9+

### Installation & Run

1. Clone or open the repository:
   ```bash
   cd Resume_Gen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run test suite:
   ```bash
   npm test
   ```

---

## 🖨️ PDF Export Guide

When clicking **Export PDF**:
1. The browser's native print dialog will launch.
2. Select **Destination: Save as PDF**.
3. Under **More settings**:
   - Paper size: **A4**
   - Margins: **Default** or **None** (the template includes standard A4 print margins)
   - Options: Check **Background graphics** so subtle dividers and styling render correctly.

---

## 💾 Local Storage & Backup Notice

ResumeForge stores all documents in your browser's local **IndexedDB** database:
- Your data never leaves your device.
- If you clear browser cookies/site data or use private/incognito browsing, local data may be cleared.
- To protect your work or transfer resumes between computers, go to **Settings & Backup** and click **Download Full Backup (JSON)**.
- You can restore your data on any device at any time using **Import Backup JSON**.

