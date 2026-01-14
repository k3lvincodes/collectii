import { Bell, Search } from 'lucide-react';
import { NotificationBell } from '@/components/ui/notification-bell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
    user?: {
        full_name?: string;
        avatar_url?: string;
        email?: string;
    };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between px-6 bg-transparent pointer-events-none">
            {/* Interactivity wrapper */}
            <div className="w-full pointer-events-auto flex items-center justify-between">
                {/* Left Spacer */}
                <div className="w-[100px] hidden md:block"></div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-[600px] relative">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search anything..."
                            className="pl-11 h-11 w-full bg-white border-none shadow-sm rounded-full text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 w-[100px] justify-end">
                    <NotificationBell className="h-10 w-10 rounded-full bg-white shadow-sm hover:bg-gray-50 border-none" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0 shadow-sm border-2 border-white">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={user?.avatar_url || ''} alt={user?.full_name || ''} />
                                    <AvatarFallback>{user?.full_name?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-gray-100 shadow-xl">
                            <DropdownMenuLabel className="px-3">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="rounded-xl px-3 cursor-pointer">Settings</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 cursor-pointer">Support</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
