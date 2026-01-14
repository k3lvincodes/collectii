import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';

interface ScheduleCardProps {
    title?: string;
    itemTitle?: string;
    time?: string;
}

export function ScheduleCard({
    title = "Today's Schedule",
    itemTitle = "Project Discovery Call",
    time = "09:00 - 10:30 AM"
}: ScheduleCardProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Calendar className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-4 text-white shadow-md shadow-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{itemTitle}</span>
                        <Button size="sm" className="h-7 bg-white/20 hover:bg-white/30 text-white border-0">
                            + Invite
                        </Button>
                    </div>
                    <p className="text-xs opacity-90 mb-3">{time}</p>
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Avatar key={i} className="w-7 h-7 border-2 border-white">
                                <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
                                <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">
                    View All
                </Button>
            </CardContent>
        </Card>
    );
}
