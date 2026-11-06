import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/shared/AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ResumesPage } from '@/features/resumes/ResumesPage';
import { ResumeEditorPage } from '@/features/resume-editor/ResumeEditorPage';
import { TemplatesPage } from '@/features/templates/TemplatesPage';
import { SettingsPage } from '@/features/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'resumes',
        element: <ResumesPage />,
      },
      {
        path: 'edit/:id',
        element: <ResumeEditorPage />,
      },
      {
        path: 'templates',
        element: <TemplatesPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
