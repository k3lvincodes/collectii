
import { AdminSidebar } from '@/components/admin-sidebar';
import { createClient } from '@/lib/supabase/client';
import { redirect } from 'react-router-dom';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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

    // Ensure only super_admin can access this area
    if (profile?.account_type !== 'super_admin') {
        navigate('/'); // Redirect non-admins
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
