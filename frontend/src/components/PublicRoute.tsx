import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { createClient } from '@/lib/supabase/client';
import { LoadingFallback } from './ui/loading-fallback';

export const PublicRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userSlug, setUserSlug] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Get user slug (username) to redirect correctly
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', session.user.id)
                    .single();

                setUserSlug(profile?.username || null);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <LoadingFallback />;
    }

    if (isAuthenticated) {
        // Redirect to dashboard if already logged in
        // Default to /app if username not found, otherwise /app/{username}
        return <Navigate to={userSlug ? `/app/${userSlug}` : '/app'} replace />;
    }

    return <Outlet />;
};
