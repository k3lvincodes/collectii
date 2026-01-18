import { useNavigate } from 'react-router-dom';
import { NotificationBell } from "@/components/ui/notification-bell";
import {
  CircleUser,
  Menu,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { SidebarContent } from "@/components/app-sidebar";
import { Organization } from "@/components/ContextSwitcher";
import { useState } from 'react';

interface AppHeaderProps {
  accountType: string;
  user: any;
  currentContext: { type: 'personal' | 'organization'; orgId?: string } | null;
  currentSlug: string;
  organizations: Organization[];
  onContextChange: (context: { type: 'personal' | 'organization'; orgId?: string; orgName?: string }) => void;
  onCreateOrg: () => void;
}

export function AppHeader({
  accountType,
  user,
  currentContext,
  currentSlug,
  organizations,
  onContextChange,
  onCreateOrg
}: AppHeaderProps) {
  const navigate = useNavigate();
  const supabase = createClient();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/sign-in');
  }

  return (
    <header className="fixed top-0 right-0 left-0 md:left-20 flex h-16 items-center gap-4 bg-background/80 backdrop-blur-sm px-4 lg:px-8 z-30">
      {/* Container for the actual interactable header content */}
      <div className="w-full pointer-events-auto flex items-center justify-between">


        {/* Mobile Menu Trigger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden h-10 w-10 rounded-full shadow-sm bg-card border-none text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent
              accountType={accountType}
              user={user}
              currentContext={currentContext}
              currentSlug={currentSlug}
              organizations={organizations}
              onContextChange={onContextChange}
              onCreateOrg={onCreateOrg}
              isExpanded={true}
              onOpenChange={() => { }}
              onNavigate={() => setSheetOpen(false)}
              className="w-full"
            />
          </SheetContent>
        </Sheet>

        {/* Search Bar - Centered or Left aligned based on space, making it look like a floating pill */}
        <div className="hidden md:flex flex-1 max-w-[600px] items-center">
          {/* Removed form wrapper logic for simplicity of style here, keeping input */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-11 h-11 w-full bg-card border-none shadow-sm rounded-full text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Theme Toggle - Assuming it fits the style */}
          <div className="bg-card rounded-full shadow-sm p-1">
            <ThemeToggle />
          </div>

          <NotificationBell className="h-10 w-10 rounded-full bg-card shadow-sm hover:bg-accent border-none" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0 border-2 border-card shadow-sm">
                {/* Replaced Icon with actual avatar look-alike or image if available, using icon for now but styled */}
                <div className="h-full w-full bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-white">
                  <CircleUser className="h-6 w-6" />
                </div>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border shadow-xl">
              <DropdownMenuLabel className="px-3">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl px-3 cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 cursor-pointer">Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-xl px-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
