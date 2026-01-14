import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
// Image replaced with img

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                Why we built Collectii
              </h1>
              <p className="text-lg text-muted-foreground">
                We believe that great tools don't just solve problems—they create possibilities.
              </p>
            </div>

            <div className="prose prose-invert prose-lg max-w-none mx-auto space-y-12">
              <section>
                <h2 className="font-headline text-3xl font-bold">Our Mission & Vision</h2>
                <p>
                  Our mission is to empower teams, communities, and organizations to achieve their full potential through seamless collaboration. We envision a world where productivity tools are intuitive, integrated, and intelligent, adapting to the unique ways people work together. Collectii is our first step toward that future.
                </p>
              </section>

              <div className="relative w-full h-80 rounded-lg overflow-hidden bg-card border">
                <img 
                  src="https://picsum.photos/1200/800?grayscale" 
                  alt="Team working together"
                  fill
                  className="object-cover"
                  data-ai-hint="team collaboration"
                />
              </div>

              <section>
                <h2 className="font-headline text-3xl font-bold">A Community-First Approach</h2>
                <p>
                  Collectii was born from countless conversations with project managers, community leaders, and startup founders. We saw a common thread: existing tools were either too complex, too siloed, or too expensive. We're building Collectii in the open, driven by community feedback, to create a platform that is powerful yet simple, and accessible to all.
                </p>
              </section>

              <section>
                <h2 className="font-headline text-3xl font-bold">The Future Roadmap</h2>
                <p>
                  Our v1 is just the beginning. We're on a journey to build a comprehensive ecosystem for modern work. Here's a glimpse of what's next:
                </p>
                <ul>
                  <li><strong>AI-Powered Insights:</strong> Moving beyond task prioritization to offer predictive analytics and smart recommendations for resource allocation.</li>
                  <li><strong>Expanded Integrations:</strong> Deepening our connections with popular tools to become the central hub for your entire workflow.</li>
                  <li><strong>Developer Ecosystem:</strong> Opening our platform with APIs to allow for custom solutions and third-party applications.</li>
                </ul>
                <p>
                  Join us on this journey. Your feedback will shape the future of Collectii.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
