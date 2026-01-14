import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { differenceInDays, format, startOfMonth, endOfMonth, addMonths } from "date-fns";

interface Phase {
    id: string;
    title: string;
    start_date: string | null;
    end_date: string | null;
    status: 'completed' | 'in_progress' | 'pending';
    project_id: string;
    project?: { name: string }[] | null;
}

interface TimelinePhase {
    id: string;
    title: string;
    project: string;
    status: 'completed' | 'in_progress' | 'pending';
    width: number;
    offset: number;
}

export function ProjectTimelineView() {
    const [loading, setLoading] = useState(true);
    const [phases, setPhases] = useState<TimelinePhase[]>([]);
    const supabase = createClient();

    // Calculate 4-month timeline from current month
    const now = new Date();
    const months = [
        startOfMonth(now),
        startOfMonth(addMonths(now, 1)),
        startOfMonth(addMonths(now, 2)),
        startOfMonth(addMonths(now, 3)),
    ];
    const timelineStart = months[0];
    const timelineEnd = endOfMonth(months[3]);
    const totalDays = differenceInDays(timelineEnd, timelineStart);

    useEffect(() => {
        const fetchPhases = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('project_phases')
                .select(`
                    id, title, start_date, end_date, status, project_id,
                    project:projects(name)
                `)
                .order('start_date', { ascending: true });

            if (data) {
                const formatted: TimelinePhase[] = data
                    .filter(p => p.start_date && p.end_date)
                    .map(p => {
                        const start = new Date(p.start_date!);
                        const end = new Date(p.end_date!);

                        // Calculate position and width as percentage of timeline
                        const offsetDays = Math.max(0, differenceInDays(start, timelineStart));
                        const durationDays = Math.max(1, differenceInDays(end, start));

                        const offset = (offsetDays / totalDays) * 100;
                        const width = Math.min((durationDays / totalDays) * 100, 100 - offset);

                        return {
                            id: p.id,
                            title: p.title,
                            project: p.project?.[0]?.name || 'Unknown',
                            status: p.status,
                            width: Math.max(width, 5), // Min 5% width for visibility
                            offset: Math.min(offset, 95),
                        };
                    });
                setPhases(formatted);
            }
            setLoading(false);
        };

        fetchPhases();
    }, []);

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
                <CardTitle>Project Roadmap</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <ScrollArea className="w-full whitespace-nowrap rounded-md border p-4">
                    <div className="flex flex-col gap-6 min-w-[800px]">
                        {/* Timeline Header */}
                        <div className="flex border-b pb-2 text-sm font-medium text-muted-foreground">
                            {months.map((month, i) => (
                                <div key={i} className="w-1/4">{format(month, 'MMMM yyyy')}</div>
                            ))}
                        </div>

                        {/* Timeline Rows */}
                        <div className="space-y-4 relative min-h-[200px]">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex pointer-events-none">
                                <div className="w-1/4 border-r border-dashed border-muted/50" />
                                <div className="w-1/4 border-r border-dashed border-muted/50" />
                                <div className="w-1/4 border-r border-dashed border-muted/50" />
                                <div className="w-1/4" />
                            </div>

                            {phases.length === 0 ? (
                                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                                    No project phases. Create a project and add phases to see the timeline.
                                </div>
                            ) : (
                                phases.map((phase) => (
                                    <div key={phase.id} className="relative z-10 grid grid-cols-1">
                                        <div
                                            className="h-8 rounded flex items-center px-3 text-xs font-semibold text-white shadow-sm"
                                            style={{
                                                marginLeft: `${phase.offset}%`,
                                                width: `${phase.width}%`,
                                                backgroundColor:
                                                    phase.status === 'completed' ? '#22c55e' :
                                                        phase.status === 'in_progress' ? '#3b82f6' : '#94a3b8'
                                            }}
                                        >
                                            <span className="truncate">{phase.title}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500" /> Completed</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500" /> In Progress</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400" /> Pending</div>
                </div>
            </CardContent>
        </Card>
    );
}
