
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
];

const resources = [
  { name: 'Blog', href: '/blog' },
  { name: 'Help Center', href: '/docs' },
  { name: 'Community', href: '#', disabled: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold font-headline text-lg">Collectii<span className="text-primary">.</span></span>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center">
          <nav className="hidden gap-6 text-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === item.href ? 'text-foreground' : 'text-foreground/60'
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
                    <Link href={item.href}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/get-started">Get Started</Link>
            </Button>
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
              <Link href="/" className="mr-6 flex items-center space-x-2">
                 <span className="font-bold font-headline text-lg">Collectii<span className="text-primary">.</span></span>
              </Link>
              <div className="flex flex-col h-full">
                <div className="flex flex-col space-y-3 pt-6">
                  {[...navItems, ...resources].map((item) => (
                    !item.disabled && (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'text-lg transition-colors hover:text-foreground/80',
                          pathname === item.href ? 'text-foreground' : 'text-foreground/60'
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
