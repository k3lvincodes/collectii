import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Helper to get API URL
const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    if (url.endsWith('/api')) return url;
    return `${url}/api`;
};

const API_URL = getApiUrl();

export function DashboardRedirect() {
    const navigate = useNavigate();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const redirectUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/sign-in");
                return;
            }

            try {
                // Fetch profile to get username
                // Accessing via API to ensure clean logic, or could use Supabase direct
                // Using Supabase direct is faster and avoids an extra round trip if RLS policies allow
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error("DashboardRedirect: Error fetching profile", error);
                    // Fallback to API if Supabase fails (though they share DB)
                    // Or just handle error
                    throw error;
                }

                if (profile && profile.username) {
                    // Redirect to Personal Dashboard
                    navigate(`/app/${profile.username}`);
                } else {
                    // No username yet? AppLayout should show the modal.
                    // We can stay here or redirect to a fallback.
                    // If we stay here, we render nothing (loading) while modal is up?
                    // AppLayout creates the context, but we are inside the Outlet.
                    // Let's stop loading. user will see blank page + modal.
                    setLoading(false);
                }

            } catch (error) {
                console.error("Error in redirect:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load profile. Please try refreshing.",
                });
                setLoading(false);
            }
        };

        redirectUser();
    }, [navigate, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return null;
}
