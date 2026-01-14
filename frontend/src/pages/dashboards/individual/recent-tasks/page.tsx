import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecentTasksPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Recent Tasks</h1>
                <p className="text-muted-foreground mt-1">
                    View your recently updated tasks
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Task List</CardTitle>
                    <CardDescription>Tasks you've recently worked on</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Recent tasks will appear here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
