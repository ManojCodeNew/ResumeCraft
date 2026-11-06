import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from '@/app/store';
import { router } from '@/app/router';
import { resumeRepository } from '@/services/storage/db';
import { createDefaultResume } from '@/utils/resumeDefaults';
import { ResumeDocument } from '@/types/resume';
import '@/styles/index.css';

// Seed Manoj C's resume as the default master resume
async function seedInitialDataIfNeeded() {
  try {
    const existing = await resumeRepository.getAll();
    const hasManojResume = existing.some((r) => r.title.includes('Manoj') || r.personalInfo.fullName.includes('MANOJ'));

    if (existing.length === 0 || !hasManojResume) {
      const manojResume: ResumeDocument = {
        ...createDefaultResume('MANOJ C — Master Resume', 'ats-classic', true),
        personalInfo: {
          fullName: 'MANOJ C',
          headline: '',
          email: 'manojpoojary2004@gmail.com',
          phone: '9482292440',
          location: 'Bengaluru',
          linkedinUrl: 'https://www.linkedin.com/in/manojc2004',
          githubUrl: 'https://github.com/ManojCodeNew',
          portfolioUrl: 'https://manojcdev.netlify.app/',
          customLinks: [],
          photoUrl: '',
          showPhoto: false,
        },
        sections: [
          {
            id: 'sec_exp',
            type: 'experience',
            title: 'Experience',
            visible: true,
            order: 0,
            entries: [
              {
                id: 'exp_1',
                position: 'Software Engineer Intern',
                company: 'SilverSky Technology',
                location: 'Ahmedabad',
                startDate: 'March 2026',
                endDate: 'October 2026',
                highlights: [
                  'Developed responsive, reusable web interfaces using React.js and TypeScript, following scalable component architecture and optimized folder structures.',
                  'Built API-driven applications using Redux Toolkit, Redux Persist, TanStack Query, Axios, React Hook Form, and Zod for state management, data fetching, caching, and form validation.',
                  'Developed a cross-platform business management mobile application using React Native and TypeScript, implementing authentication, onboarding, nested navigation, and client, quotation, invoice, and payment workflows.',
                  'Integrated REST APIs and implemented search, filtering, pagination, debouncing, and create/update operations while closely matching Figma designs and optimizing application performance.',
                ],
              },
              {
                id: 'exp_2',
                position: 'System Programming Intern',
                company: 'EnterpriseMinds India Private Limited',
                location: '',
                startDate: 'September 2025',
                endDate: 'December 2025',
                highlights: [
                  'Developed a C-based QR/vCard encoder and an assembly instruction emulator covering registers, memory operations, and control flow.',
                  'Strengthened C programming skills in memory execution flow, function design, structured code organization, and writing reliable, maintainable code following production-oriented programming practices.',
                ],
              },
            ],
          },
          {
            id: 'sec_edu',
            type: 'education',
            title: 'Education',
            visible: true,
            order: 1,
            entries: [
              {
                id: 'edu_1',
                degree: 'MCA',
                institution: 'Mangalore Institute of Technology and Engineering',
                location: 'Moodabidri',
                graduationDate: 'November 2024 - Aug 2026',
                gpa: '8.53',
                highlights: [],
              },
              {
                id: 'edu_2',
                degree: 'BCA',
                institution: 'Sri Mahaveera college',
                location: 'Moodabidri',
                graduationDate: 'November 2021 - July 2024',
                gpa: '8.83',
                highlights: [],
              },
            ],
          },
          {
            id: 'sec_skills',
            type: 'skills',
            title: 'Skills',
            visible: true,
            order: 2,
            categories: [
              {
                id: 'cat_skills_all',
                categoryName: 'General',
                skills: [
                  'React.js',
                  'React Native',
                  'TypeScript',
                  'JavaScript',
                  'C',
                  'HTML5',
                  'CSS3',
                  'Redux Toolkit',
                  'Redux Persist',
                  'TanStack Query',
                  'Axios',
                  'React Hook Form',
                  'Zod',
                  'React Navigation',
                  'Push Notifications',
                  'MongoDB',
                  'Git',
                  'GitHub',
                  'GitHub Actions',
                  'CI/CD Pipelines',
                  'REST APIs',
                  'Performance Optimization.',
                ],
              },
            ],
          },
          {
            id: 'sec_projects',
            type: 'projects',
            title: 'Projects',
            visible: true,
            order: 3,
            entries: [
              {
                id: 'proj_1',
                title: 'AstroAura24 – E-commerce & Live Consultation Platform',
                url: 'https://astroaura24.com',
                highlights: [
                  'Contribute to a live platform for gemstone and crystal sales, online payments, and consultation bookings using Next.js and a full-stack architecture.',
                  'Implemented product ordering, Razorpay payment integration, consultation scheduling, and administrative features, including concurrency-safe handling of booking slots and limited-stock products.',
                  'Continuously improve application performance and deliver new features based on client requirements.',
                ],
                technologies: ['Next.js', 'React.js', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay'],
              },
              {
                id: 'proj_2',
                title: 'Business Management Mobile Application',
                highlights: [
                  'Built a cross-platform business application using React Native and TypeScript to manage clients, quotations, invoices, and payments on Android and iOS.',
                  'Implemented onboarding, authentication, nested navigation, persistent state management, and API-driven create, update, search, filtering, and pagination workflows.',
                  'Integrated REST APIs using Axios and TanStack Query, with React Hook Form and Zod for form handling and validation; developed the UI to closely match Figma designs.',
                ],
                technologies: ['React Native', 'TypeScript', 'Redux Toolkit', 'Redux Persist', 'TanStack Query', 'Axios', 'React Hook Form', 'Zod'],
              },
            ],
          },
          {
            id: 'sec_cert_ach',
            type: 'achievements',
            title: 'CERTIFICATIONS & ACHIEVEMENTS',
            visible: true,
            order: 4,
            entries: [
              {
                id: 'ach_1',
                title: 'AWS Academy Graduate — AWS Academy Cloud Foundations (Completed)',
              },
              {
                id: 'ach_2',
                title: 'NPTEL — Introduction to the Internet of Things (IoT)',
              },
              {
                id: 'ach_3',
                title: 'Research Publication: “Intelligent Edge-Based Farm Security System for Real-Time Animal Detection, Multi-Object Tracking, and Temporal Intrusion Forecasting” — Accepted for oral presentation and publication in Springer LNNS, ISBM 2026, Bangkok, Thailand (Paper ID: 124).',
              },
            ],
          },
        ],
      };

      await resumeRepository.save(manojResume);
    }
  } catch (err) {
    console.warn('Initial database seed skipped or failed:', err);
  }
}

seedInitialDataIfNeeded().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
});
