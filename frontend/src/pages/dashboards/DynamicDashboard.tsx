import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import IndividualDashboard from '@/pages/dashboards/individual/page';
import OrganizationDashboard from '@/pages/dashboards/organization/page';

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    if (url.endsWith('/api')) return url;
    return `${url}/api`;
};

const API_URL = getApiUrl();

export default function DynamicDashboard() {
    const { contextSlug } = useParams();
    const { user, currentContext } = useOutletContext<any>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardType, setDashboardType] = useState<'individual' | 'organization' | '404' | null>(null);

    useEffect(() => {
        async function determineContext() {
            if (!user || !contextSlug) return;
            setLoading(true);

            // 1. Check if slug matches username (Individual Dashboard)
            // We need to fetch the profile to confirm username match if not already available
            // Assuming user object might not have username, or we check against profile

            try {
                // Fetch profile to get username
                const profileRes = await fetch(`${API_URL}/admin/users/${user.id}`);
                const profileData = await profileRes.json();

                if (profileData && profileData.username === contextSlug) {
                    setDashboardType('individual');
                    setLoading(false);
                    return;
                }

                // 2. Check if slug matches an Organization ID the user is a member of
                const orgsRes = await fetch(`${API_URL}/admin/organizations/user/${user.id}`);
                const orgsData = await orgsRes.json();

                const matchedOrg = orgsData.find((org: any) => org.id === contextSlug);

                if (matchedOrg) {
                    setDashboardType('organization');
                    setLoading(false);
                    return;
                }

                // 3. Fallback / 404
                setDashboardType('404');
            } catch (error) {
                console.error("Error resolving dashboard context:", error);
                setDashboardType('404');
            } finally {
                setLoading(false);
            }
        }

        determineContext();
    }, [contextSlug, user]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (dashboardType === 'individual') {
        return <IndividualDashboard />;
    }

    if (dashboardType === 'organization') {
        return <OrganizationDashboard />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h2 className="text-2xl font-bold">Workspace Not Found</h2>
            <p className="text-muted-foreground">The requested workspace "{contextSlug}" does not exist or you do not have access.</p>
            <button
                onClick={() => navigate('/app')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
                Return Home
            </button>
        </div>
    );
}
