import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Blocks, Users, BarChart, Zap } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <Blocks className="h-10 w-10 text-primary" />,
    title: 'Task & Workflow Management',
    description: 'Effortlessly create tasks, set priorities and deadlines, add comments, and attach files. Our intuitive workflow tools help you visualize progress and keep projects on track from start to finish.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Team & Community Coordination',
    description: 'Organize your workforce into departments, project groups, or communities. Manage roles and permissions with ease, and use announcements to keep everyone informed and aligned.',
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: 'Reporting & Dashboards',
    description: 'Leverage powerful, auto-generated reports to track key performance indicators. Visualize task completion rates, identify overdue items, and monitor team activity with our clean and insightful dashboards.',
  },
  {
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: 'Seamless Integrations',
    description: 'Collectii works with the tools you already love. Our simple, one-click integration with Google Workspace and Notion helps you centralize workflows and consolidate information without friction.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Features Built for Productivity
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover the tools that will empower your team to achieve more, together.
            </p>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div key={feature.title} className="grid md:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="mb-4">{feature.icon}</div>
                  <h2 className="font-headline text-3xl font-bold mb-4">{feature.title}</h2>
                  <p className="text-muted-foreground text-lg">{feature.description}</p>
                </div>
                <div className={cn('relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-card border', index % 2 === 1 ? 'md:order-1' : '')}>
                   <Image 
                     src={`https://picsum.photos/seed/${index}/800/600`} 
                     alt={feature.title}
                     fill
                     className="object-cover"
                     data-ai-hint="interface screenshot"
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
