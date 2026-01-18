import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Package2,
  Settings,
  Users
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  individualNavSections,
  organizationNavSections,
  NavSection,
} from '@/config/dashboard-nav';
import { ContextSwitcher, Organization } from './ContextSwitcher';
import { NotificationBell } from './ui/notification-bell';


interface AppSidebarProps {
  accountType: string;
  user: any;
  currentContext: { type: 'personal' | 'organization'; orgId?: string } | null;
  currentSlug: string;
  organizations: Organization[];
  hasTeams?: boolean;
  onContextChange: (context: { type: 'personal' | 'organization'; orgId?: string; orgName?: string }) => void;
  onCreateOrg: () => void;
}

// Helper to calculate initials
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper to generate consistent random color based on string
function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-pink-500', 'bg-rose-500'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Generate section route from title
function getSectionRoute(title: string, accountType: string, currentSlug: string): string {
  // Base path using the dynamic slug
  const basePath = `/app/${currentSlug}`;

  // Special mappings for sections that don't match their slug
  if (title === 'Reports & Analytics') return `${basePath}/reports`;
  if (title === 'Team Management') return `${basePath}/teams`;

  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

  // Special cases for main sections
  if (title === 'Dashboard') {
    return basePath; // Just the base path IS the dashboard
  }

  return `${basePath}/${slug}`;
}

// Export props for reuse
export interface SidebarContentProps extends AppSidebarProps {
  isExpanded: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  onNavigate?: () => void; // Callback to close sheet on navigation
}

