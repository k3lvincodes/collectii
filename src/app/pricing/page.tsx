import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const freeFeatures = [
  'Task & Workflow Management',
  'Team & Community Coordination',
  'Reporting & Dashboards',
  'AI Task Prioritization',
  'Google & Notion Integration',
  'Announcements',
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Get started for free during our launch phase. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="flex flex-col border-primary shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Launch Phase</CardTitle>
                <CardDescription>Free for everyone. Forever.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-4xl font-bold mb-4">Free</p>
                <ul className="space-y-3">
                  {freeFeatures.map(feature => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild size="lg">
                  <Link href="/get-started">Get Started Free</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col bg-card border-dashed">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Standard Plan</CardTitle>
                <CardDescription className="text-primary">Coming Soon</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">Includes everything in the free plan, plus:</p>
                <ul className="space-y-3 mt-4 text-muted-foreground/70">
                  <li className="flex items-center"><Check className="h-5 w-5 mr-2"/> Extra Storage</li>
                  <li className="flex items-center"><Check className="h-5 w-5 mr-2"/> More Integrations</li>
                  <li className="flex items-center"><Check className="h-5 w-5 mr-2"/> Advanced User Roles</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="flex flex-col bg-card border-dashed">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Premium / Enterprise</CardTitle>
                <CardDescription className="text-primary">Coming Soon</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">For large organizations requiring advanced features:</p>
                <ul className="space-y-3 mt-4 text-muted-foreground/70">
                  <li className="flex items-center"><Check className="h-5 w-5 mr-2"/> Advanced Analytics</li>
                  <li className="flex items-center"><Check className="h-5 w-5 mr-2"/> Compliance & Security</li>
                  <li className="flex items-center"><Check className="h-5 w-5 mr-2"/> Dedicated Support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
