import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Calendar, User, Trash2 } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { Separator } from "@/components/ui/separator";

interface TeamDetailsModalProps {
    open: boolean;
    onClose: () => void;
    team: any;
    onMemberRemoved?: () => void;
}

export function TeamDetailsModal({ open, onClose, team, onMemberRemoved }: TeamDetailsModalProps) {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (open && team?.id) {
            fetchMembers();
        }
    }, [open, team?.id]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select(`
                    id,
                    role,
                    joined_at,
                    user:profiles!user_id(id, full_name, avatar_url, username, email)
                `)
                .eq('team_id', team.id);

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        setRemovingMemberId(memberId);
        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', memberId);

            if (error) throw error;

            setMembers(prev => prev.filter(m => m.id !== memberId));
            onMemberRemoved?.();
        } catch (error) {
            console.error('Failed to remove member:', error);
        } finally {
            setRemovingMemberId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!team) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">{team.name}</DialogTitle>
                    <DialogDescription>
                        {team.description || 'No description provided'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Team Info */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{members.length} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(team.created_at)}</span>
                        </div>
                    </div>

                    {/* Team Lead */}
                    {team.lead && (
                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={team.lead.avatar_url} />
                                <AvatarFallback>{team.lead.full_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{team.lead.full_name}</p>
                                    <Badge variant="secondary" className="text-xs">Lead</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Team Lead</p>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Members List */}
                    <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Team Members
                        </h4>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : members.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No members yet. Add members from the Teams page.
                            </p>
                        ) : (
                            <ScrollArea className="h-[200px]">
                                <div className="space-y-2">
                                    {members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={member.user?.avatar_url} />
                                                <AvatarFallback>
                                                    {member.user?.full_name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {member.user?.full_name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {member.user?.username && `@${member.user.username} • `}
                                                    {member.role}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveMember(member.id)}
                                                disabled={removingMemberId === member.id}
                                            >
                                                {removingMemberId === member.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
