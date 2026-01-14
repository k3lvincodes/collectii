import { createClient } from '@/lib/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from 'lucide-react';
import { TimeClockWidget } from '@/components/time-tracking/time-clock-widget';
import { TimesheetGrid } from '@/components/time-tracking/timesheet-grid';
import { ProductivityStats } from '@/components/time-tracking/productivity-stats';

export default function TimeTrackingPage() {
    const supabase = createClient();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/sign-in');
            }
        };
        checkUser();
    }, [navigate, supabase.auth]);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background flex flex-col">
            <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full space-y-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
                        <p className="text-muted-foreground">Monitor your hours, breaks, and productivity metrics.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" /> This Week
                        </Button>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="clock" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="clock">Clock In/Out</TabsTrigger>
                        <TabsTrigger value="timesheet">Timesheet</TabsTrigger>
                        <TabsTrigger value="stats">Stats & Productivity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="clock" className="space-y-6">
                        <div className="max-w-2xl mx-auto mt-10">
                            <TimeClockWidget />
                        </div>
                    </TabsContent>

                    <TabsContent value="timesheet" className="space-y-6">
                        <TimesheetGrid />
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-6">
                        <ProductivityStats />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
