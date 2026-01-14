import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

interface TimeEntry {
    id: string;
    clock_in: string;
    clock_out: string | null;
    status: 'active' | 'completed' | 'paused';
    break_minutes: number;
}

interface DayEntry {
    date: Date;
    dayName: string;
    entries: TimeEntry[];
    totalHours: number;
}

export function TimesheetGrid() {
    const [loading, setLoading] = useState(true);
    const [weekDays, setWeekDays] = useState<DayEntry[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchTimesheet = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const now = new Date();
            const weekStart = startOfWeek(now, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

            const { data: entries } = await supabase
                .from('time_entries')
                .select('*')
                .eq('user_id', user.id)
                .gte('clock_in', weekStart.toISOString())
                .lte('clock_in', weekEnd.toISOString())
                .order('clock_in', { ascending: true });

            const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

            const dayEntries: DayEntry[] = days.map(day => {
                const dayData = entries?.filter(e => isSameDay(new Date(e.clock_in), day)) || [];

                // Calculate total hours
                let totalMinutes = 0;
                dayData.forEach(entry => {
                    if (entry.clock_in && entry.clock_out) {
                        const start = new Date(entry.clock_in);
                        const end = new Date(entry.clock_out);
                        totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
                        totalMinutes -= entry.break_minutes || 0;
                    }
                });

                return {
                    date: day,
                    dayName: format(day, 'EEEE'),
                    entries: dayData,
                    totalHours: Math.round(totalMinutes / 60 * 10) / 10,
                };
            }).filter(day => day.entries.length > 0);

            setWeekDays(dayEntries);
            setLoading(false);
        };

        fetchTimesheet();
    }, []);

    const formatDuration = (entry: TimeEntry) => {
        if (!entry.clock_out) return 'In Progress';
        const start = new Date(entry.clock_in);
        const end = new Date(entry.clock_out);
        const mins = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}h ${remainingMins}m`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0">
                <CardTitle>This Week's Timesheet</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Day</TableHead>
                            <TableHead>Clock In</TableHead>
                            <TableHead>Clock Out</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total Hours</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {weekDays.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No activity recorded this week.
                                </TableCell>
                            </TableRow>
                        ) : (
                            weekDays.map((day) => (
                                day.entries.map((entry, idx) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="font-medium">
                                            {idx === 0 ? day.dayName : ''}
                                        </TableCell>
                                        <TableCell>{format(new Date(entry.clock_in), 'h:mm a')}</TableCell>
                                        <TableCell>
                                            {entry.clock_out ? format(new Date(entry.clock_out), 'h:mm a') : '-'}
                                        </TableCell>
                                        <TableCell>{formatDuration(entry)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={entry.status === 'completed' ? 'default' : 'secondary'}
                                                className={entry.status === 'active' ? 'bg-green-500' : ''}
                                            >
                                                {entry.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {idx === 0 ? `${day.totalHours}h` : ''}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
