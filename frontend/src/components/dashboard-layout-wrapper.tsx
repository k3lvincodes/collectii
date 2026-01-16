import { useSidebar } from '@/components/sidebar_context';
import { cn } from '@/lib/utils';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';

interface DashboardLayoutWrapperProps {
    children: React.ReactNode;
    user: any;
    accountType: string;
    currentContext: { type: 'personal' | 'organization'; orgId?: string } | null;
    currentSlug: string;
    organizations: any[]; // Using any[] to avoid circular dependency or import issues if Organization generic
    onContextChange: (context: { type: 'personal' | 'organization'; orgId?: string; orgName?: string }) => void;
    onCreateOrg: () => void;
}

export function DashboardLayoutWrapper({
    children,
    user,
    accountType,
    currentContext,
    currentSlug,
    organizations,
    onContextChange,
    onCreateOrg
}: DashboardLayoutWrapperProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background">
            <AppSidebar
                accountType={accountType}
                user={user}
                currentContext={currentContext}
                currentSlug={currentSlug}
                organizations={organizations}
                onContextChange={onContextChange}
                onCreateOrg={onCreateOrg}
            />
            <div
                className={cn(
                    "flex flex-col transition-all duration-300 ease-in-out ml-[80px]"
                )}
            >
                <AppHeader
                    accountType={accountType}
                    user={user}
                    currentContext={currentContext}
                    currentSlug={currentSlug}
                    organizations={organizations}
                    onContextChange={onContextChange}
                    onCreateOrg={onCreateOrg}
                />
                {children}
            </div>
        </div>
    );
}
