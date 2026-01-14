import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, MapPin, Loader2 } from "lucide-react";

interface TimeEntry {
    id: string;
    clock_in: string;
    clock_out: string | null;
    status: 'active' | 'completed' | 'paused';
    break_minutes: number;
    location: string | null;
}

export function TimeClockWidget() {
    const [user, setUser] = useState<any>(null);
    const [status, setStatus] = useState<'idle' | 'working' | 'break'>('idle');
    const [seconds, setSeconds] = useState(0);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState('Detecting...');

    const supabase = createClient();

    // Fetch user location via IP (simple approach)
    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                setLocation(`${data.city || 'Unknown'}, ${data.country_name || 'Unknown'}`);
            })
            .catch(() => setLocation('Location unavailable'));
    }, []);

    // Check for active session on load
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUser(user);

            // Check for active time entry
            const { data: activeEntries } = await supabase
                .from('time_entries')
                .select('*')
                .eq('user_id', user.id)
                .in('status', ['active', 'paused'])
                .order('clock_in', { ascending: false })
                .limit(1);

            if (activeEntries && activeEntries.length > 0) {
                const entry = activeEntries[0];
                setActiveEntry(entry);

                // Calculate elapsed time
                const clockIn = new Date(entry.clock_in);
                const now = new Date();
                const elapsedSeconds = Math.floor((now.getTime() - clockIn.getTime()) / 1000);
                setSeconds(elapsedSeconds);

                setStatus(entry.status === 'paused' ? 'break' : 'working');
            }

            setLoading(false);
        };

        init();
    }, []);

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'working') {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleClockIn = async () => {
        if (!user) return;

        const { data: entry, error } = await supabase
            .from('time_entries')
            .insert({
                user_id: user.id,
                clock_in: new Date().toISOString(),
                status: 'active',
                location: location,
            })
            .select()
            .single();

        if (entry) {
            setActiveEntry(entry);
            setStatus('working');
            setSeconds(0);
        }
    };

    const handleClockOut = async () => {
        if (!activeEntry) return;

        await supabase
            .from('time_entries')
            .update({
                clock_out: new Date().toISOString(),
                status: 'completed',
            })
            .eq('id', activeEntry.id);

        setActiveEntry(null);
        setStatus('idle');
        setSeconds(0);
    };

    const handleBreak = async () => {
        if (!activeEntry) return;

        await supabase
            .from('time_entries')
            .update({ status: 'paused' })
            .eq('id', activeEntry.id);

        setStatus('break');
    };

    const handleResume = async () => {
        if (!activeEntry) return;

        await supabase
            .from('time_entries')
            .update({ status: 'active' })
            .eq('id', activeEntry.id);

        setStatus('working');
    };

    if (loading) {
        return (
            <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <CardContent className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="absolute bottom-0 left-0 p-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl" />

            <CardContent className="flex flex-col items-center justify-center py-10 relative z-10 space-y-8">
                <div className="text-center space-y-1">
                    <div className="text-sm font-medium opacity-80 uppercase tracking-widest">
                        {status === 'idle' ? 'Ready to Work' : status === 'working' ? 'Currently Working' : 'On Break'}
                    </div>
                    <div className="text-7xl font-mono font-bold tracking-tighter">
                        {formatTime(seconds)}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs font-medium opacity-70">
                        <MapPin className="h-3 w-3" /> {location}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {status === 'idle' && (
                        <Button
                            size="lg"
                            className="h-14 px-8 bg-white text-indigo-600 hover:bg-white/90 font-bold rounded-full shadow-lg"
                            onClick={handleClockIn}
                        >
                            <Play className="mr-2 h-5 w-5" fill="currentColor" /> Clock In
                        </Button>
                    )}

                    {status === 'working' && (
                        <>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="h-14 px-8 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm font-bold rounded-full border-none"
                                onClick={handleBreak}
                            >
                                <Pause className="mr-2 h-5 w-5" fill="currentColor" /> Take Break
                            </Button>
                            <Button
                                size="lg"
                                className="h-14 px-8 bg-black/40 text-white hover:bg-black/50 backdrop-blur-sm font-bold rounded-full border-0"
                                onClick={handleClockOut}
                            >
                                <Square className="mr-2 h-5 w-5" fill="currentColor" /> Clock Out
                            </Button>
                        </>
                    )}

                    {status === 'break' && (
                        <Button
                            size="lg"
                            className="h-14 px-8 bg-white text-indigo-600 hover:bg-white/90 font-bold rounded-full shadow-lg"
                            onClick={handleResume}
                        >
                            <Play className="mr-2 h-5 w-5" fill="currentColor" /> Resume Work
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
