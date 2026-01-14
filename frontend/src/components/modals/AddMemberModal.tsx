import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, UserPlus, Check, Send } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddMemberModalProps {
    open: boolean;
    onClose: () => void;
    organizationId: string;
    teams: any[];
    onSuccess: () => void;
    isOwnerOrAdmin?: boolean; // True = can invite, False = can only recommend
}

export function AddMemberModal({ open, onClose, organizationId, teams, onSuccess, isOwnerOrAdmin = true }: AddMemberModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserName, setCurrentUserName] = useState<string>('');
    const supabase = createClient();

    // Get current user on mount
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserId(user.id);
                setCurrentUserName(user.user_metadata?.full_name || user.email || 'Someone');
            }
        };
        getUser();
    }, []);

    // Search users when query changes
    useEffect(() => {
        if (!searchQuery.trim() || !currentUserId) {
            setSearchResults([]);
            return;
        }

        const searchUsers = async () => {
            setSearching(true);
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, avatar_url, username')
                    .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)
                    .not('role', 'ilike', '%admin%')
                    .neq('id', currentUserId)
                    .limit(10);

                setSearchResults(data || []);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setSearching(false);
            }
        };

        const timeout = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery, currentUserId]);

    const handleSendInvitation = async () => {
        if (!selectedUser || !selectedTeamId || !currentUserId) {
            setError('Please select a user and a team');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Check if already a member
            const { data: existingMember } = await supabase
                .from('team_members')
                .select('id')
                .eq('team_id', selectedTeamId)
                .eq('user_id', selectedUser.id)
                .single();

            if (existingMember) {
                setError('User is already a member of this team');
                setLoading(false);
                return;
            }

            // Check for existing pending invitation
            const { data: existingInvite } = await supabase
                .from('team_invitations')
                .select('id')
                .eq('team_id', selectedTeamId)
                .eq('invitee_id', selectedUser.id)
                .eq('status', 'pending')
                .single();

            if (existingInvite) {
                setError('An invitation is already pending for this user');
                setLoading(false);
                return;
            }

            const invitationType = isOwnerOrAdmin ? 'invite' : 'recommendation';
            const selectedTeam = teams.find(t => t.id === selectedTeamId);

            // Create invitation record
            const { data: invitation, error: inviteError } = await supabase
                .from('team_invitations')
                .insert({
                    team_id: selectedTeamId,
                    inviter_id: currentUserId,
                    invitee_id: selectedUser.id,
                    type: invitationType,
                    status: 'pending'
                })
                .select()
                .single();

            if (inviteError) throw inviteError;

            if (isOwnerOrAdmin) {
                // Send notification to invitee
                await supabase.from('notifications').insert({
                    user_id: selectedUser.id,
                    type: 'team_invite',
                    title: 'Team Invitation',
                    message: `${currentUserName} invited you to join ${selectedTeam?.name || 'a team'}.`,
                    data: {
                        team_id: selectedTeamId,
                        team_name: selectedTeam?.name,
                        inviter_id: currentUserId,
                        invitation_id: invitation.id
                    }
                });
                setSuccess(`Invitation sent to ${selectedUser.full_name}!`);
            } else {
                // Send notification to team lead (owner)
                if (selectedTeam?.lead_id) {
                    await supabase.from('notifications').insert({
                        user_id: selectedTeam.lead_id,
                        type: 'recommendation',
                        title: 'Member Recommendation',
                        message: `${currentUserName} recommends adding ${selectedUser.full_name} to ${selectedTeam.name}.`,
                        data: {
                            team_id: selectedTeamId,
                            team_name: selectedTeam.name,
                            recommender_id: currentUserId,
                            recommended_user_id: selectedUser.id,
                            recommended_user_name: selectedUser.full_name,
                            invitation_id: invitation.id
                        }
                    });
                }
                setSuccess(`Recommendation sent! The team owner will review it.`);
            }

            // Wait a moment to show success message
            setTimeout(() => {
                onSuccess();
                resetForm();
                onClose();
            }, 1500);

        } catch (err: any) {
            console.error('Invitation error:', err);
            setError(err.message || 'Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedUser(null);
        setSelectedTeamId('');
        setError('');
        setSuccess('');
    };

    const actionLabel = isOwnerOrAdmin ? 'Invite' : 'Recommend';
    const actionDescription = isOwnerOrAdmin
        ? 'Send an invitation for the user to join the team.'
        : 'Recommend a user to the team owner for approval.';

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                resetForm();
                onClose();
            }
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{actionLabel} Team Member</DialogTitle>
                    <DialogDescription>
                        {actionDescription}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Info Alert for non-owners */}
                    {!isOwnerOrAdmin && (
                        <Alert>
                            <AlertDescription className="text-sm">
                                As a team member, you can recommend new people. The team owner will review and send the invitation.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* User Search */}
                    <div className="grid gap-2">
                        <Label>Search User</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                                disabled={loading}
                            />
                        </div>

                        {/* Search Results */}
                        {searchQuery && (
                            <ScrollArea className="h-[150px] border rounded-md p-2">
                                {searching ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
                                ) : (
                                    <div className="space-y-1">
                                        {searchResults.map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => setSelectedUser(user)}
                                                className={`w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors ${selectedUser?.id === user.id ? 'bg-primary/10 border border-primary' : ''
                                                    }`}
                                            >
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar_url} />
                                                    <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-medium">{user.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {user.username && <span className="mr-2">@{user.username}</span>}
                                                        {user.email}
                                                    </p>
                                                </div>
                                                {selectedUser?.id === user.id && (
                                                    <Check className="h-4 w-4 text-primary" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        )}
                    </div>

                    {/* Selected User Display */}
                    {selectedUser && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedUser.avatar_url} />
                                <AvatarFallback>{selectedUser.full_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{selectedUser.full_name}</p>
                                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Team Selection */}
                    <div className="grid gap-2">
                        <Label>Assign to Team *</Label>
                        <Select value={selectedTeamId} onValueChange={setSelectedTeamId} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a team" />
                            </SelectTrigger>
                            <SelectContent>
                                {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id}>
                                        {team.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {teams.length === 0 && (
                            <p className="text-xs text-muted-foreground">No teams available. Create a team first.</p>
                        )}
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSendInvitation} disabled={loading || !selectedUser || !selectedTeamId}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Send className="mr-2 h-4 w-4" />
                        {actionLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
