import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const blogPosts = [
  {
    title: '5 Ways to Boost Team Productivity Overnight',
    category: 'Productivity',
    date: 'October 26, 2023',
    imageUrl: 'https://picsum.photos/seed/blog1/600/400',
    slug: '#',
    description: 'Discover actionable strategies to help your team get more done without burnout.'
  },
  {
    title: 'The Art of Effective Task Management',
    category: 'Teamwork',
    date: 'October 22, 2023',
    imageUrl: 'https://picsum.photos/seed/blog2/600/400',
    slug: '#',
    description: 'Learn how to prioritize tasks, manage deadlines, and keep your projects on track.'
  },
  {
    title: 'Building Thriving Online Communities',
    category: 'Communities',
    date: 'October 18, 2023',
    imageUrl: 'https://picsum.photos/seed/blog3/600/400',
    slug: '#',
    description: 'Tips and tricks for fostering engagement and collaboration in your community.'
  },
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Collectii Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Insights on productivity, teamwork, and building communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <Link href={post.slug} key={post.title}>
                <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader className="p-0">
                    <div className="relative w-full h-48">
                      <Image 
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        data-ai-hint="abstract texture"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-2">{post.category}</Badge>
                    <h2 className="font-headline text-xl font-bold mb-2">{post.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
