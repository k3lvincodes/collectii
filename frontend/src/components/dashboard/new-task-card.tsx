import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

export function NewTaskCard() {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <input
                    type="text"
                    placeholder="Task Title"
                    className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-2">
                    {['😊', '😎', '😍', '🤩', '😜', '🥳'].map((emoji, i) => (
                        <button
                            key={i}
                            className="flex-1 aspect-square rounded-lg hover:bg-muted transition-colors text-lg flex items-center justify-center p-0"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-muted-foreground">
                    Add Collaborators
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        <Avatar className="w-7 h-7 border-2 border-background">
                            <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                            <AvatarFallback>F1</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-7 h-7 border-2 border-background">
                            <AvatarImage src="https://i.pravatar.cc/150?img=2" />
                            <AvatarFallback>M1</AvatarFallback>
                        </Avatar>
                    </div>
                    <Button size="icon" variant="outline" className="h-7 w-7 rounded-full">
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                </Button>
            </CardContent>
        </Card>
    );
}
