import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, LogIn, LogOut, Timer, Calendar } from "lucide-react";
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
    shortDay: string;
    dateFormatted: string;
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
                    shortDay: format(day, 'EEE'),
                    dateFormatted: format(day, 'MMM d'),
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500 text-white';
            case 'completed':
                return 'bg-primary';
            case 'paused':
                return 'bg-amber-500 text-white';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 sm:p-12">
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 pb-3 sm:pb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <CardTitle className="text-base sm:text-xl">This Week's Timesheet</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-0">
                {weekDays.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                        <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground text-sm sm:text-base">No activity recorded this week.</p>
                        <p className="text-muted-foreground/70 text-xs sm:text-sm mt-1">Clock in to start tracking your time.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View - Enhanced */}
                        <div className="block sm:hidden space-y-3">
                            {weekDays.map((day) => (
                                <div
                                    key={day.dayName}
                                    className="bg-gradient-to-br from-muted/60 to-muted/30 rounded-xl overflow-hidden border border-border/50"
                                >
                                    {/* Day Header */}
                                    <div className="bg-gradient-to-r from-primary/10 to-transparent px-4 py-3 flex items-center justify-between border-b border-border/30">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                                                <span className="text-xs font-bold text-primary">{day.shortDay}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{day.dayName}</p>
                                                <p className="text-xs text-muted-foreground">{day.dateFormatted}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-primary">{day.totalHours}h</p>
                                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
                                        </div>
                                    </div>

                                    {/* Entries */}
                                    <div className="p-3 space-y-2">
                                        {day.entries.map((entry, idx) => (
                                            <div
                                                key={entry.id}
                                                className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border/40 shadow-sm"
                                            >
                                                {/* Entry Header with Status */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs text-muted-foreground">Session {idx + 1}</span>
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-[10px] uppercase tracking-wide px-2 py-0.5 ${getStatusColor(entry.status)}`}
                                                    >
                                                        {entry.status}
                                                    </Badge>
                                                </div>

                                                {/* Time Grid */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* Clock In */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                            <LogIn className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">In</p>
                                                            <p className="text-sm font-semibold">{format(new Date(entry.clock_in), 'h:mm a')}</p>
                                                        </div>
                                                    </div>

                                                    {/* Clock Out */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                                            <LogOut className="h-4 w-4 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Out</p>
                                                            <p className="text-sm font-semibold">
                                                                {entry.clock_out ? format(new Date(entry.clock_out), 'h:mm a') : '---'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Duration Footer */}
                                                <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                                        <Timer className="h-3.5 w-3.5" />
                                                        <span className="text-xs">Duration</span>
                                                    </div>
                                                    <span className={`text-sm font-medium ${entry.status === 'active' ? 'text-green-600' : ''}`}>
                                                        {formatDuration(entry)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block">
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
                                    {weekDays.map((day) => (
                                        day.entries.map((entry, idx) => (
                                            <TableRow key={entry.id}>
                                                <TableCell className="font-medium">
                                                    {idx === 0 ? (
                                                        <div>
                                                            <p>{day.dayName}</p>
                                                            <p className="text-xs text-muted-foreground">{day.dateFormatted}</p>
                                                        </div>
                                                    ) : ''}
                                                </TableCell>
                                                <TableCell>{format(new Date(entry.clock_in), 'h:mm a')}</TableCell>
                                                <TableCell>
                                                    {entry.clock_out ? format(new Date(entry.clock_out), 'h:mm a') : '-'}
                                                </TableCell>
                                                <TableCell>{formatDuration(entry)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={getStatusColor(entry.status)}
                                                    >
                                                        {entry.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {idx === 0 ? `${day.totalHours}h` : ''}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
