import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

interface Task {
    title: string;
    team: string; // e.g. "www.ui.com"
    comments: number;
    progress: number;
    color: string; // "bg-purple-500", etc.
    initial?: string; // "U"
}

interface TaskListProps {
    title?: string;
    tasks?: Task[];
}

export function TaskList({
    title = "Tasks",
    tasks = [
        { title: 'Search inspiration for project', team: 'www.ui.com', comments: 8, progress: 25, color: 'bg-purple-500', initial: 'U' },
        { title: 'Search inspiration for project', team: 'www.ui.com', comments: 8, progress: 60, color: 'bg-blue-500', initial: 'U' },
    ]
}: TaskListProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`w-10 h-10 rounded-full ${task.color} flex items-center justify-center text-white font-semibold text-sm`}>
                            {task.initial || task.title[0]}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium">{task.title}</h4>
                                <span className="text-xs font-semibold text-primary">{task.progress}% complete</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                <span>{task.team}</span>
                                <span className="flex items-center gap-1">
                                    <span>💬</span> {task.comments} comments
                                </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                    className={`h-full rounded-full ${task.color}`}
                                    style={{ width: `${task.progress}%` }}
                                />
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            Reminder
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
