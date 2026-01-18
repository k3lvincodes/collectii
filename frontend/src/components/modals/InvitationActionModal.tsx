import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InvitationActionModalProps {
    open: boolean;
    onClose: () => void;
    notification: any;
    onSuccess: () => void;
}

export function InvitationActionModal({ open, onClose, notification, onSuccess }: InvitationActionModalProps) {
    const [loading, setLoading] = useState(false);
    const [invitation, setInvitation] = useState<any>(null);
    const [expired, setExpired] = useState(false);
    const { toast } = useToast();
    const supabase = createClient();

    useEffect(() => {
        // Support both data and metadata, and invite_id vs invitation_id for robustness
        const inviteId = notification?.data?.invitation_id || notification?.data?.invite_id || notification?.metadata?.invite_id;
        if (open && inviteId) {
            fetchInvitation(inviteId);
        }
    }, [open, notification]);

    const fetchInvitation = async (id: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('team_invitations')
            .select(`
                *,
                team:teams(name),
                inviter:profiles!inviter_id(full_name)
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching invite:", error);
        } else {
            setInvitation(data);
            const created = new Date(data.created_at);
            const now = new Date();
            const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
            // Check if older than 7 days
            if (diffDays > 7 && data.status === 'pending') {
                setExpired(true);
                // Optionally update status to expired in DB, but visually showing expired is safer for read-only view
            }
        }
        setLoading(false);
    };

    const handleAction = async (status: 'accepted' | 'declined') => {
        if (!invitation) return;
        setLoading(true);

        try {
            // Update invitation status
            const { data, error: updateError } = await supabase
                .from('team_invitations')
                .update({ status: status })
                .eq('id', invitation.id)
                .select();

            if (updateError) throw updateError;
            if (!data || data.length === 0) {
                throw new Error("Failed to update invitation. It may have been deleted or you don't have permission.");
            }

            if (status === 'accepted') {
                // Add to team_members
                const { error: memberError } = await supabase
                    .from('team_members')
                    .insert({
                        team_id: invitation.team_id,
                        user_id: invitation.invitee_id,
                        role: 'member' // Default role
                    });

                if (memberError) {
                    // Start Rollback (manual) - strictness
                    await supabase.from('team_invitations').update({ status: 'pending' }).eq('id', invitation.id);
                    throw memberError;
                }

                toast({
                    title: "Invitation Accepted",
                    description: `You've accepted invitation to ${invitation.team?.name}.`
                });
            } else {
                toast({
                    title: "Invitation Declined",
                    description: `You've declined invitation to ${invitation.team?.name}.`
                });
            }

            // Mark notification as read
            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notification.id);

            onSuccess();
            onClose();

        } catch (error: any) {
            console.error("Invitation action error:", error);
            toast({
                title: "Action failed",
                description: error.message || "An unexpected error occurred",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    // If still loading initial data, show loader or nothing
    if (loading && !invitation) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent>
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!invitation) return null;

    const isPending = invitation?.status === 'pending';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Team Invitation</DialogTitle>
                    <DialogDescription>
                        {invitation?.inviter?.full_name} has invited you to join <strong>{invitation?.team?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="flex justify-between text-sm border-b pb-2">
                        <span className="text-muted-foreground">Status</span>
                        <span className={`font-medium capitalize ${expired ? 'text-orange-500' :
                            invitation.status === 'accepted' ? 'text-green-500' :
                                invitation.status === 'declined' ? 'text-red-500' : ''
                            }`}>
                            {expired ? 'Expired' : invitation?.status}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sent</span>
                        <span>{formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}</span>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>Close</Button>

                    {isPending && !expired && (
                        <>
                            <Button variant="destructive" onClick={() => handleAction('declined')} disabled={loading}>
                                Decline
                            </Button>
                            <Button onClick={() => handleAction('accepted')} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Accept
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
