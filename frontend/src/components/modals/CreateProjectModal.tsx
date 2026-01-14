import React, { useState } from 'react';
import { FolderKanban, Loader2 } from 'lucide-react';
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

interface CreateProjectModalProps {
    open: boolean;
    userId: string;
    contextType: 'personal' | 'organization';
    contextId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateProjectModal({ open, userId, contextType, contextId, onClose, onSuccess }: CreateProjectModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [nextMilestone, setNextMilestone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        const projectData: any = {
            name,
            description,
            owner_id: userId,
            status: 'active',
            progress: 0,
            next_milestone: nextMilestone || null,
        };

        if (dueDate) {
            projectData.due_date = new Date(dueDate).toISOString();
        }

        if (contextType === 'organization' && contextId) {
            projectData.organization_id = contextId;
        }

        const { data: project, error: insertError } = await supabase
            .from('projects')
            .insert(projectData)
            .select()
            .single();

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
            return;
        }

        // Add owner as project member
        if (project) {
            await supabase
                .from('project_members')
                .insert({
                    project_id: project.id,
                    user_id: userId,
                    role: 'owner',
                });
        }

        // Reset form
        setName('');
        setDescription('');
        setDueDate('');
        setNextMilestone('');
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
                            <FolderKanban className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">New Project</h2>
                            <p className="text-sm text-muted-foreground">
                                {contextType === 'personal' ? 'Create a personal project' : 'Create an organization project'}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="project-name">Project Name *</Label>
                        <Input
                            id="project-name"
                            placeholder="e.g., Website Redesign"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="project-description">Description</Label>
                        <Textarea
                            id="project-description"
                            placeholder="What is this project about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="project-due">Due Date</Label>
                            <Input
                                id="project-due"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project-milestone">First Milestone</Label>
                            <Input
                                id="project-milestone"
                                placeholder="e.g., Beta Launch"
                                value={nextMilestone}
                                onChange={(e) => setNextMilestone(e.target.value)}
                            />
                        </div>
                    </div>

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
                            disabled={!name.trim() || loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Project
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
