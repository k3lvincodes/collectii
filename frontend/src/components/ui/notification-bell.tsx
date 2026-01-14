import { useState, useEffect } from 'react';
import { Bell, Check, UserPlus, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    data: any;
    read: boolean;
    created_at: string;
}

export function NotificationBell({ className }: { className?: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }
        };

        fetchNotifications();

        // Real-time subscription
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                },
                async (payload) => {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (payload.new.user_id === user?.id) {
                        setNotifications(prev => [payload.new as Notification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const markAsRead = async (id: string) => {
        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);

        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const handleInvitationAction = async (notification: Notification, accept: boolean) => {
        const invitationId = notification.data?.invitation_id;
        if (!invitationId) return;

        const status = accept ? 'accepted' : 'declined';

        // Update invitation status
        await supabase
            .from('team_invitations')
            .update({ status, responded_at: new Date().toISOString() })
            .eq('id', invitationId);

        // If accepted, add to team
        if (accept && notification.data?.team_id) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('team_members')
                    .insert({
                        team_id: notification.data.team_id,
                        user_id: user.id,
                        role: 'member'
                    });
            }
        }

        // Create response notification for inviter
        const { data: { user } } = await supabase.auth.getUser();
        if (user && notification.data?.inviter_id) {
            await supabase.from('notifications').insert({
                user_id: notification.data.inviter_id,
                type: accept ? 'invite_accepted' : 'invite_declined',
                title: accept ? 'Invitation Accepted' : 'Invitation Declined',
                message: `${user.user_metadata?.full_name || 'A user'} ${accept ? 'accepted' : 'declined'} your team invitation.`,
                data: { team_id: notification.data.team_id }
            });
        }

        // Mark this notification as read
        markAsRead(notification.id);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'team_invite':
                return <UserPlus className="h-4 w-4 text-blue-500" />;
            case 'recommendation':
                return <Users className="h-4 w-4 text-purple-500" />;
            case 'invite_accepted':
                return <Check className="h-4 w-4 text-green-500" />;
            case 'invite_declined':
                return <X className="h-4 w-4 text-red-500" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("relative", className)}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                            variant="destructive"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-3 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto p-1"
                            onClick={markAllAsRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{notification.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </p>

                                            {/* Action buttons for invitations */}
                                            {notification.type === 'team_invite' && !notification.data?.responded && (
                                                <div className="flex gap-2 mt-2">
                                                    <Button
                                                        size="sm"
                                                        className="h-7 text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleInvitationAction(notification, true);
                                                        }}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleInvitationAction(notification, false);
                                                        }}
                                                    >
                                                        Decline
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
