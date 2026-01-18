import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { UsernameSetupModal } from "@/components/modals/UsernameSetupModal"
import { CreateOrganizationModal } from "@/components/modals/CreateOrganizationModal"
import { Organization } from "@/components/ContextSwitcher"

interface WorkspaceContext {
  type: 'personal' | 'organization';
  orgId?: string;
  orgName?: string;
}

const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  if (url.endsWith('/api')) return url;
  return `${url}/api`;
};

const API_URL = getApiUrl();

export default function AppLayout() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [needsUsername, setNeedsUsername] = useState(false)
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false)
  const [currentContext, setCurrentContext] = useState<WorkspaceContext>({ type: 'personal' })
  const [hasTeams, setHasTeams] = useState(false) // Added

  const supabase = createClient()
  const location = useLocation()
  const navigate = useNavigate()

  // Parse context slug from URL: /app/:slug
  const pathParts = location.pathname.split('/');
  const contextSlug = pathParts[2];

  useEffect(() => {
    let channel: any;

    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Function to check teams
        const checkTeams = async () => {
          try {
            const { count } = await supabase
              .from('team_members')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);
            setHasTeams((count || 0) > 0);
          } catch (e) {
            console.error(e);
          }
        };

        // Initial check
        checkTeams();

        // Subscribe to changes
        channel = supabase
          .channel('team_members_updates')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'team_members',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              checkTeams();
            }
          )
          .subscribe();

        const { data: profile } = await supabase
          .from('profiles')
          .select('username') // Removed account_type selection
          .eq('id', user.id)
          .single()
        setProfile(profile)

        // Check if username is missing
        if (!profile?.username) {
          setNeedsUsername(true)
        }

        // Fetch Organizations
        try {
          const res = await fetch(`${API_URL}/admin/organizations/user/${user.id}`);
          const data = await res.json();
          setOrganizations(data || []);
        } catch (error) {
          console.error('Error fetching organizations:', error);
        }
      }
    }
    getUserData()

    return () => {
      if (channel) supabase.removeChannel(channel);
    }
  }, [])

  // Sync state with URL
  useEffect(() => {
    if (!profile || !contextSlug) return;

    // Check if slug is username for Personal context
    if (contextSlug === profile.username) {
      setCurrentContext({ type: 'personal' });
    } else {
      // Otherwise assume it's an Organization ID
      // Real-time validation happens in DynamicDashboard, here we just set context for sidebar
      setCurrentContext({ type: 'organization', orgId: contextSlug });
    }
  }, [contextSlug, profile]);

  const handleUsernameSuccess = (newUsername: string) => {
    setProfile((prev: any) => ({ ...prev, username: newUsername }))
    setNeedsUsername(false)
  }

  // Navigate to the correct URL when context changes from Sidebar
  const handleContextChange = (context: WorkspaceContext) => {
    setCurrentContext(context)
    if (context.type === 'personal') {
      if (profile?.username) {
        navigate(`/app/${profile.username}`);
      }
    } else if (context.orgId) {
      navigate(`/app/${context.orgId}`);
    }
  };

  const handleOrgCreated = (org: { id: string; name: string }) => {
    // Add new org to state immediately
    const newOrg: Organization = {
      id: org.id,
      name: org.name,
      role: 'owner', // Creator is implicitly owner
    };
    setOrganizations(prev => [...prev, newOrg]);

    setShowCreateOrgModal(false)
    navigate(`/app/${org.id}`)
  }

  // Determine account type based on context (legacy prop for sidebar styling)
  const accountType = currentContext.type === 'organization' ? 'organization' : 'individual'

  return (
    <SidebarProvider>
      <AppSidebar
        accountType={accountType}
        user={user}
        currentContext={currentContext}
        currentSlug={contextSlug || ''}
        organizations={organizations}
        hasTeams={hasTeams}
        onContextChange={handleContextChange}
        onCreateOrg={() => setShowCreateOrgModal(true)}
      />
      <div className="flex flex-col flex-1 overflow-hidden md:pl-20">
        <AppHeader
          user={user}
          accountType={accountType}
          currentContext={currentContext}
          currentSlug={contextSlug || ''}
          organizations={organizations}
          onContextChange={handleContextChange}
          onCreateOrg={() => setShowCreateOrgModal(true)}
        />

        <main className="flex-1 overflow-auto bg-background pt-16">
          <Outlet context={{ currentContext, user }} />
        </main>
      </div>

      {/* Username Enforcement Modal */}
      <UsernameSetupModal
        open={needsUsername}
        user={user}
        onSuccess={handleUsernameSuccess}
      />

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        open={showCreateOrgModal}
        userId={user?.id}
        onClose={() => setShowCreateOrgModal(false)}
        onSuccess={handleOrgCreated}
      />
    </SidebarProvider>
  )
}
