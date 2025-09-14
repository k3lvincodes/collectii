
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ListChecks, UsersRound, GanttChartSquare } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import placeholderImages from '@/lib/placeholder-images.json';
import { DecorativeShapes } from '@/components/decorative-shapes';


const features = [
  {
    icon: <ListChecks className="h-8 w-8 text-primary" />,
    title: 'Task & Workflow Management',
    description: 'Create, assign, and track tasks with priorities, deadlines, comments, and attachments to keep your projects on schedule.',
  },
  {
    icon: <UsersRound className="h-8 w-8 text-primary" />,
    title: 'Team & Community Coordination',
    description: 'Organize your workforce into departments and groups, assign roles, and streamline communication with announcements.',
  },
  {
    icon: <GanttChartSquare className="h-8 w-8 text-primary" />,
    title: 'Reporting & Dashboards',
    description: 'Gain insights with visual KPIs and automated reports on team performance, task completion, and project progress.',
  },
];

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Project Manager, TechCorp',
    avatar: placeholderImages.testimonial1.src,
    comment: '“Collectii helped us streamline tasks and improve cross-team communication drastically. The AI prioritization is a massive time-saver.”',
  },
  {
    name: 'Samantha Bee',
    role: 'Community Lead, Creative Hub',
    avatar: placeholderImages.testimonial2.src,
    comment: '“Finally, a platform that understands the dynamics of both team projects and community engagement. Highly recommended for anyone managing a group!”',
  },
   {
    name: 'David Chen',
    role: 'Founder, Innovate Inc.',
    avatar: placeholderImages.testimonial3.src,
    comment: '“The intuitive design and powerful features made onboarding a breeze. Our productivity has noticeably increased since we switched to Collectii.”',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
      <DecorativeShapes />
        <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
          <div className="container relative z-20">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Collectii helps teams get more done together
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              A Modern Productivity & Workforce Platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/get-started">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/features">See Features</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 relative bg-transparent">
          <div className="container relative z-20">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/20 text-center">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="font-headline mt-4 text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-transparent relative">
          <div className="container text-center relative z-20">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-16">How It Works</h2>
            <div className="relative max-w-2xl mx-auto">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
                <div className="space-y-20">
                    <div className="relative flex items-center gap-8">
                        <div className="flex-1 text-right">
                           <h3 className="font-headline text-2xl font-bold mb-2">Create Tasks</h3>
                            <p className="text-muted-foreground">Easily add new tasks, set priorities, and assign them to your team members.</p>
                        </div>
                        <div className="z-10 flex items-center justify-center h-16 w-16 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-2xl">1</div>
                        <div className="flex-1"></div>
                    </div>
                     <div className="relative flex items-center gap-8">
                        <div className="flex-1"></div>
                        <div className="z-10 flex items-center justify-center h-16 w-16 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-2xl">2</div>
                        <div className="flex-1 text-left">
                           <h3 className="font-headline text-2xl font-bold mb-2">Organize Teams</h3>
                            <p className="text-muted-foreground">Structure your organization into teams and groups for seamless collaboration.</p>
                        </div>
                    </div>
                     <div className="relative flex items-center gap-8">
                        <div className="flex-1 text-right">
                           <h3 className="font-headline text-2xl font-bold mb-2">Track Progress</h3>
                            <p className="text-muted-foreground">Monitor your team's performance with intuitive dashboards and reports.</p>
                        </div>
                        <div className="z-10 flex items-center justify-center h-16 w-16 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-2xl">3</div>
                        <div className="flex-1"></div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        <section className="py-20 overflow-hidden relative bg-transparent">
          <div className="container relative z-20">
             <div className="relative mx-auto w-full max-w-4xl">
                <div className="relative z-10 border-foreground/20 bg-foreground/10 border-8 rounded-t-xl shadow-2xl aspect-video">
                  <Image
                    src={placeholderImages.laptopMockup.src}
                    alt="Collectii Dashboard on a laptop"
                    fill
                    className="rounded-t-lg object-cover"
                    data-ai-hint={placeholderImages.laptopMockup.hint}
                  />
                </div>
                 <div className="absolute -bottom-20 -right-20 md:-right-32 w-48 md:w-64 z-20">
                     <div className="relative aspect-[9/19] border-foreground/20 bg-foreground/10 border-4 rounded-3xl shadow-2xl">
                         <Image
                            src={placeholderImages.mobileMockup.src}
                            alt="Collectii tasks on a mobile device"
                            fill
                            className="rounded-[1.2rem] object-cover"
                            data-ai-hint={placeholderImages.mobileMockup.hint}
                        />
                     </div>
                 </div>
             </div>
          </div>
        </section>

         <section className="py-20 text-center relative bg-transparent">
          <div className="container max-w-3xl relative z-20">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Works seamlessly with the tools you already use.</h2>
            <p className="text-muted-foreground mb-8">Connect your favorite apps to make Collectii your central hub for productivity.</p>
            <div className="flex justify-center items-center gap-12">
              <Image src="/google-logo.svg" alt="Google" width={100} height={40} data-ai-hint="google logo" className="opacity-60 hover:opacity-100 transition-opacity" />
              <Image src="/notion-logo.svg" alt="Notion" width={90} height={40} data-ai-hint="notion logo" className="opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-transparent relative">
          <div className="container relative z-20">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Loved by Beta Users</h2>
            <Carousel opts={{ loop: true, align: "start" }} className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <Card className="h-full bg-card/80 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <p className="mb-4 text-muted-foreground italic">"{testimonial.comment}"</p>
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex"/>
              <CarouselNext className="hidden lg:flex"/>
            </Carousel>
          </div>
        </section>

        <section className="py-20 text-center relative overflow-hidden bg-transparent">
          <div className="container relative z-20">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Start building for free with your team today.</h2>
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
