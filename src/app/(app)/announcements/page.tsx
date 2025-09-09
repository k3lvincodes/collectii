import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const announcements = [
  {
    pinned: true,
    author: 'Alice',
    avatar: 'https://i.pravatar.cc/40?u=alice',
    group: 'All Hands',
    title: 'Q4 Company-Wide All Hands - Oct 30th',
    content: 'Reminder: Our quarterly all-hands meeting is scheduled for next Monday. Please submit your questions in the shared document. A link to the presentation will be shared shortly.',
    date: '3 days ago'
  },
  {
    pinned: false,
    author: 'Bob',
    avatar: 'https://i.pravatar.cc/40?u=bob',
    group: 'Marketing',
    title: 'New Campaign Launch: "Collectii for Communities"',
    content: 'The new marketing campaign will go live next week! Please review the final assets in the shared folder and provide any feedback by EOD Friday.',
    date: '5 days ago'
  },
   {
    pinned: false,
    author: 'Charlie',
    avatar: 'https://i.pravatar.cc/40?u=charlie',
    group: 'Engineering',
    title: 'Deployment Freeze for Thanksgiving',
    content: 'Heads up team, there will be a production deployment freeze from Nov 20th to Nov 27th for the Thanksgiving holiday in the US.',
    date: '6 days ago'
  },
]

export default function AnnouncementsPage() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Announcements</h1>
          <Button><PlusCircle className="mr-2 h-4 w-4"/> Post Announcement</Button>
        </div>

        <div className="space-y-6">
            {announcements.map((post, index) => (
                <Card key={index}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl font-headline">{post.title}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={post.avatar} />
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{post.author}</span>
                                    <span>&bull;</span>
                                    <Badge variant="secondary">{post.group}</Badge>
                                </div>
                            </div>
                            {post.pinned && <Pin className="h-5 w-5 text-primary" />}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{post.content}</p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-xs text-muted-foreground">{post.date}</p>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </main>
    </>
  );
}
