import Link from 'next/link';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '#' },
  { name: 'Blog', href: '/blog' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold font-headline text-lg">Collectii.</h3>
            <p className="text-muted-foreground mt-2">A Modern Productivity & Workforce Platform.</p>
            <p className="text-xs text-muted-foreground mt-4">Subtle “Made with Collectii” tagline.</p>
          </div>
          <div className="flex justify-between md:justify-end">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Links</h4>
              {footerLinks.map(link => (
                <Link key={link.name} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2 ml-12">
              <h4 className="font-semibold">Socials</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter/X</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
