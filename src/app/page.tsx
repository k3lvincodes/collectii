import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Blocks, Users, BarChart } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const features = [
  {
    icon: <Blocks className="h-8 w-8 text-primary" />,
    title: 'Task & Workflow Management',
    description: 'Create, assign, and track tasks with priorities, deadlines, comments, and attachments to keep your projects on schedule.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Team & Community Coordination',
    description: 'Organize your workforce into departments and groups, assign roles, and streamline communication with announcements.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Reporting & Dashboards',
    description: 'Gain insights with visual KPIs and automated reports on team performance, task completion, and project progress.',
  },
];

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Project Manager, TechCorp',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    comment: '“Collectii has revolutionized how our team collaborates. The AI-powered task prioritization is a game-changer for meeting deadlines.”',
  },
  {
    name: 'Samantha Bee',
    role: 'Community Lead, Creative Hub',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    comment: '“Finally, a platform that understands the dynamics of both team projects and community engagement. Highly recommended!”',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative py-20 md:py-32 text-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 top-0 z-0 h-full w-full bg-background bg-gradient-to-b from-transparent to-background"
          ></div>
          <div className="container relative z-10">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Collectii: A Modern Productivity & Workforce Platform.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Empowering teams, communities, and organizations to get more done together.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/get-started">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/features">See Features</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card border-border/50">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="font-headline mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 text-center">
          <div className="container">
            <h3 className="text-muted-foreground font-headline mb-4">WORKS SEAMLESSLY WITH GOOGLE & NOTION</h3>
            <div className="flex justify-center items-center gap-8">
              <Image src="/google-logo.svg" alt="Google" width={100} height={40} data-ai-hint="google logo" />
              <Image src="/notion-logo.svg" alt="Notion" width={90} height={40} data-ai-hint="notion logo" />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mt-12 max-w-5xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary text-primary font-bold text-2xl mb-4">1</div>
                <h3 className="font-headline text-xl font-bold mb-2">Create Tasks</h3>
                <p className="text-muted-foreground">Easily add new tasks, set priorities, and assign them to your team members.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary text-primary font-bold text-2xl mb-4">2</div>
                <h3 className="font-headline text-xl font-bold mb-2">Organize Teams</h3>
                <p className="text-muted-foreground">Structure your organization into teams and groups for seamless collaboration.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full border-2 border-primary text-primary font-bold text-2xl mb-4">3</div>
                <h3 className="font-headline text-xl font-bold mb-2">Track Progress</h3>
                <p className="text-muted-foreground">Monitor your team's performance with intuitive dashboards and reports.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="relative mx-auto border-foreground/20 bg-foreground/10 border-[8px] rounded-t-xl w-full h-[400px] md:h-[600px] shadow-2xl">
              <Image
                src="https://picsum.photos/1200/800"
                alt="Collectii Dashboard"
                fill
                className="rounded-t-lg object-cover"
                data-ai-hint="dashboard analytics"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Loved by Beta Users</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-card border-border/50">
                  <CardContent className="pt-6">
                    <p className="mb-4">{testimonial.comment}</p>
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="container">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Collectii is free at launch.</h2>
            <p className="text-lg text-muted-foreground mb-8">Start building with your team today.</p>
            <Button asChild size="lg">
              <Link href="/get-started">Get Early Access <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
