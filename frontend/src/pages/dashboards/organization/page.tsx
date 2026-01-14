
import { AppHeader } from "@/components/app-header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Label,
} from 'recharts';
import {
    ListTodo,
    Bell,
    BarChart3,
    Activity,
    UsersRound,
    Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOutletContext } from "react-router-dom";
import { format, subDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";

export default function OrganizationDashboardPage() {
    const { currentContext } = useOutletContext<any>();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTasks: 0,
        activeTeams: 0,
        overdueTasks: 0,
        completionRate: 0,
    });
    const [taskStatusData, setTaskStatusData] = useState<any[]>([]);
    const [taskProgressData, setTaskProgressData] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            if (currentContext.type !== 'organization' || !currentContext.orgId) return;

            setLoading(true);
            try {
                const orgId = currentContext.orgId;

                // 1. Fetch Tasks
                const { data: tasks, error: taskError } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('organization_id', orgId);

                if (taskError) throw taskError;

                // 2. Fetch Teams count
                const { count: teamCount, error: teamError } = await supabase
                    .from('teams')
                    .select('*', { count: 'exact', head: true })
                    .eq('organization_id', orgId);

                if (teamError) throw teamError;

                // --- Process Stats ---
                const totalTasks = tasks?.length || 0;
                const overdueTasks = tasks?.filter(t => t.status !== 'done' && t.deadline && new Date(t.deadline) < new Date()).length || 0;
                const completedTasks = tasks?.filter(t => t.status === 'done').length || 0;
                const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                setStats({
                    totalTasks,
                    activeTeams: teamCount || 0,
                    overdueTasks,
                    completionRate: Math.round(completionRate * 10) / 10
                });

                // --- Process Status Data ---
                const statusCounts = {
                    done: completedTasks,
                    in_progress: tasks?.filter(t => t.status === 'in_progress').length || 0,
                    todo: tasks?.filter(t => t.status === 'todo').length || 0,
                    review: tasks?.filter(t => t.status === 'review').length || 0,
                };

                setTaskStatusData([
                    { name: 'Completed', value: statusCounts.done, color: 'hsl(var(--chart-2))' },
                    { name: 'In Progress', value: statusCounts.in_progress, color: 'hsl(var(--chart-4))' },
                    { name: 'To Do', value: statusCounts.todo, color: 'hsl(var(--chart-1))' },
                    { name: 'Review', value: statusCounts.review, color: 'hsl(var(--chart-5))' },
                ]);

                // --- Process Weekly Progress ---
                const now = new Date();
                const weekStart = startOfWeek(now, { weekStartsOn: 1 });
                const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
                const days = [0, 1, 2, 3, 4, 5, 6].map(offset => {
                    const date = new Date(weekStart);
                    date.setDate(date.getDate() + offset);
                    return date;
                });

                const progressData = days.map(day => ({
                    name: format(day, 'EEE'),
                    tasks: tasks?.filter(t => t.status === 'done' && t.completed_at && isSameDay(new Date(t.completed_at), day)).length || 0
                }));
                setTaskProgressData(progressData);

                // --- Process Recent Activity (Last 5 updated/created tasks) ---
                const activity = tasks
                    ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                    .slice(0, 5)
                    .map(t => ({
                        id: t.id,
                        action: t.status === 'done' ? 'completed task' : 'updated task',
                        item: t.title,
                        time: format(new Date(t.updated_at), 'MMM d, h:mm a')
                    })) || [];
                setRecentActivity(activity);

            } catch (error) {
                console.error("Error fetching org dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentContext]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="container px-0 space-y-6">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Organization Overview</h1>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Tasks
                            </CardTitle>
                            <ListTodo className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTasks}</div>
                            <p className="text-xs text-muted-foreground">
                                All time
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Teams
                            </CardTitle>
                            <UsersRound className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeTeams}</div>
                            <p className="text-xs text-muted-foreground">
                                Departments & Groups
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                            <Bell className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overdueTasks}</div>
                            <p className="text-xs text-muted-foreground">
                                Requires attention
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completion Rate
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completionRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Of total tasks
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <CardHeader>
                            <CardTitle>Tasks Completed This Week</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={taskProgressData}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--background) / 0.8)', border: '1px solid hsl(var(--border))', backdropFilter: 'blur(4px)' }} />
                                    <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest updates across tasks.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <div className="flex items-start gap-4" key={index}>
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted shrink-0">
                                            <Activity className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.action} <span className="font-semibold text-primary">"{activity.item}"</span>
                                            </p>
                                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">No recent activity</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Status Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={taskStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        innerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        paddingAngle={5}
                                    >
                                        {taskStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} className="stroke-background" />
                                        ))}
                                        <Label
                                            value={`${stats.totalTasks > 0 ? ((stats.completionRate)).toFixed(0) : 0}%`}
                                            position="center"
                                            fill="hsl(var(--foreground))"
                                            className="text-2xl font-bold"
                                        />
                                        <Label value="Done" position="center" dy={20} fill="hsl(var(--muted-foreground))" className="text-sm" />
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background) / 0.8)', border: '1px solid hsl(var(--border))', backdropFilter: 'blur(4px)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
