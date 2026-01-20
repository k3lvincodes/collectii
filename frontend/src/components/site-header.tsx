
import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, CircleUser, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Features', to: '/features' },
  { name: 'Pricing', to: '/pricing' },
  { name: 'About', to: '/about' },
];

const resources = [
  { name: 'Blog', to: '/blog' },
  { name: 'Help Center', to: '/docs' },
  { name: 'Community', to: '#', disabled: true },
];

export function SiteHeader() {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const navigate = useNavigate();
  const supabase = createClient();

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/sign-in'); // Or refresh page
    setIsAuthenticated(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold font-headline text-lg">Collectii<span className="text-primary">.</span></span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <nav className="hidden gap-6 text-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.to ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {item.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80 focus-visible:outline-none">
                Resources
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {resources.map((item) => (
                  <DropdownMenuItem key={item.name} asChild disabled={item.disabled}>
                    <Link to={item.to}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated === null ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : isAuthenticated ? (
              <>
                <Button asChild>
                  <Link to="/app">Dashboard</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 p-0 border-2 border-card shadow-sm">
                      <div className="h-full w-full bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-white">
                        <CircleUser className="h-6 w-6" />
                      </div>
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border shadow-xl">
                    <DropdownMenuLabel className="px-3">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-xl px-3 cursor-pointer">
                      <Link to="/app/settings">Settings</Link>
                    </DropdownMenuItem>
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
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/get-started">Get Started</Link>
                </Button>
              </>
            )}
          </div>
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetTitle><span className="sr-only">Mobile Menu</span></SheetTitle>
              <Link to="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold font-headline text-lg">Collectii<span className="text-primary">.</span></span>
              </Link>
              <div className="flex flex-col h-full">
                <div className="flex flex-col space-y-3 pt-6">
                  {[...navItems, ...resources].map((item) => (
                    !(item as any).disabled && (
                      <Link
                        key={item.name}
                        to={item.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'text-lg transition-colors hover:text-foreground/80',
                          pathname === item.to ? 'text-foreground' : 'text-foreground/60'
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-2 items-center">
                  {/* Mobile Menu Auth State */}
                  {isAuthenticated ? (
                    <>
                      <Button asChild>
                        <Link to="/app" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                      </Button>
                      <Button variant="outline" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild>
                        <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                      </Button>
                      <Button asChild>
                        <Link to="/get-started" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