export function SidebarContent({
  accountType,
  user,
  currentContext,
  currentSlug,
  organizations,
  hasTeams,
  onContextChange,
  onCreateOrg,
  isExpanded,
  onOpenChange,
  className,
  onNavigate
}: SidebarContentProps) {
  const pathname = useLocation().pathname;

  // Determine which navigation sections to show based on account type
  const navSections: NavSection[] =
    accountType === 'organization'
      ? [...organizationNavSections]
      : [...individualNavSections];

  // Dynamic base path for links
  const basePath = `/app/${currentSlug}`;

  // Logic to inject Teams section for individuals with teams
  if (accountType === 'individual' && hasTeams) {
    const hasTeamsSection = navSections.some(s => s.title === 'Teams' || s.title === 'Team Management');
    if (!hasTeamsSection) {
      const dashboardIndex = navSections.findIndex(s => s.title === 'Dashboard');
      const insertIndex = dashboardIndex !== -1 ? dashboardIndex + 1 : 1;

      navSections.splice(insertIndex, 0, {
        title: 'Teams',
        items: [{ href: `/app/teams`, icon: Users, label: 'My Teams' }]
      });
    }
  }

  return (
    <div className={cn("flex h-full max-h-screen flex-col gap-2 p-4", className)}>
      {/* Header */}
      <div className={cn(
        "flex h-16 items-center",
        !isExpanded ? "justify-center px-0" : "px-2 justify-between"
      )}>
        <Link to="/" className="flex items-center gap-2 font-semibold" onClick={onNavigate}>
          {!isExpanded ? (
            <div className="bg-primary/10 p-2 rounded-xl">
              <Package2 className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <>
              <div className="bg-primary/10 p-2 rounded-xl">
                <Package2 className="h-6 w-6 text-primary" />
              </div>
              <span className="font-headline text-lg truncate">
                Collectii<span className="text-primary">.</span>
              </span>
            </>
          )}
        </Link>
      </div>

      {/* Context Switcher */}
      <div className={cn(
        "px-2 py-2 border-b border-border",
        !isExpanded && "border-b-0"
      )}>
        <ContextSwitcher
          userId={user?.id}
          currentContext={currentContext}
          organizations={organizations}
          onContextChange={(ctx) => {
            onContextChange(ctx);
            onNavigate?.();
          }}
          onCreateOrg={() => {
            onCreateOrg();
            onNavigate?.();
          }}
          onOpenChange={onOpenChange}
          isCollapsed={!isExpanded}
        />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-4">
        <nav className="space-y-1">
          {navSections.map((section) => {

            let sectionRoute = '';
            if (section.title === 'Teams') {
              // For injected 'Teams' section, we force usage of the item href if provided or construct it
              // The item href we set is `/app/teams`. 
              // However, we want it to be relative to the app structure if needed?
              // Actually `/app/teams` is absolute. NavLinks handle it.
              // But wait, the sectionRoute logic below uses `getSectionRoute`.
              // Our injected item matches the route logic? Use item href.
              sectionRoute = `${basePath}/teams`;
            } else {
              sectionRoute = getSectionRoute(section.title, accountType, currentSlug);
            }

            const isActive = section.title === 'Dashboard'
              ? pathname === sectionRoute
              : pathname.startsWith(sectionRoute);

            const SectionIcon = section.items[0]?.icon;

            return (
              <Link
                key={section.title}
                to={sectionRoute}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all group relative nav-pill',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm',
                  !isExpanded && "justify-center px-0 w-12 h-12 mx-auto"
                )}
              >
                {SectionIcon && <SectionIcon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />}
                {isExpanded && <span className="truncate">{section.title}</span>}
              </Link>
            );
          })}

          {/* Messages Section */}
          <Link
            to={`${basePath}/messages`}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all group relative',
              pathname.startsWith(`${basePath}/messages`)
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm',
              !isExpanded && "justify-center px-0 w-12 h-12 mx-auto"
            )}
          >
            <Package2 className={cn("h-5 w-5 shrink-0 transition-colors", pathname.startsWith(`${basePath}/messages`) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
            {isExpanded && <span className="truncate">Messages</span>}
          </Link>
        </nav>
      </div>

      {/* Bottom Section: Settings + User Profile */}
      <div className="mt-auto pt-4">
        <nav className="grid items-start text-sm font-medium mb-4">
          <Link
            to={`${basePath}/settings`}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-full px-4 py-3 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:shadow-sm group relative',
              pathname.startsWith(`${basePath}/settings`) && 'bg-primary text-primary-foreground shadow-md',
              !isExpanded && "justify-center px-0 w-12 h-12 mx-auto"
            )}
          >
            <Settings className={cn("h-5 w-5 shrink-0", pathname.startsWith(`${basePath}/settings`) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
            {isExpanded && <span className="truncate">Settings</span>}
          </Link>
        </nav>

        <div className={cn("pt-4 border-t border-border", !isExpanded && "flex justify-center")}>
          <div className={cn("flex items-center gap-3 bg-card p-2 rounded-full shadow-sm border border-border", !isExpanded && "p-0 bg-transparent border-none shadow-none")}>
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className={cn(
                  "text-white text-xs font-medium",
                  getAvatarColor(user?.full_name || 'User')
                )}
              >
                {getInitials(user?.full_name || 'User')}
              </AvatarFallback>
            </Avatar>
            {isExpanded && (
              <div className="overflow-hidden pr-2">
                <p className="font-semibold truncate text-xs text-foreground">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar(props: AppSidebarProps) {
  // We use local state for hover expansion
  const [isHovered, setIsHovered] = useState(false);
  // Track if a dropdown is open to keep sidebar expanded
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // The sidebar is visually expanded if hovered OR if a dropdown interaction is active. 
  // Base state is "collapsed" (icon only) which is the default when not hovered.
  const isExpanded = isHovered || isDropdownOpen;

  return (
    <div
      className={cn(
        "hidden border-r-0 bg-transparent md:block fixed h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out z-50",
        isExpanded ? "w-[250px] bg-card/95 backdrop-blur-sm shadow-2xl border-r border-border" : "w-[80px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarContent
        {...props}
        isExpanded={isExpanded}
        onOpenChange={setIsDropdownOpen}
      />
    </div>
  );
}
