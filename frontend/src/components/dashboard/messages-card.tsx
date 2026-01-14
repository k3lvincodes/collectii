import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    name: string;
    message: string;
    avatar: number | string;
}

interface MessagesCardProps {
    title?: string;
    messages?: Message[];
}

export function MessagesCard({
    title = "Messages",
    messages = [
        { name: 'Gin Meoh', message: 'Can you tell me how', avatar: 1 },
        { name: 'Chermia', message: 'Will you review my design?', avatar: 2 },
        { name: 'Jason Mandala', message: 'Hi do, is the plan of famillyy', avatar: 3 },
        { name: 'Charlie Chu', message: 'Welcome designer', avatar: 4 },
    ]
}: MessagesCardProps) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {messages.map((msg, i) => (
                    <div key={i} className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors cursor-pointer">
                        <Avatar className="w-9 h-9">
                            <AvatarImage src={typeof msg.avatar === 'number' ? `https://i.pravatar.cc/150?img=${msg.avatar}` : msg.avatar} />
                            <AvatarFallback>{msg.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{msg.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
