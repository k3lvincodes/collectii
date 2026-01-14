import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface DeadlineExtensionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (date: string, reason?: string) => Promise<void>;
    mode: 'personal' | 'organization';
    currentDeadline?: string;
}

export function DeadlineExtensionModal({
    open,
    onClose,
    onConfirm,
    mode,
    currentDeadline,
}: DeadlineExtensionModalProps) {
    const [date, setDate] = useState(
        currentDeadline ? new Date(currentDeadline).toISOString().split('T')[0] : ''
    );
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return;

        setLoading(true);
        try {
            await onConfirm(date, reason);
            onClose();
        } catch (error) {
            console.error('Failed to update deadline:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'personal' ? 'Extend Deadline' : 'Request Deadline Extension'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'personal'
                            ? 'Choose a new due date for this task.'
                            : 'Propose a new due date and provide a reason for the request.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-date">New Due Date</Label>
                        <Input
                            id="new-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    {mode === 'organization' && (
                        <div className="space-y-2">
                            <Label htmlFor="extension-reason">Reason for Extension</Label>
                            <Textarea
                                id="extension-reason"
                                placeholder="Why do you need more time?"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === 'personal' ? 'Update Deadline' : 'Submit Request'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
