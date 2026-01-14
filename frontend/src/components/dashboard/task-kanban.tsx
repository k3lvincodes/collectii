import { MoreHorizontal, Plus, MessageSquare, Paperclip, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface KanbanTask {
    id: string;
    title: string;
    description: string;
    tag: string;
    tagColor: string; // e.g. "bg-blue-500"
    date: string;
    comments: number;
    attachments?: number;
    completedSubtasks?: number;
    totalSubtasks?: number;
    assignees: string[];
    image?: string;
}

interface KanbanColumn {
    id: string;
    title: string;
    tasks: KanbanTask[];
}

const defaultData: KanbanColumn[] = [
    {
        id: 'backlog',
        title: 'Backlog',
        tasks: [
            {
                id: '1',
                title: 'Create styleguide foundation',
                description: 'Create content for peceland App',
                tag: 'Design',
                tagColor: 'bg-blue-600',
                date: 'Aug 20, 2024',
                comments: 3,
                assignees: ['1', '2'],
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
            },
            {
                id: '2',
                title: 'Copywriting Content',
                description: 'Create content for peceland App',
                tag: 'Research',
                tagColor: 'bg-sky-500',
                date: 'Aug 20, 2024',
                comments: 1,
                assignees: ['3', '1'],
            },
            {
                id: '3',
                title: 'Update requirment list',
                description: 'Create content for peceland App',
                tag: 'Planning',
                tagColor: 'bg-orange-500',
                date: 'Sep 20, 2024',
                comments: 4,
                attachments: 2,
                assignees: ['2', '4'],
            }
        ]
    },
    {
        id: 'todo',
        title: 'To Do',
        tasks: [
            {
                id: '4',
                title: 'Auditing information architecture',
                description: 'Create content for peceland App',
                tag: 'Research',
                tagColor: 'bg-sky-500',
                date: 'Aug 20, 2021',
                comments: 0,
                completedSubtasks: 0,
                totalSubtasks: 8,
                assignees: ['1'],
            },
            {
                id: '5',
                title: 'Update support documentation',
                description: 'Create content for peceland App',
                tag: 'Content',
                tagColor: 'bg-yellow-500',
                date: 'Aug 18, 2024',
                comments: 0,
                completedSubtasks: 0,
                totalSubtasks: 2,
                assignees: ['2', '3'],
                image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop'
            },
            {
                id: '6',
                title: 'Qualitative research planning',
                description: 'Create content for peceland App',
                tag: 'Research',
                tagColor: 'bg-sky-500',
                date: 'Aug 20, 2024',
                comments: 0,
                completedSubtasks: 0,
                totalSubtasks: 8,
                assignees: ['5', '1'],
            }
        ]
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        tasks: [
            {
                id: '7',
                title: 'Listing deliverables checklist',
                description: 'Create content for peceland App',
                tag: 'Planning',
                tagColor: 'bg-orange-500',
                date: 'Sep 20, 2024',
                comments: 4,
                attachments: 1,
                assignees: ['4'],
            },
            {
                id: '8',
                title: 'Qualitative research planning',
                description: 'Create content for peceland App',
                tag: 'Research',
                tagColor: 'bg-sky-500',
                date: 'Aug 20, 2021',
                comments: 0,
                completedSubtasks: 0,
                totalSubtasks: 3,
                assignees: ['2', '3'],
            },
            {
                id: '9',
                title: 'Copywriting Content',
                description: 'Create content for peceland App',
                tag: 'Design',
                tagColor: 'bg-blue-600',
                date: 'Aug 22, 2024',
                comments: 0,
                completedSubtasks: 12,
                totalSubtasks: 12,
                assignees: ['1', '3', '4'],
                image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2670&auto=format&fit=crop'
            }
        ]
    },
    {
        id: 'review',
        title: 'Review',
        tasks: [
            {
                id: '10',
                title: 'Design System',
                description: 'Create content for peceland App',
                tag: 'Content',
                tagColor: 'bg-yellow-500',
                date: 'Aug 16, 2024',
                comments: 0,
                completedSubtasks: 0,
                totalSubtasks: 5,
                assignees: ['1', '2'],
                image: 'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?q=80&w=2670&auto=format&fit=crop'
            },
            {
                id: '11',
                title: 'High fidelity UI Desktop',
                description: 'Create content for peceland App',
                tag: 'Design',
                tagColor: 'bg-blue-600',
                date: 'Aug 30, 2024',
                comments: 0,
                completedSubtasks: 0,
                totalSubtasks: 8,
                assignees: ['3', '5'],
            },
            {
                id: '12',
                title: 'Listing deliverables checklist',
                description: 'Create content for peceland App',
                tag: 'Content',
                tagColor: 'bg-yellow-500',
                date: 'Sep 20, 2024',
                comments: 6,
                attachments: 1,
                assignees: ['2', '4'],
            }
        ]
    }
];

export function TaskKanban() {
    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <h2 className="text-2xl font-bold">Task</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Avatar key={i} className="w-8 h-8 border-2 border-background">
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                                <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium border-2 border-background">
                            +6
                        </div>
                    </div>
                    <Button size="icon" variant="outline" className="rounded-full w-8 h-8">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex gap-6 pb-4">
                    {defaultData.map((column) => (
                        <div key={column.id} className="w-[300px] shrink-0 space-y-4">
                            <div className="flex items-center justify-between bg-white dark:bg-card p-3 rounded-xl shadow-sm">
                                <span className="font-semibold text-sm">{column.title}</span>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {column.tasks.map((task) => (
                                    <div key={task.id} className="bg-white dark:bg-card p-4 rounded-xl shadow-sm space-y-3 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-blue-100">
                                        <div className="flex justify-between items-start">
                                            <Badge className={`${task.tagColor} text-white hover:${task.tagColor} border-0 rounded-md px-2 py-0.5 text-[10px]`}>
                                                {task.tag}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2">
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </div>

                                        {task.image && (
                                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                                                <img src={task.image} alt={task.title} className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="font-semibold text-sm line-clamp-2 leading-snug mb-1">{task.title}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                                        </div>

                                        <div className="flex items-center text-xs text-muted-foreground font-medium">
                                            <Calendar className="h-3 w-3 mr-1.5" />
                                            {task.date}
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-dashed">
                                            <div className="flex -space-x-1.5">
                                                {task.assignees.map((assignee, i) => (
                                                    <Avatar key={i} className="w-6 h-6 border-[1.5px] border-background">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?img=${parseInt(assignee) + 20}`} />
                                                        <AvatarFallback>{assignee}</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                {(task.completedSubtasks !== undefined) && (
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        <span>{task.completedSubtasks}/{task.totalSubtasks}</span>
                                                    </div>
                                                )}
                                                {(task.attachments) && (
                                                    <div className="flex items-center gap-1">
                                                        <Paperclip className="h-3 w-3" />
                                                        <span>{task.attachments}k</span>
                                                    </div>
                                                )}
                                                {(task.comments > 0) && (
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare className="h-3 w-3" />
                                                        <span>{task.comments} Comments</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
