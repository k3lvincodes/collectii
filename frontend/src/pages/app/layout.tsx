import { SidebarProvider } from '@/components/sidebar_context';
import { DashboardLayoutWrapper } from '@/components/dashboard-layout-wrapper';
import { createClient } from '@/lib/supabase/client';
import { redirect } from 'react-router-dom';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    navigate('/sign-in');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('account_type, full_name, email, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <SidebarProvider>
      <DashboardLayoutWrapper
        accountType={profile?.account_type || 'individual'}
        user={profile}
      >
        {children}
      </DashboardLayoutWrapper>
    </SidebarProvider>
  );
}
