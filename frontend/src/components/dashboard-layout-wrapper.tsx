import { useSidebar } from '@/components/sidebar_context';
import { cn } from '@/lib/utils';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';

interface DashboardLayoutWrapperProps {
    children: React.ReactNode;
    user: any;
    accountType: string;
}

export function DashboardLayoutWrapper({ children, user, accountType }: DashboardLayoutWrapperProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background">
            <AppSidebar accountType={accountType} user={user} />
            <div
                className={cn(
                    "flex flex-col transition-all duration-300 ease-in-out ml-[80px]"
                )}
            >
                <AppHeader />
                {children}
            </div>
        </div>
    );
}
