import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { PostAnnouncementDialog } from "@/components/post-announcement-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, Pin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOutletContext } from "react-router-dom";

export default function AnnouncementsPage() {
  const { currentContext } = useOutletContext<any>();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (currentContext.type !== 'organization' || !currentContext.orgId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select(`
                *,
                author:profiles(*)
            `)
          .eq('organization_id', currentContext.orgId)
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAnnouncements(data || []);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [currentContext]);

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="container px-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Announcements</h1>
            <PostAnnouncementDialog />
          </div>

          <div className="space-y-6 mt-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No announcements yet.
              </div>
            ) : (
              announcements.map((post: any) => (
                <Card key={post.id} className={post.is_pinned ? "border-primary/50" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-headline">{post.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author?.avatar_url} />
                            <AvatarFallback>{post.author?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <span>{post.author?.full_name}</span>
                          <span>&bull;</span>
                          <Badge variant="secondary">{post.group || 'General'}</Badge>
                        </div>
                      </div>
                      {post.is_pinned && <Pin className="h-5 w-5 text-primary rotate-45" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      {post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : ''}
                    </p>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}

