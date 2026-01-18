import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavItem } from '@/config/dashboard-nav';

interface SettingsSidebarProps {
    items: NavItem[];
    basePath: string;
}

export default function SettingsSidebar({ items, basePath }: SettingsSidebarProps) {
    const location = useLocation();

    // Extract the current settings section from the URL
    const currentPath = location.pathname.replace(basePath + '/', '').split('/')[0];

    return (
        <nav className="space-y-1">
            <div className="mb-4">
                <h2 className="px-3 text-lg font-semibold font-headline">Settings</h2>
                <p className="px-3 text-sm text-muted-foreground">Manage your account</p>
            </div>

            <div className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.href ||
                        (item.href === 'profile' && !currentPath);

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                "hover:bg-muted/80",
                                isActive
                                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn(
                                "h-4 w-4 shrink-0",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
