import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin-sidebar';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/sign-in');
                return;
            }

            const { data } = await supabase
                .from('profiles')
                .select('account_type, full_name, email, avatar_url')
                .eq('id', user.id)
                .single();

            if (data?.account_type !== 'super_admin') {
                navigate('/');
                return;
            }

            setProfile(data);
            setIsLoading(false);
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <AdminSidebar user={profile} />
            <div className="flex flex-col ml-[80px] transition-all duration-300">
                {children}
            </div>
        </div>
    );
}
