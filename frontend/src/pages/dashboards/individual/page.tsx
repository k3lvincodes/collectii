
import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    ListTodo,
    TrendingUp,
    Activity,
    PlusCircle,
    Clock,
    CheckCircle2,
    CalendarDays,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { CreateTaskModal } from "@/components/modals/CreateTaskModal";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";

interface Task {
    id: string;
    title: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
    status: string;
    organization?: { name: string };
    team?: { name: string };
}

export default function IndividualDashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    // Metrics
    const [stats, setStats] = useState({
        performance: 92, // Default/Mock for now as complex calc required
        tasksDueToday: 0,
        highPriorityDue: 0,
        completedThisWeek: 0,
        activeProjects: 0, // Teams
        pendingReviewProjects: 0
    });

    const [criticalTasks, setCriticalTasks] = useState<Task[]>([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                setUser(user);

                const today = new Date().toISOString().split('T')[0];
                const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

                // Execute all queries in parallel
                const [
                    { data: dueTodayTasks },
                    { count: completedCount },
                    { count: activeTeamsCount },
                    { data: criticalData },
                    { data: profileData },
                    { data: noteData }
                ] = await Promise.all([
                    // 1. Tasks Due Today
                    supabase
                        .from('tasks')
                        .select('id, priority, status, deadline')
                        .eq('assignee_id', user.id)
                        .neq('status', 'done')
                        .gte('deadline', `${today}T00:00:00`)
                        .lte('deadline', `${today}T23:59:59`),

                    // 2. Completed This Week
                    supabase
                        .from('tasks')
                        .select('id', { count: 'exact', head: true })
                        .eq('assignee_id', user.id)
                        .eq('status', 'done')
                        .gte('updated_at', lastWeek),

                    // 3. Active Projects
                    supabase
                        .from('projects')
                        .select('id', { count: 'exact', head: true })
                        .eq('status', 'active'),

                    // 4. Critical Tasks
                    supabase
                        .from('tasks')
                        .select(`
                            id, title, deadline, priority, status, description, deliverables, organization_id,
                            organization:custom_organizations(name),
                            team:teams(name)
                        `)
                        .eq('assignee_id', user.id)
                        .neq('status', 'done')
                        .in('priority', ['high', 'medium'])
                        .order('deadline', { ascending: true })
                        .limit(5),

                    // 5. Score
                    supabase
                        .from('profiles')
                        .select('score')
                        .eq('id', user.id)
                        .maybeSingle(),

                    // 6. Note
                    supabase
                        .from('notes')
                        .select('content')
                        .eq('user_id', user.id)
                        .maybeSingle()
                ]);

                if (noteData) {
                    setNote(noteData.content || '');
                }

                // Calc Stats
                const tasksDue = dueTodayTasks?.length || 0;
                const highPri = dueTodayTasks?.filter(t => t.priority === 'high').length || 0;

                setStats({
                    performance: profileData?.score || 0,
                    tasksDueToday: tasksDue,
                    highPriorityDue: highPri,
                    completedThisWeek: completedCount || 0,
                    activeProjects: activeTeamsCount || 0,
                    pendingReviewProjects: 0
                });

                if (criticalData) {
                    // @ts-ignore
                    setCriticalTasks(criticalData);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleSaveNote = async () => {
        if (!user) return;
        setSavingNote(true);

        // Upsert note
        const { error } = await supabase
            .from('notes')
            .upsert({ user_id: user.id, content: note, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });

        setSavingNote(false);
    };

    const getPriorityColor = (p: string) => {
        if (p === 'high') return 'text-red-500';
        if (p === 'medium') return 'text-amber-500';
        return 'text-blue-500';
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Account Overview</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Today
                    </Button>
                    <Button size="sm" onClick={() => setIsTaskModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.performance}/100</div>
                        <p className="text-xs text-green-500 flex items-center">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            +{stats.completedThisWeek} pts this week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks Due Today</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tasksDueToday}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.highPriorityDue} High Priority
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedThisWeek}</div>
                        <p className="text-xs text-muted-foreground">
                            On track for weekly goal
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.pendingReviewProjects} pending review
                        </p>
                    </CardContent>
                </Card>
            </div>


            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {/* Critical Task Stream */}
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Critical Tasks</CardTitle>
                        <CardDescription>High and Medium priority items requiring your attention.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {criticalTasks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No critical tasks pending.</p>
                            ) : (
                                criticalTasks.map((task, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => setCriticalTasks(prev => prev.map(t => t.id === task.id ? task : t))} // Mock update or just select
                                    >
                                        <div
                                            className="flex-1 flex items-center justify-between"
                                            onClick={() => setSelectedTask(task)}
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium leading-none">{task.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {task.team?.name || task.organization?.name || 'Personal'} • Due {task.deadline ? format(new Date(task.deadline), 'MMM d, h:mm a') : 'No Date'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold uppercase ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Notes / Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Type your notes here..."
                                className="min-h-[200px] resize-none"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <Button
                                className="w-full"
                                variant="secondary"
                                onClick={handleSaveNote}
                                disabled={savingNote}
                            >
                                {savingNote ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Note
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>


            <CreateTaskModal
                open={isTaskModalOpen}
                userId={user?.id}
                contextType="personal"
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={() => {
                    setIsTaskModalOpen(false);
                    // Optionally refresh dashboard data here
                    // fetchDashboardData(); 
                }}
            />

            <TaskDetailModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                onTaskUpdate={() => {
                    // Refresh data nicely would be good here, for now force reload or trigger fetch
                    // window.location.reload(); 
                    // Ideally we extract fetchDashboardData to be reusable
                    setSelectedTask(null);
                }}
            />
        </main >
    );
}
