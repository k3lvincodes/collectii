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
            <div className="flex-1 p-4 sm:p-6 max-w-[1600px] mx-auto w-full space-y-6 sm:space-y-8">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Time Tracking</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">Monitor your hours, breaks, and productivity metrics.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 px-3 sm:px-4">
                            <Calendar className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">This Week</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 px-3 sm:px-4">
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline ml-2">Export Report</span>
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="clock" className="space-y-4 sm:space-y-6">
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
                            <TabsTrigger value="clock" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Clock In/Out</TabsTrigger>
                            <TabsTrigger value="timesheet" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Timesheet</TabsTrigger>
                            <TabsTrigger value="stats" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Stats</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="clock" className="space-y-4 sm:space-y-6">
                        <div className="max-w-2xl mx-auto mt-4 sm:mt-10">
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
