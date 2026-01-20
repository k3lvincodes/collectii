import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Paperclip, MessageSquare, CheckSquare, User, Calendar } from "lucide-react";
import { DeadlineExtensionModal } from "../modals/DeadlineExtensionModal";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
    onTaskUpdate?: () => void;
}

export function TaskDetailModal({ isOpen, onClose, task, onTaskUpdate }: TaskDetailModalProps) {
    const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [sendingComment, setSendingComment] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();
    const { toast } = useToast();

    // Fetch comments and attachments when task opens
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        if (isOpen && task?.id) {
            const fetchData = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                setCurrentUser(user);

                // Fetch comments (without join first to ensure data)
                const { data: commentsRaw, error } = await supabase
                    .from('task_comments')
                    .select('*')
                    .eq('task_id', task.id)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error("Error fetching comments:", error);
                    toast({ title: "Failed to load comments", variant: "destructive" });
                } else if (commentsRaw) {
                    // Manually fetch profiles to avoid join issues
                    const userIds = [...new Set(commentsRaw.map(c => c.user_id))];

                    if (userIds.length > 0) {
                        const { data: profiles } = await supabase
                            .from('profiles')
                            .select('id, full_name, avatar_url, email')
                            .in('id', userIds);

                        const commentsWithUser = commentsRaw.map(c => ({
                            ...c,
                            user: profiles?.find(p => p.id === c.user_id) || null
                        }));
                        setComments(commentsWithUser);
                    } else {
                        setComments(commentsRaw);
                    }
                }

                // Fetch attachments
                const { data: attachmentsData, error: attError } = await supabase
                    .from('task_attachments')
                    .select('*')
                    .eq('task_id', task.id);

                if (attError) {
                    console.error("Error fetching attachments:", attError);
                } else {
                    if (attachmentsData) setAttachments(attachmentsData);
                }
            };

            fetchData();

            // Subscribe to realtime changes? (Optimistic for now is fine or simple refetch)
            const channel = supabase
                .channel(`task_details:${task.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_comments', filter: `task_id=eq.${task.id}` }, (payload) => {
                    // For simplicity, just refetch or rely on own add
                    // But to see OTHERS comments, we need this.
                    // Let's just append if it's not us (but payload doesn't easily show us unless we check user_id)
                    // Re-fetching is safer for relational data
                    fetchData();
                })
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_attachments', filter: `task_id=eq.${task.id}` }, (payload) => {
                    fetchData();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            }
        }
    }, [isOpen, task?.id]);



    // if (!task) return null; // Removed generic early return to keep Dialog mounted if needed, 
    // BUT we need to handle null task safely below.

    const isPersonal = task ? !task.organization_id : true;
    const deliverables = (task && task.deliverables && Array.isArray(task.deliverables)) ? task.deliverables : [];

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

        if (!isPersonal) {
            body.extension_reason = `Requested new deadline: ${date}. Reason: ${reason}`;
            delete body.deadline;
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
            onClose();
        } else {
            toast({ title: "Failed to update", variant: "destructive" });
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || !currentUser) return;
        setSendingComment(true);

        const { error } = await supabase
            .from('task_comments')
            .insert({
                task_id: task.id,
                user_id: currentUser.id,
                content: newComment
            });

        if (error) {
            toast({ title: "Failed to send comment", variant: "destructive" });
        } else {
            setNewComment("");

            // Manual fetch to be sure (matching the useEffect logic)
            const { data: commentsRaw } = await supabase
                .from('task_comments')
                .select('*')
                .eq('task_id', task.id)
                .order('created_at', { ascending: true });

            if (commentsRaw) {
                const userIds = [...new Set(commentsRaw.map(c => c.user_id))];
                if (userIds.length > 0) {
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url, email')
                        .in('id', userIds);

                    const commentsWithUser = commentsRaw.map(c => ({
                        ...c,
                        user: profiles?.find(p => p.id === c.user_id) || null
                    }));
                    setComments(commentsWithUser);
                } else {
                    setComments(commentsRaw);
                }
            }
        }
        setSendingComment(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;

        setIsUploading(true);
        try {
            // Upload to Cloudinary
            const uploadedFile = await uploadToCloudinary(file);

            // Save reference to Supabase
            const { error } = await supabase
                .from('task_attachments')
                .insert({
                    task_id: task.id,
                    uploader_id: currentUser.id,
                    name: uploadedFile.name,
                    size: uploadedFile.size,
                    url: uploadedFile.url
                });

            if (error) {
                console.error("Supabase insert error:", error);
                toast({ title: "Failed to save attachment reference", variant: "destructive" });
            } else {
                toast({ title: "Attachment uploaded" });
                // Optimistic or wait for refetch (refetch happens via realtime subs or simple fetch)
                const { data: attachmentsData } = await supabase
                    .from('task_attachments')
                    .select('*')
                    .eq('task_id', task.id);
                if (attachmentsData) setAttachments(attachmentsData);
            }

        } catch (error) {
            console.error("Upload error:", error);
            toast({ title: "Failed to upload file", variant: "destructive" });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-full max-w-[95vw] sm:max-w-xl max-h-[90vh] flex flex-col p-0 gap-0">
                {task ? (
                    <>
                        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 text-left">
                                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                        <Badge variant="outline" className="text-[10px] sm:text-xs">{task.project || "No Project"}</Badge>
                                        <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="text-[10px] sm:text-xs">
                                            {task.priority || "Normal"}
                                        </Badge>
                                    </div>
                                    <DialogTitle className="text-base sm:text-lg md:text-xl font-bold leading-normal mt-2">{task.title}</DialogTitle>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span>Due {task.deadline ? new Date(task.deadline).toLocaleDateString() : (task.dueDate || "No Date")}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span>Assigned to You</span>
                                </div>
                            </div>
                        </DialogHeader>

                        <Separator />

                        <div className="flex-1 px-4 sm:px-6 overflow-y-auto">
                            <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">

                                {/* Description */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h3 className="font-semibold text-sm sm:text-base">Description</h3>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {task.description || "No description provided."}
                                    </p>
                                </div>

                                {/* Deliverables */}
                                {deliverables.length > 0 && (
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-sm sm:text-base">Deliverables</h3>
                                            <span className="text-[10px] sm:text-xs text-muted-foreground">0/{deliverables.length} Completed</span>
                                        </div>
                                        <div className="space-y-1.5 sm:space-y-2">
                                            {deliverables.map((item: string, i: number) => (
                                                <div key={i} className="flex items-center space-x-2 border rounded-lg p-2 sm:p-3 hover:bg-muted/50 transition-colors">
                                                    <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                                                    <span className="text-xs sm:text-sm font-medium">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Attachments */}
                                {attachments.length > 0 && (
                                    <div className="space-y-2 sm:space-y-3">
                                        <h3 className="font-semibold text-sm sm:text-base">Attachments</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                            {attachments.map((att: any) => (
                                                <div key={att.id} className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                                                    <div className="h-7 w-7 sm:h-8 sm:w-8 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center text-blue-600 shrink-0">
                                                        <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                    </div>
                                                    <div className="overflow-hidden min-w-0">
                                                        <a href={att.url} target="_blank" rel="noreferrer" className="text-xs font-medium truncate block hover:underline">{att.name}</a>
                                                        <p className="text-[10px] text-muted-foreground">{att.size || 'Unknown size'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Comments */}
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-sm sm:text-base">Activity & Comments</h3>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">{comments.length} comments</span>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4">
                                        {comments.length === 0 ? (
                                            <p className="text-xs sm:text-sm text-muted-foreground italic">No comments yet.</p>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="flex gap-2 sm:gap-3">
                                                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                                                        <AvatarImage src={comment.user?.avatar_url} />
                                                        <AvatarFallback className="text-[10px] sm:text-xs">{comment.user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
                                                            <span className="text-xs sm:text-sm font-semibold truncate">{comment.user?.full_name || comment.user?.email || 'Unknown User'}</span>
                                                            <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                                                                {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'No Date'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="p-3 sm:p-4 md:p-6 pt-3 sm:pt-4 border-t mt-auto space-y-2.5 sm:space-y-3 bg-background">
                            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                                <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm order-2 sm:order-1" onClick={() => setIsExtensionModalOpen(true)}>
                                    {isPersonal ? 'Extend Deadline' : 'Request Extension'}
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm text-muted-foreground hover:text-destructive order-3 sm:order-2" onClick={() => handleUpdateStatus('dismissed')}>
                                    Dismiss
                                </Button>
                                <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white order-1 sm:order-3" onClick={() => handleUpdateStatus('done')}>
                                    Mark Complete
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendComment();
                                            }
                                        }}
                                    />
                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7"
                                        onClick={handleAttachClick}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" /> : <Paperclip className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                                    </Button>
                                </div>
                                <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm px-3" onClick={handleSendComment} disabled={sendingComment}>
                                    {sendingComment ? <span className="animate-spin mr-1">...</span> : "Send"}
                                </Button>
                            </div>
                        </div>

                        <DeadlineExtensionModal
                            open={isExtensionModalOpen}
                            onClose={() => setIsExtensionModalOpen(false)}
                            onConfirm={handleExtendDeadline}
                            mode={isPersonal ? 'personal' : 'organization'}
                            currentDeadline={task.deadline || task.dueDate}
                        />
                    </>
                ) : (
                    <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                        <p>Loading task details...</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
