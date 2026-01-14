import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Paperclip, MessageSquare, CheckSquare, User, Flag, Calendar, Trash2, Edit } from "lucide-react";
import { DeadlineExtensionModal } from "../modals/DeadlineExtensionModal";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface TaskDetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
    onTaskUpdate?: () => void;
}

export function TaskDetailDrawer({ isOpen, onClose, task, onTaskUpdate }: TaskDetailDrawerProps) {
    const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
    const supabase = createClient();
    const { toast } = useToast();

    console.log('TaskDetailDrawer Render:', { isOpen, taskId: task?.id });

    if (!task) return null;

    const isPersonal = !task.organization_id;

    const handleUpdateStatus = async (status: string) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/tasks/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            toast({ title: status === 'done' ? "Task completed" : "Task dismissed" });
            onTaskUpdate?.();
            onClose();
        } else {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    };

    const handleExtendDeadline = async (date: string, reason?: string) => {
        const body: any = { deadline: new Date(date).toISOString() };
        if (reason) {
            body.extension_reason = reason;
            body.extension_requested_at = new Date().toISOString();
        }

        // If organization task, maybe just request extension (handled normally via backend logic or separate endpoint?)
        // For now updating deadline directly if allowed or adding request fields
        // Backend handles permission, but for 'Request', we might just want to update request fields without changing deadline?
        // Simplicity: updates task with new deadline (if personal) OR updates request fields (if org & user not admin?)
        // Let's assume updating deadline directly for personal, and for org we update extension request fields
        // BUT current backend implementation of PATCH /tasks/:id updates whatever fields we send.
        // If it's an extension REQUEST, we probably shouldn't update the deadline yet.

        if (!isPersonal) {
            // It's a request
            // We'll update the request fields, but NOT the deadline itself yet?
            // Or update deadline if user has permission.
            // Requirement: "request a deadline extension for organization-assigned tasks"
            // So we should populate extension_requested_at and extension_reason, but maybe NOT deadline?
            // Let's look at the body construction. 
            // I'll send deadline + reason. Backend *should* decide? 
            // Or I'll just send reason and requested deadline (as extension_requested_at/reason).
            // Wait, I need a place to store the *requested* deadline if I don't update the actual one.
            // I didn't add `requested_deadline` column.
            // I'll update the ACTUAL deadline for now for simplicity unless I add another column.
            // Actually, "request" implies approval. 
            // Updating the actual deadline immediately is "taking" not "requesting".
            // I'll assume for this iteration that "requesting" updates the task with the reason, acts as a "request" in the UI (e.g. shows "Extension Requested").
            // So I will update `extension_reason` and `extension_requested_at`. I will NOT update `deadline` until approved.
            // BUT I need to store the date they asked for!
            // I'll store extension details in `description` or `extension_reason` as "Requested date: YYYY-MM-DD. Reason: ..."

            body.extension_reason = `Requested new deadline: ${date}. Reason: ${reason}`;
            delete body.deadline; // Don't change actual deadline
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/tasks/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            toast({ title: isPersonal ? "Deadline updated" : "Extension requested" });
            onTaskUpdate?.();
            onClose(); // Optional: close drawer or keep open
        } else {
            toast({ title: "Failed to update", variant: "destructive" });
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-xl w-full flex flex-col h-full bg-background" side="right">
                <SheetHeader className="space-y-4 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{task.project || "No Project"}</Badge>
                                <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'}>
                                    {task.priority || "Normal"}
                                </Badge>
                            </div>
                            <SheetTitle className="text-xl font-bold leading-normal">{task.title}</SheetTitle>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due {task.dueDate || "No Date"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>Assigned to You</span>
                        </div>
                    </div>
                </SheetHeader>

                <Separator />

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="space-y-6 py-6">

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-base">Description</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {task.description || "No description provided."}
                            </p>
                        </div>

                        {/* Checklists */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-base">Deliverables</h3>
                                <span className="text-xs text-muted-foreground">0/3 Completed</span>
                            </div>
                            <div className="space-y-2">
                                {['Research competitors', 'Draft initial layout in Figma', 'Review with design lead'].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attachments */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-base">Attachments</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center text-blue-600">
                                        <Paperclip className="h-4 w-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-medium truncate">specs_v2.pdf</p>
                                        <p className="text-[10px] text-muted-foreground">2.4 MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-base">Activity & Comments</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <span className="text-sm font-semibold">Sarah Lead</span>
                                            <span className="text-xs text-muted-foreground">2h ago</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Can you check the new requirements? I added a file.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollArea>

                <div className="pt-4 border-t mt-auto space-y-3">
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsExtensionModalOpen(true)}>
                            {isPersonal ? 'Extend Deadline' : 'Request Extension'}
                        </Button>
                        <Button variant="outline" className="text-muted-foreground hover:text-destructive" onClick={() => handleUpdateStatus('dismissed')}>
                            Dismiss
                        </Button>
                        <Button onClick={() => handleUpdateStatus('done')} className="bg-green-600 hover:bg-green-700 text-white">
                            Mark Complete
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="w-full pl-3 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                                <Paperclip className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button>Send</Button>
                    </div>
                </div>

                <DeadlineExtensionModal
                    open={isExtensionModalOpen}
                    onClose={() => setIsExtensionModalOpen(false)}
                    onConfirm={handleExtendDeadline}
                    mode={isPersonal ? 'personal' : 'organization'}
                    currentDeadline={task.deadline || task.dueDate}
                />
            </SheetContent>
        </Sheet>
    );
}
