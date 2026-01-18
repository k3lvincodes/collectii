import { Card, CardContent } from '@/components/ui/card';
import { useOutletContext, Routes, Route, useParams, useLocation, Navigate } from 'react-router-dom';
import { individualSettingsNavigation, organizationSettingsNavigation } from '@/config/dashboard-nav';

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

function SettingsContent({ items, contextType }: { items: any[], contextType: 'personal' | 'organization' }) {
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
            <CardContent className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                <Icon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Configure {currentItem.label}</h3>
                <p>Settings for {currentItem.label.toLowerCase()} will appear here.</p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg text-xs font-mono text-left max-w-md mx-auto">
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
          <CardContent className="p-6">
            <div className="text-center py-12 text-muted-foreground">
              <Icon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium mb-2">Configure {currentItem.label}</h3>
              <p>Settings for {currentItem.label.toLowerCase()} will appear here.</p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg text-xs font-mono text-left max-w-md mx-auto">
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
      <div className="mb-6">
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
    <>
      {/* Settings Sidebar - Fixed Position */}
      <div className="fixed top-16 left-28 w-64 h-[calc(100vh-4rem)] bg-background z-10 p-6">
        <SettingsSidebar items={navigationItems} basePath={basePath} />
      </div>

      {/* Settings Content - Scrollable, with left margin to account for fixed sidebar */}
      <div className="ml-80 p-6 max-w-4xl">
        <Routes>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="*" element={<SettingsContent items={navigationItems} contextType={currentContext.type} />} />
        </Routes>
      </div>
    </>
  );
}
