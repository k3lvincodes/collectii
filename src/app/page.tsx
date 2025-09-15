
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
      <main className="flex-1 relative">
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
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-white/10">
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
               <svg
                className="h-10 w-25 opacity-60 hover:opacity-100 transition-opacity"
                viewBox="0 0 92 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                data-ai-hint="google logo"
              >
                <path d="M30.14 15.62C30.14 14.54 30.05 13.51 29.87 12.52H15.31V18.15H23.8C23.51 20.08 22.47 21.75 20.92 22.84V26.47H25.39C28.27 23.83 30.14 20.04 30.14 15.62Z" fill="#4285F4"/>
                <path d="M15.31 29.98C19.5 29.98 23.01 28.58 25.39 26.47L20.92 22.84C19.5 23.73 17.65 24.28 15.31 24.28C11.16 24.28 7.64 21.57 6.46 17.8H1.83V21.54C4.15 26.54 9.29 29.98 15.31 29.98Z" fill="#34A853"/>
                <path d="M6.46 17.8C6.22 17.06 6.09 16.29 6.09 15.5C6.09 14.71 6.22 13.94 6.46 13.2L1.83 9.46C0.67 11.56 0 13.45 0 15.5C0 17.55 0.67 19.44 1.83 21.54L6.46 17.8Z" fill="#FBBC05"/>
                <path d="M15.31 6.72C17.65 6.72 19.64 7.55 21.14 8.97L25.49 4.62C23.01 2.33 19.5 0.93 15.31 0.93C9.29 0.93 4.15 4.37 1.83 9.46L6.46 13.2C7.64 9.43 11.16 6.72 15.31 6.72Z" fill="#EA4335"/>
              </svg>
              <svg
                className="h-10 w-22 text-black dark:text-white opacity-60 hover:opacity-100 transition-opacity"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                data-ai-hint="notion logo"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v8h-2v-8zm0 10h2v2h-2v-2z" />
                <path d="M18.4,5.6H5.6v12.8h12.8V5.6z M9.6,16H8V8h1.6V16z M12.8,16h-1.6V8h1.6V16z M16,16h-1.6V8H16V16z M19.2,16H18.4l-3.2-4.8V16h-1.6V8h1.6l3.2,4.8V8h1.6V16z" />
              </svg>
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
