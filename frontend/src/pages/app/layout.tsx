import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/sidebar_context';
import { DashboardLayoutWrapper } from '@/components/dashboard-layout-wrapper';
import { createClient } from '@/lib/supabase/client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [currentContext, setCurrentContext] = useState<{ type: 'personal' | 'organization'; orgId?: string }>({ type: 'personal' });

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/sign-in');
        return;
      }

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('account_type, full_name, email, avatar_url, username')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch Organizations
      const { data: orgsData } = await supabase
        .from('organization_members')
        .select(`
          role,
          organization:custom_organizations (
            id,
            name,
            logo_url
          )
        `)
        .eq('user_id', user.id);

      const formattedOrgs = orgsData?.map((item: any) => ({
        id: item.organization.id,
        name: item.organization.name,
        logo: item.organization.logo_url,
        role: item.role,
        created_at: new Date().toISOString() // Mock if needed or fetch
      })) || [];

      setOrganizations(formattedOrgs);
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleContextChange = (context: { type: 'personal' | 'organization'; orgId?: string; orgName?: string }) => {
    setCurrentContext(context);
    // Ideally navigate to the new context url
    const slug = context.type === 'personal' ? (profile?.username || 'personal') : context.orgId;
    navigate(`/app/${slug}`);
  };

  const handleCreateOrg = () => {
    // Navigate to create org page or open modal
    console.log("Create Org Clicked");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentSlug = currentContext.type === 'personal' ? (profile?.username || 'personal') : (currentContext.orgId || '');

  return (
    <SidebarProvider>
      <DashboardLayoutWrapper
        accountType={profile?.account_type || 'individual'}
        user={profile}
        currentContext={currentContext}
        currentSlug={currentSlug}
        organizations={organizations}
        onContextChange={handleContextChange}
        onCreateOrg={handleCreateOrg}
      >
        {children}
      </DashboardLayoutWrapper>
    </SidebarProvider>
  );
}
