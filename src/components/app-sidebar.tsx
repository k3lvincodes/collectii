'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package2,
  Settings,
  Users,
  BarChart3,
  Megaphone,
  ListTodo,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/tasks', icon: ListTodo, label: 'Tasks' },
  { href: '/teams', icon: Users, label: 'Teams' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
  { href: '/announcements', icon: Megaphone, label: 'Announcements' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block fixed h-full">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg">Collectii<span className="text-primary">.</span></span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname.startsWith(href) && 'bg-muted text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <nav className="grid items-start text-sm font-medium">
             <Link
                href="/settings"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname.startsWith('/settings') && 'bg-muted text-primary'
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
          </nav>
          <div className="border-t pt-4 mt-4">
             <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704f" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@collectii.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
