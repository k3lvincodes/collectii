import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useOutletContext, Routes, Route, useParams } from 'react-router-dom';
import { individualSettingsNavigation, organizationSettingsNavigation } from '@/config/dashboard-nav';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Individual Settings Components
import ProfileSettings from '@/components/settings/individual/ProfileSettings';
import SecuritySettings from '@/components/settings/individual/SecuritySettings';
import PreferencesSettings from '@/components/settings/individual/PreferencesSettings';

interface WorkspaceContext {
  type: 'personal' | 'organization';
  orgId?: string;
  orgName?: string;
}

function SettingsOverview({ items }: { items: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} to={item.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Manage {item.label.toLowerCase()}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SettingsDetail({ items, contextType }: { items: any[], contextType: 'personal' | 'organization' }) {
  const { "*": section } = useParams();
  const topSection = section?.split('/')[0];
  const currentItem = items.find(item => item.href === topSection);

  if (!currentItem) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <h2 className="text-xl font-semibold mb-2">Setting not found</h2>
        <Link to=".">
          <Button variant="outline">Go back</Button>
        </Link>
      </div>
    );
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
          <div className="text-center py-12 text-muted-foreground">
            <Icon className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-2">Configure {currentItem.label}</h3>
            <p>Settings for {currentItem.label.toLowerCase()} will appear here.</p>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-xs font-mono text-left max-w-md mx-auto">
              TODO: Implement form for {currentItem.href}
            </div>
          </div>
        );
      }
    } else {
      // Organization settings placeholders
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Icon className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-2">Configure {currentItem.label}</h3>
          <p>Settings for {currentItem.label.toLowerCase()} will appear here.</p>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg text-xs font-mono text-left max-w-md mx-auto">
            TODO: Implement Organization form for {currentItem.href}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to=".">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary" />
            {currentItem.label}
          </h1>
        </div>
      </div>

      {/* If it's a known component, render it directly. Otherwise wrap in Card for placeholders */}
      {['profile', 'security', 'preferences'].includes(topSection || '') && contextType === 'personal' ? (
        renderContent()
      ) : (
        <Card>
          <CardContent className="p-6">
            {renderContent()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { currentContext } = useOutletContext<{ currentContext: WorkspaceContext }>();

  const navigationItems = currentContext.type === 'organization'
    ? organizationSettingsNavigation
    : individualSettingsNavigation;

  return (
    <div className="p-6">
      <Routes>
        <Route index element={<SettingsOverview items={navigationItems} />} />
        <Route path="*" element={<SettingsDetail items={navigationItems} contextType={currentContext.type} />} />
      </Routes>
    </div>
  );
}
