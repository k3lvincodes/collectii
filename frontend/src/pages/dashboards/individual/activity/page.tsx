import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivityTimelinePage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Activity Timeline</h1>
                <p className="text-muted-foreground mt-1">
                    A chronological view of all your activities
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                    <CardDescription>Your recent activity across all projects</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Activity timeline will appear here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
