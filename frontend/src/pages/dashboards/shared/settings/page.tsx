import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useOutletContext, Routes, Route, useParams, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { individualSettingsNavigation, organizationSettingsNavigation } from '@/config/dashboard-nav';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Individual Settings Components
import ProfileSettings from '@/components/settings/individual/ProfileSettings';
import SecuritySettings from '@/components/settings/individual/SecuritySettings';
import PreferencesSettings from '@/components/settings/individual/PreferencesSettings';

// Settings Sidebar
import SettingsSidebar from '@/components/settings/SettingsSidebar';

interface WorkspaceContext {
  type: 'personal' | 'organization';
  orgId?: string;
  orgName?: string;
}

function MobileSettingsNav({ items, basePath, currentItem }: { items: any[], basePath: string, currentItem: any }) {
  const navigate = useNavigate();
  const Icon = currentItem?.icon || Settings;

  return (
    <div className="lg:hidden mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-12">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <span className="font-medium">{currentItem?.label || 'Settings'}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] max-w-md">
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = currentItem?.href === item.href;
            return (
              <DropdownMenuItem
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`flex items-center gap-3 py-3 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
              >
                <ItemIcon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SettingsContent({ items, contextType, basePath }: { items: any[], contextType: 'personal' | 'organization', basePath: string }) {
  const { "*": section } = useParams();
  const topSection = section?.split('/')[0] || 'profile';
  const currentItem = items.find(item => item.href === topSection);

  if (!currentItem) {
    // Default to first item if not found
    return <Navigate to={items[0]?.href || 'profile'} replace />;
  }

  const Icon = currentItem.icon;

  // Render the appropriate component based on context and section
  const renderContent = () => {
    if (contextType === 'personal') {
      switch (topSection) {
        case 'profile': return <ProfileSettings />;
        case 'security': return <SecuritySettings />;
        case 'preferences': return <PreferencesSettings />;
        default: return (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <Icon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-base sm:text-lg font-medium mb-2">Configure {currentItem.label}</h3>
                <p className="text-sm">Settings for {currentItem.label.toLowerCase()} will appear here.</p>
                <div className="mt-4 p-3 sm:p-4 bg-muted/50 rounded-lg text-xs font-mono text-left max-w-md mx-auto">
                  TODO: Implement form for {currentItem.href}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }
    } else {
      // Organization settings placeholders
      return (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <Icon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-base sm:text-lg font-medium mb-2">Configure {currentItem.label}</h3>
              <p className="text-sm">Settings for {currentItem.label.toLowerCase()} will appear here.</p>
              <div className="mt-4 p-3 sm:p-4 bg-muted/50 rounded-lg text-xs font-mono text-left max-w-md mx-auto">
                TODO: Implement Organization form for {currentItem.href}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Mobile Navigation Dropdown */}
      <MobileSettingsNav items={items} basePath={basePath} currentItem={currentItem} />

      {/* Page Header - Hidden on mobile since dropdown shows current section */}
      <div className="hidden lg:block mb-6">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
          {currentItem.label}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your {currentItem.label.toLowerCase()}
        </p>
      </div>

      {renderContent()}
    </div>
  );
}

export default function SettingsPage() {
  const { currentContext } = useOutletContext<{ currentContext: WorkspaceContext }>();
  const location = useLocation();

  const navigationItems = currentContext.type === 'organization'
    ? organizationSettingsNavigation
    : individualSettingsNavigation;

  // Get the base path for settings (remove trailing sections)
  const basePath = location.pathname.split('/settings')[0] + '/settings';

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Settings Sidebar - Hidden on mobile, fixed on desktop */}
      <div className="hidden lg:block lg:fixed lg:top-16 lg:left-28 lg:w-64 lg:h-[calc(100vh-4rem)] bg-background z-10 p-6 border-r">
        <SettingsSidebar items={navigationItems} basePath={basePath} />
      </div>

      {/* Settings Content - Full width on mobile, offset on desktop */}
      <div className="flex-1 p-4 sm:p-6 lg:ml-64 max-w-4xl">
        <Routes>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="*" element={<SettingsContent items={navigationItems} contextType={currentContext.type} basePath={basePath} />} />
        </Routes>
      </div>
    </div>
  );
}

