import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers, ClipboardCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/frameworks', label: 'Frameworks', icon: Layers },
  { to: '/evaluations', label: 'Evaluations', icon: ClipboardCheck },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="text-sm font-semibold text-foreground tracking-tight">Heuristics</span>
          <span className="ml-1 text-xs font-medium text-primary bg-accent px-1.5 py-0.5 rounded">2.0</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150',
                  active
                    ? 'bg-accent text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <Icon size={15} strokeWidth={active ? 2 : 1.75} />
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Decision Framework Builder</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}