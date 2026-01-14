import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Clock, Calendar, TrendingUp, Coffee } from "lucide-react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

interface Stats {
    todayHours: number;
    weekHours: number;
    monthHours: number;
    avgDailyHours: number;
    totalSessions: number;
}

export function ProductivityStats() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        todayHours: 0,
        weekHours: 0,
        monthHours: 0,
        avgDailyHours: 0,
        totalSessions: 0,
    });
    const supabase = createClient();

    useEffect(() => {
        const fetchStats = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
            const weekStart = startOfWeek(now, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
            const monthStart = startOfMonth(now);
            const monthEnd = endOfMonth(now);

            // Fetch all entries for this month
            const { data: entries } = await supabase
                .from('time_entries')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'completed')
                .gte('clock_in', monthStart.toISOString())
                .lte('clock_in', monthEnd.toISOString());

            if (!entries) {
                setLoading(false);
                return;
            }

            const calculateHours = (entryList: any[]) => {
                let totalMinutes = 0;
                entryList.forEach(entry => {
                    if (entry.clock_in && entry.clock_out) {
                        const start = new Date(entry.clock_in);
                        const end = new Date(entry.clock_out);
                        totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
                        totalMinutes -= entry.break_minutes || 0;
                    }
                });
                return Math.round(totalMinutes / 60 * 10) / 10;
            };

            // Today's entries
            const todayEntries = entries.filter(e => {
                const clockIn = new Date(e.clock_in);
                return clockIn >= todayStart && clockIn < todayEnd;
            });

            // This week's entries
            const weekEntries = entries.filter(e => {
                const clockIn = new Date(e.clock_in);
                return clockIn >= weekStart && clockIn <= weekEnd;
            });

            // Calculate unique working days this month
            const workingDays = new Set(entries.map(e =>
                new Date(e.clock_in).toDateString()
            )).size;

            const monthHours = calculateHours(entries);

            setStats({
                todayHours: calculateHours(todayEntries),
                weekHours: calculateHours(weekEntries),
                monthHours: monthHours,
                avgDailyHours: workingDays > 0 ? Math.round(monthHours / workingDays * 10) / 10 : 0,
                totalSessions: entries.length,
            });

            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    const statCards = [
        { title: "Today's Hours", value: `${stats.todayHours}h`, icon: Clock, color: "text-blue-500" },
        { title: "This Week", value: `${stats.weekHours}h`, icon: Calendar, color: "text-green-500" },
        { title: "This Month", value: `${stats.monthHours}h`, icon: TrendingUp, color: "text-purple-500" },
        { title: "Avg Daily", value: `${stats.avgDailyHours}h`, icon: Coffee, color: "text-amber-500" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, idx) => (
                    <Card key={idx}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Productivity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Total Sessions This Month</span>
                            <span className="font-bold">{stats.totalSessions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Average Session Length</span>
                            <span className="font-bold">
                                {stats.totalSessions > 0
                                    ? `${Math.round(stats.monthHours / stats.totalSessions * 10) / 10}h`
                                    : '0h'
                                }
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Days Worked This Month</span>
                            <span className="font-bold">
                                {stats.monthHours > 0
                                    ? Math.round(stats.monthHours / stats.avgDailyHours) || 0
                                    : 0
                                }
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
