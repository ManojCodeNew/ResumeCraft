import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Palette, Settings, FilePlus2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const navigationItems = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'My Resumes', to: '/resumes', icon: FileText },
  { name: 'Templates', to: '/templates', icon: Palette },
  { name: 'Settings & Backup', to: '/settings', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  const isEditing = location.pathname.startsWith('/edit/');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Navbar */}
      <header className="no-print print:hidden sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <NavLink to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold tracking-tight text-slate-900 text-base">
                    Resume<span className="text-blue-600">Forge</span>
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    Personal Builder
                  </span>
                </div>
              </NavLink>

              {/* Tag indicating local & manual control */}
              <div className="hidden sm:flex items-center gap-1.5 ml-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <span>100% User-Authored</span>
                <span className="text-slate-300">•</span>
                <span>Local Storage</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick Action */}
            <div className="flex items-center gap-2">
              <NavLink
                to="/resumes?new=true"
                className="hidden sm:inline-flex items-center gap-2 rounded-md bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                <FilePlus2 className="h-4 w-4" />
                <span>New Resume</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white px-2 py-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center py-1 px-3 rounded text-[11px] font-medium transition-colors',
                    isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
                  )
                }
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className={cn('flex-1 print:p-0 print:m-0 print:max-w-none print:w-full', isEditing ? 'p-0' : 'max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6')}>
        <Outlet />
      </main>
    </div>
  );
}
