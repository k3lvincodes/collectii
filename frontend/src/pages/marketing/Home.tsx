import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
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
    comment: '"Collectii helped us streamline tasks and improve cross-team communication drastically. The AI prioritization is a massive time-saver."',
  },
  {
    name: 'Samantha Bee',
    role: 'Community Lead, Creative Hub',
    avatar: placeholderImages.testimonial2.src,
    comment: '"Finally, a platform that understands the dynamics of both team projects and community engagement. Highly recommended for anyone managing a group!"',
  },
  {
    name: 'David Chen',
    role: 'Founder, Innovate Inc.',
    avatar: placeholderImages.testimonial3.src,
    comment: '"The intuitive design and powerful features made onboarding a breeze. Our productivity has noticeably increased since we switched to Collectii."',
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
                <Link to="/get-started">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/features">See Features</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 relative bg-transparent">
          <div className="container relative z-20">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-white/10">
                  <CardHeader className="items-center text-center">
                    {feature.icon}
                    <CardTitle className="font-headline mt-4 text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{feature.description}</p>
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
                  <div className="z-10 flex items-center justify-center h-16 w-16 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-2xl shrink-0">1</div>
                  <div className="flex-1"></div>
                </div>
                <div className="relative flex items-center gap-8">
                  <div className="flex-1"></div>
                  <div className="z-10 flex items-center justify-center h-16 w-16 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-2xl shrink-0">2</div>
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
                  <div className="z-10 flex items-center justify-center h-16 w-16 rounded-full border-4 border-background bg-primary text-primary-foreground font-bold text-2xl shrink-0">3</div>
                  <div className="flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 overflow-hidden relative bg-transparent">
          <div className="container relative z-20">
            <div className="relative mx-auto w-full max-w-4xl">
              <div className="relative z-10 border-foreground/20 bg-foreground/10 border-8 rounded-t-xl shadow-2xl aspect-video overflow-hidden">
                <img
                  src={placeholderImages.laptopMockup.src}
                  alt="Collectii Dashboard on a laptop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-20 -right-20 md:-right-32 w-48 md:w-64 z-20">
                <div className="relative aspect-[9/19] border-foreground/20 bg-foreground/10 border-4 rounded-3xl shadow-2xl overflow-hidden">
                  <img
                    src={placeholderImages.mobileMockup.src}
                    alt="Collectii tasks on a mobile device"
                    className="w-full h-full object-cover"
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
              >
                <path d="M30.14 15.62C30.14 14.54 30.05 13.51 29.87 12.52H15.31V18.15H23.8C23.51 20.08 22.47 21.75 20.92 22.84V26.47H25.39C28.27 23.83 30.14 20.04 30.14 15.62Z" fill="#4285F4" />
                <path d="M15.31 29.98C19.5 29.98 23.01 28.58 25.39 26.47L20.92 22.84C19.5 23.73 17.65 24.28 15.31 24.28C11.16 24.28 7.64 21.57 6.46 17.8H1.83V21.54C4.15 26.54 9.29 29.98 15.31 29.98Z" fill="#34A853" />
                <path d="M6.46 17.8C6.22 17.06 6.09 16.29 6.09 15.5C6.09 14.71 6.22 13.94 6.46 13.2L1.83 9.46C0.67 11.56 0 13.45 0 15.5C0 17.55 0.67 19.44 1.83 21.54L6.46 17.8Z" fill="#FBBC05" />
                <path d="M15.31 6.72C17.65 6.72 19.64 7.55 21.14 8.97L25.49 4.62C23.01 2.33 19.5 0.93 15.31 0.93C9.29 0.93 4.15 4.37 1.83 9.46L6.46 13.2C7.64 9.43 11.16 6.72 15.31 6.72Z" fill="#EA4335" />
              </svg>
              <svg
                className="h-10 w-10 text-black dark:text-white opacity-60 hover:opacity-100 transition-opacity"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M158.9 164.2C173.8 176.3 179.4 175.4 207.5 173.5L471.8 157.6C477.4 157.6 472.7 152 470.9 151.1L426.9 119.4C418.5 112.9 407.3 105.4 385.8 107.3L129.9 125.9C120.6 126.8 118.7 131.5 122.4 135.2L158.8 164.1zM174.8 225.8L174.8 503.9C174.8 518.8 182.3 524.4 199.1 523.5L489.6 506.7C506.4 505.8 508.3 495.5 508.3 483.4L508.3 207.2C508.3 195.1 503.6 188.5 493.3 189.5L189.7 207.1C178.5 208 174.8 213.6 174.8 225.8zM461.5 240.7C463.4 249.1 461.5 257.5 453.1 258.5L439.1 261.3L439.1 466.6C426.9 473.1 415.7 476.9 406.4 476.9C391.4 476.9 387.7 472.2 376.5 458.2L285 314.5L285 453.5L314 460C314 460 314 476.8 290.6 476.8L226.2 480.5C224.3 476.8 226.2 467.4 232.7 465.6L249.5 460.9L249.5 277.1L226.2 275.2C224.3 266.8 229 254.7 242.1 253.7L311.2 249L406.5 394.6L406.5 265.8L382.2 263C380.3 252.7 387.8 245.3 397.1 244.3L461.6 240.5zM108.4 100.7L374.6 81.1C407.3 78.3 415.7 80.2 436.2 95.1L521.2 154.8C535.2 165.1 539.9 167.9 539.9 179.1L539.9 506.7C539.9 527.2 532.4 539.4 506.3 541.2L197.2 559.8C177.6 560.7 168.2 557.9 158 544.9L95.4 463.7C84.2 448.8 79.5 437.6 79.5 424.5L79.5 133.3C79.5 116.5 87 102.5 108.4 100.6z" />
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
              <CarouselPrevious className="hidden lg:flex" />
              <CarouselNext className="hidden lg:flex" />
            </Carousel>
          </div>
        </section>

        <section className="py-20 text-center relative overflow-hidden bg-transparent">
          <div className="container relative z-20">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Start building for free with your team today.</h2>
            <Button asChild size="lg">
              <Link to="/get-started">Get Early Access <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
