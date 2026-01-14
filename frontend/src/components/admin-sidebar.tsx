import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    Package2,
    Settings,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    adminNavSections,
} from '@/config/dashboard-nav';

interface AdminSidebarProps {
    user: any;
}

// Generate section route from title
function getSectionRoute(title: string): string {
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');

    // Special case for Platform Overview
    if (title === 'Platform Overview') {
        return '/admin';
    }

    return `/admin/${slug}`;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = useLocation().pathname;
    const [isHovered, setIsHovered] = useState(false);
    const isExpanded = isHovered;

    return (
        <div
            className={cn(
                "hidden border-r-0 bg-transparent md:block fixed h-full transition-all duration-300 ease-in-out z-50",
                isExpanded ? "w-[250px] bg-sidebar/95 backdrop-blur-sm shadow-2xl border-r border-sidebar-border" : "w-[80px]"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex h-full max-h-screen flex-col gap-2 p-4">
                {/* Header */}
                <div className="flex h-16 items-center px-2">
                    <Link to="/admin" className={cn("flex items-center gap-2 font-semibold", !isExpanded && "justify-center w-full")}>
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <Package2 className="h-6 w-6 text-primary" />
                        </div>
                        {isExpanded && (
                            <span className="font-headline text-lg animate-in fade-in duration-300">
                                Collectii<span className="text-primary">.</span> Admin
                            </span>
                        )}
                    </Link>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 py-4">
                    <nav className="space-y-1">

                        {adminNavSections.map((section) => {
                            const sectionRoute = section.items[0]?.href;
                            // Check if any item in this section is active
                            const isActive = section.items.some(item => {
                                if (item.href === '/admin') return pathname === '/admin';
                                return pathname.startsWith(item.href);
                            });

                            const SectionIcon = section.items[0]?.icon;

                            return (
                                <Link
                                    key={section.title}
                                    to={sectionRoute}
                                    className={cn(
                                        'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all group relative',
                                        isActive
                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-border'
                                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm',
                                        !isExpanded && "justify-center px-0 w-12 h-12 mx-auto"
                                    )}
                                >
                                    {SectionIcon && <SectionIcon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground")} />}
                                    {isExpanded && <span className="truncate">{section.title}</span>}
                                </Link>
                            );
                        })}


                        {/* Messages Section */}
                        <Link
                            to="/admin/messages"
                            className={cn(
                                'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all group relative',
                                pathname.startsWith('/admin/messages')
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-border'
                                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm',
                                !isExpanded && "justify-center px-0 w-12 h-12 mx-auto"
                            )}
                        >
                            <Package2 className={cn("h-5 w-5 shrink-0 transition-colors", pathname.startsWith('/admin/messages') ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground")} />
                            {isExpanded && <span className="truncate">Messages</span>}
                        </Link>
                    </nav>
                </div>

                {/* Bottom Section: Settings + User Profile */}
                <div className="mt-auto pt-4 border-t border-sidebar-border">
                    <div className={cn("flex items-center gap-3 bg-sidebar-accent/50 p-2 rounded-full shadow-sm border border-sidebar-border", !isExpanded && "p-0 bg-transparent border-none shadow-none justify-center")}>
                        <Avatar className="h-9 w-9">
                            <AvatarImage
                                src={user?.avatar_url || 'https://i.pravatar.cc/150'}
                            />
                            <AvatarFallback>
                                {user?.full_name?.charAt(0) || 'A'}
                            </AvatarFallback>
                        </Avatar>
                        {isExpanded && (
                            <div className="overflow-hidden pr-2">
                                <p className="font-semibold truncate text-xs text-sidebar-foreground">
                                    {user?.full_name || 'Admin'}
                                </p>
                                <p className="text-[10px] text-sidebar-foreground/70 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
