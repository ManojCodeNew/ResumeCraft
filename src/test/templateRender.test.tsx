import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AtsClassicTemplate } from '@/templates/ats-classic/AtsClassicTemplate';
import { ModernCompactTemplate } from '@/templates/modern-compact/ModernCompactTemplate';
import { MinimalistMonoTemplate } from '@/templates/minimalist-mono/MinimalistMonoTemplate';
import { createDefaultResume } from '@/utils/resumeDefaults';
import { CustomSection } from '@/types/resume';

describe('Resume Template Renderers', () => {
  const resume = createDefaultResume('Test Resume');
  resume.personalInfo.fullName = 'Jane Doe';
  resume.personalInfo.email = 'jane@example.com';

  const customSec: CustomSection = {
    id: 'cst_1',
    type: 'custom',
    title: 'Patents & Inventions',
    visible: true,
    order: 10,
    layout: 'entries',
    entries: [
      {
        id: 'e1',
        title: 'Distributed Transaction Processing Method',
        subtitle: 'US Patent #9876543',
        date: '2023',
        description: 'Novel method for atomic transactions.',
      },
    ],
  };
  resume.sections.push(customSec);

  it('renders ATS Classic template with user content and custom section', () => {
    render(<AtsClassicTemplate resume={resume} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Patents & Inventions')).toBeInTheDocument();
    expect(screen.getByText('Distributed Transaction Processing Method')).toBeInTheDocument();
  });

  it('supports with-image and without-image resume rendering', () => {
    const { unmount } = render(<AtsClassicTemplate resume={{ ...resume, personalInfo: { ...resume.personalInfo, showPhoto: false } }} />);
    expect(screen.queryByAltText('Jane Doe')).not.toBeInTheDocument();
    unmount();

    render(
      <AtsClassicTemplate
        resume={{
          ...resume,
          personalInfo: {
            ...resume.personalInfo,
            showPhoto: true,
            photoUrl: 'data:image/png;base64,sample',
          },
        }}
      />
    );
    expect(screen.getByAltText('Jane Doe')).toBeInTheDocument();
  });

  it('renders Modern Compact template cleanly', () => {
    render(<ModernCompactTemplate resume={resume} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Patents & Inventions')).toBeInTheDocument();
  });

  it('renders Minimalist Mono template cleanly', () => {
    render(<MinimalistMonoTemplate resume={resume} />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Patents & Inventions')).toBeInTheDocument();
  });
});
