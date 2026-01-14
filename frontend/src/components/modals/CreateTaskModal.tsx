import React, { useState, useEffect } from 'react';
import { ListTodo, Loader2, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

interface Member {
    id: string;
    full_name: string;
    email: string;
}

interface CreateTaskModalProps {
    open: boolean;
    userId: string;
    contextType: 'personal' | 'organization';
    contextId?: string; // Organization ID if org context
    onClose: () => void;
    onSuccess: () => void;
    taskToEdit?: any; // Add taskToEdit prop
}

export function CreateTaskModal({ open, userId, contextType, contextId, onClose, onSuccess, taskToEdit }: CreateTaskModalProps) {
    const [title, setTitle] = useState(taskToEdit?.title || '');
    const [description, setDescription] = useState(taskToEdit?.description || '');
    const [deliverables, setDeliverables] = useState(taskToEdit?.deliverables ? (Array.isArray(taskToEdit.deliverables) ? taskToEdit.deliverables.join('\n') : taskToEdit.deliverables) : '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(taskToEdit?.priority || 'medium');
    const [deadline, setDeadline] = useState(taskToEdit?.deadline ? new Date(taskToEdit.deadline).toISOString().split('T')[0] : '');
    const [assigneeId, setAssigneeId] = useState(taskToEdit?.assignee_id || userId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        if (open) {
            if (taskToEdit) {
                setTitle(taskToEdit.title || '');
                setDescription(taskToEdit.description || '');
                setDeliverables(taskToEdit.deliverables ? (Array.isArray(taskToEdit.deliverables) ? taskToEdit.deliverables.join('\n') : taskToEdit.deliverables) : '');
                setPriority(taskToEdit.priority || 'medium');
                setDeadline(taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().split('T')[0] : '');
                setAssigneeId(taskToEdit.assignee_id || userId);
            } else {
                // Reset form for new task
                setTitle('');
                setDescription('');
                setDeliverables('');
                setPriority('medium');
                setDeadline('');
                setAssigneeId(userId);
            }
        }
    }, [open, taskToEdit, userId]);

    const fetchOrgMembers = async () => {
        if (!contextId) return;
        setLoadingMembers(true);

        const { data, error } = await supabase
            .from('organization_members')
            .select(`
                user_id,
                profile:profiles(id, full_name, email)
            `)
            .eq('organization_id', contextId);

        if (data) {
            const formattedMembers = data
                .filter(m => m.profile)
                .map(m => ({
                    id: (m.profile as any).id,
                    full_name: (m.profile as any).full_name || 'Unknown',
                    email: (m.profile as any).email || '',
                }));
            setMembers(formattedMembers);
        }

        setLoadingMembers(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        setError(null);

        const taskData: any = {
            title,
            description,
            deliverables: deliverables.split('\n').filter(line => line.trim() !== ''),
            priority,
            status: 'todo',
            assignee_id: assigneeId,
        };

        if (deadline) {
            taskData.deadline = new Date(deadline).toISOString();
        }

        if (contextType === 'organization' && contextId) {
            taskData.organization_id = contextId;
        }

        let resultError = null;

        if (taskToEdit) {
            // Update existing task
            const { error: updateError } = await supabase
                .from('tasks')
                .update(taskData)
                .eq('id', taskToEdit.id);
            resultError = updateError;
        } else {
            // Create new task
            const { error: insertError } = await supabase
                .from('tasks')
                .insert(taskData);
            resultError = insertError;
        }

        if (resultError) {
            setError(resultError.message);
            setLoading(false);
            return;
        }

        // Reset form
        setTitle('');
        setDescription('');
        setDeliverables('');
        setPriority('medium');
        setDeadline('');
        setAssigneeId(userId);
        setLoading(false);
        onSuccess();
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border shadow-lg rounded-xl w-full max-w-md">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <ListTodo className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <div>
                                <h2 className="text-lg font-semibold">{taskToEdit ? 'Edit Task' : 'New Task'}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {taskToEdit ? 'Update task details' : (contextType === 'personal' ? 'Create a personal task' : 'Assign a task to your team')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="task-title">Title *</Label>
                        <Input
                            id="task-title"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="task-description">Description</Label>
                        <Textarea
                            id="task-description"
                            placeholder="Add more details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="task-deliverables">Deliverables</Label>
                        <Textarea
                            id="task-deliverables"
                            placeholder="One deliverable per line"
                            value={deliverables}
                            onChange={(e) => setDeliverables(e.target.value)}
                            rows={3}
                        />
                        <p className="text-xs text-muted-foreground">Enter each deliverable on a new line.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="task-deadline">Due Date</Label>
                            <Input
                                id="task-deadline"
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </div>

                    {contextType === 'organization' && (
                        <div className="space-y-2">
                            <Label>Assign To</Label>
                            {loadingMembers ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading members...
                                </div>
                            ) : (
                                <Select value={assigneeId} onValueChange={setAssigneeId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.full_name || member.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={!title.trim() || loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
