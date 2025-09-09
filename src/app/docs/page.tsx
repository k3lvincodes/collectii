import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I create a new task?",
    answer: "To create a new task, navigate to the 'Tasks' page from the sidebar and click the 'Add Task' button. A dialog will appear where you can fill in the task details like title, assignee, deadline, and priority."
  },
  {
    question: "Can I assign a task to multiple people?",
    answer: "In our current version (v1), each task can only be assigned to a single person to ensure clear ownership. We are considering options for collaborative tasks in a future update."
  },
  {
    question: "How do I add a new member to my team?",
    answer: "As an Admin, you can go to the 'Teams' page, select the team you want to add a member to, and click the 'Add Member' button. You will need their email address to send an invitation."
  },
  {
    question: "What integrations are currently supported?",
    answer: "We currently offer seamless integration with Google Workspace (for authentication and future Drive integration) and Notion. You can connect your accounts in the 'Settings' > 'Integrations' page."
  },
  {
    question: "How does the AI Task Prioritization work?",
    answer: "Our AI tool analyzes all open tasks, considering their deadlines, dependencies, and the availability of the assigned team members. It then suggests a 'high', 'medium', or 'low' priority to help you focus on what's most important."
  }
];

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Help Center
            </h1>
            <p className="text-lg text-muted-foreground">
              Frequently Asked Questions to get you started with Collectii.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
