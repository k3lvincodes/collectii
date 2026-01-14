"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, MoreHorizontal, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityEvent {
    id: string;
    type: 'comment' | 'file' | 'alert' | 'status';
    content: string;
    time: string;
    user?: {
        name: string;
        initials: string;
    };
    project?: string;
}

interface ActivityTimelineProps {
    events: ActivityEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
    return (
        <Card className="border-none shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] bg-white rounded-[32px] h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-8">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2.5 rounded-xl">
                        {/* Activity Pulse Icon */}
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-100" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Activity Timeline</CardTitle>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-2 flex-1">
                {/*  Timeline Feed */}
                <div className="space-y-6 relative ml-2">
                    {/* Connector Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-100" />

                    {/* Hardcoded for visual match but using specific Work Events */}
                    {[
                        { type: 'comment', user: 'Project Manager', action: 'commented on', target: 'Task A', time: '10m ago' },
                        { type: 'file', user: 'Alex', action: 'uploaded file', target: 'Design_V2.pdf', time: '1h ago' },
                        { type: 'alert', user: 'System', action: 'Performance Score', target: 'updated', time: '2h ago' },
                        { type: 'task', user: 'You', action: 'completed', target: 'Onboarding Flow', time: '4h ago' },
                    ].map((event, i) => (
                        <div key={i} className="flex items-start gap-4 relative z-10 group cursor-pointer">
                            <div className={cn(
                                "h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0",
                                i === 0 ? "bg-blue-100 text-blue-600" :
                                    i === 1 ? "bg-orange-100 text-orange-600" :
                                        i === 2 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                            )}>
                                {i === 0 && <MessageSquare className="h-4 w-4" />}
                                {i === 1 && <span className="font-bold text-xs">PDF</span>}
                                {i === 2 && <span className="font-bold text-xs">!</span>}
                                {i === 3 && <span className="font-bold text-xs">✓</span>}
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none w-full hover:bg-slate-100 transition-colors">
                                <p className="text-sm text-gray-900 leading-snug">
                                    <span className="font-semibold">{event.user}</span> {event.action} <span className="font-medium text-slate-700">{event.target}</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1 font-medium">{event.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
