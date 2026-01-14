import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    MoreVertical,
    Phone,
    Video,
    Paperclip,
    Smile,
    Mic,
    Send,
    Image as ImageIcon,
    FileText,
    ChevronDown,
    Plus,
    ListTodo,
    MessageSquarePlus,
    X,
    Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useOutletContext } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CallOverlay } from './CallOverlay';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// --- Components ---

function AttachmentItem({ icon: Icon, name, size, color }: { icon: any, name: string, size: string, color: string }) {
    return (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
            <div className={cn("p-2 rounded-lg", color)}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{name}</p>
                <p className="text-xs text-muted-foreground">{size}</p>
            </div>
        </div>
    );
}

// --- Main Page Component ---

export default function MessagesPage() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);

    // Get context from parent layout
    const outletContext = useOutletContext<{ currentContext: any, user: any }>();
    const currentContext = outletContext?.currentContext;
    const contextId = currentContext?.type === 'organization' ? currentContext.orgId : null;

    // Conversations & Messages
    const [conversations, setConversations] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    // Loading States
    const [loadingConvos, setLoadingConvos] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [sending, setSending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [pendingAttachments, setPendingAttachments] = useState<any[]>([]);
    const { toast } = useToast();

    // Call State
    const [callState, setCallState] = useState<'idle' | 'calling' | 'incoming' | 'connected'>('idle');
    const [callType, setCallType] = useState<'audio' | 'video'>('video');
    const [callPartner, setCallPartner] = useState<any>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [incomingCallOffer, setIncomingCallOffer] = useState<any>(null);

    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const activeCallChannel = useRef<any>(null);

    // Inputs
    const [newMessage, setNewMessage] = useState('');

    // New Chat Modal State
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [searchUsers, setSearchUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchingUsers, setSearchingUsers] = useState(false);

    // Lightbox State
    const [lightboxAttachment, setLightboxAttachment] = useState<any>(null);

    // Scroll ref
    const scrollRef = useRef<HTMLDivElement>(null);
    const selectedThreadIdRef = useRef(selectedThreadId);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        selectedThreadIdRef.current = selectedThreadId;
    }, [selectedThreadId]);

    // 1. Init User & Conversations
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUser(user);

            // Fetch interactions to build conversation list
            // Strategy: Get messages where I am sender or receiver
            // For SENT: filter by current context (I sent from this workspace)
            // For RECEIVED: show ALL (so I don't miss messages sent to me from any context)
            let sentQuery = supabase
                .from('messages')
                .select('receiver_id, content, created_at, read_at')
                .eq('sender_id', user.id)
                .order('created_at', { ascending: false });

            // Only filter SENT messages by context
            if (contextId) {
                sentQuery = sentQuery.eq('context_id', contextId);
            } else {
                sentQuery = sentQuery.is('context_id', null);
            }

            // RECEIVED messages: filter by context
            let receivedQuery = supabase
                .from('messages')
                .select('sender_id, content, created_at, read_at')
                .eq('receiver_id', user.id)
                .order('created_at', { ascending: false });

            if (contextId) {
                receivedQuery = receivedQuery.eq('context_id', contextId);
            } else {
                receivedQuery = receivedQuery.is('context_id', null);
            }

            const { data: sent } = await sentQuery;
            const { data: received } = await receivedQuery;

            const partnerMap = new Map<string, any>();

            sent?.forEach(msg => {
                if (!partnerMap.has(msg.receiver_id)) {
                    partnerMap.set(msg.receiver_id, {
                        lastMessage: { content: msg.content, timestamp: new Date(msg.created_at), isMe: true },
                        unreadCount: 0
                    });
                }
            });

            received?.forEach(msg => {
                if (!partnerMap.has(msg.sender_id)) {
                    partnerMap.set(msg.sender_id, {
                        lastMessage: { content: msg.content, timestamp: new Date(msg.created_at), isMe: false },
                        unreadCount: msg.read_at ? 0 : 1 // Logic updated for read_at
                    });
                } else {
                    const entry = partnerMap.get(msg.sender_id);
                    // Update latest message if this one is newer (though we sorted, so likely first seen is newest)
                    if (new Date(msg.created_at) > entry.lastMessage.timestamp) {
                        entry.lastMessage = { content: msg.content, timestamp: new Date(msg.created_at), isMe: false };
                    }
                    if (!msg.read_at) entry.unreadCount++;
                }
            });

            if (partnerMap.size > 0) {
                const partnerIds = Array.from(partnerMap.keys());
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, username')
                    .in('id', partnerIds);

                const convos = profiles?.map(p => {
                    const info = partnerMap.get(p.id);
                    return {
                        id: p.id,
                        name: p.full_name || 'Unknown',
                        username: p.username,
                        avatar: p.avatar_url,
                        lastMessage: {
                            content: info.lastMessage.content,
                            timestamp: formatTime(info.lastMessage.timestamp),
                            isMe: info.lastMessage.isMe
                        },
                        unreadCount: info.unreadCount,
                        rawTimestamp: info.lastMessage.timestamp // for sorting
                    };
                }).sort((a, b) => b.rawTimestamp.getTime() - a.rawTimestamp.getTime()) || [];

                setConversations(convos);
            } else {
                setConversations([]);
            }

            setLoadingConvos(false);
        };

        init();

    }, [contextId]); // Re-fetch when context changes

    // 2. Fetch Messages for Thread
    useEffect(() => {
        if (!user || !selectedThreadId) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);

            // Build Context Filter
            let query = supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedThreadId}),and(sender_id.eq.${selectedThreadId},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: true });

            // Apply strict context filter
            if (contextId) {
                query = query.eq('context_id', contextId);
            } else {
                query = query.is('context_id', null);
            }

            const { data, error } = await query;

            if (data) {
                setMessages(data.map(m => ({
                    id: m.id,
                    senderId: m.sender_id,
                    content: m.content,
                    timestamp: formatTime(new Date(m.created_at)),
                    type: 'text',
                    attachments: m.attachments || [],
                    createdAt: new Date(m.created_at)
                })));
            }
            setLoadingMessages(false);

            // Mark read (scoped to context)
            if (data && data.length > 0) {
                const unreadMessages = data.filter(m => m.sender_id === selectedThreadId && !m.read_at);
                if (unreadMessages.length > 0) {
                    let updateQuery = supabase
                        .from('messages')
                        .update({ read_at: new Date().toISOString() })
                        .eq('sender_id', selectedThreadId)
                        .eq('receiver_id', user.id)
                        .is('read_at', null);

                    if (contextId) {
                        updateQuery = updateQuery.eq('context_id', contextId);
                    } else {
                        updateQuery = updateQuery.is('context_id', null);
                    }

                    await updateQuery;

                    // Update local conversation state to clear badge
                    setConversations(prev => prev.map(c =>
                        c.id === selectedThreadId ? { ...c, unreadCount: 0 } : c
                    ));
                }
            }
        };

        fetchMessages();
    }, [selectedThreadId, user, contextId]); // Re-fetch when context changes

    // 3. Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // 4. Search Users
    useEffect(() => {
        if (!showNewChatModal || !searchQuery.trim()) {
            setSearchUsers([]);
            return;
        }

        const runSearch = async () => {
            setSearchingUsers(true);
            const { data } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, username, email, role')
                .or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
                .not('role', 'ilike', '%admin%')
                .neq('id', user.id)
                .limit(20);

            setSearchUsers(data || []);
            setSearchingUsers(false);
        };

        const timeout = setTimeout(runSearch, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery, showNewChatModal]);

    // 5. Real-time Subscription
    useEffect(() => {
        if (!user) return;

        const channel = supabase.channel('messages_channel')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMsg = payload.new;

                // Only handle messages relevant to this user
                if (newMsg.receiver_id !== user.id && newMsg.sender_id !== user.id) return;

                // Strict Context Check:
                // If message has a context, it MUST match current contextId.
                // If message has NO context (null), current contextId MUST be null.
                const msgContextId = newMsg.context_id || null;
                const currentContextId = contextId || null;

                if (msgContextId !== currentContextId) return;

                const isMe = newMsg.sender_id === user.id;

                const currentThreadId = selectedThreadIdRef.current;
                const otherUserId = isMe ? newMsg.receiver_id : newMsg.sender_id;

                // 1. Update Messages if relevant to selected thread
                if (currentThreadId) {
                    const isRelevantToThread = (otherUserId === currentThreadId);

                    if (isRelevantToThread) {
                        setMessages(prev => {
                            if (prev.some(m => m.id === newMsg.id)) return prev;
                            return [...prev, {
                                id: newMsg.id,
                                senderId: newMsg.sender_id,
                                content: newMsg.content,
                                timestamp: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                type: 'text',
                                attachments: newMsg.attachments || [],
                                createdAt: new Date(newMsg.created_at)
                            }];
                        });
                    }
                }

                // 2. Update Conversations List
                setConversations(prev => {
                    const existingIndex = prev.findIndex(c => c.id === otherUserId);

                    if (existingIndex >= 0) {
                        const updatedConvo = {
                            ...prev[existingIndex],
                            lastMessage: {
                                content: newMsg.content,
                                timestamp: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                isMe
                            },
                            rawTimestamp: new Date(newMsg.created_at)
                        };

                        if (!isMe && currentThreadId !== otherUserId) {
                            updatedConvo.unreadCount = (updatedConvo.unreadCount || 0) + 1;
                        }

                        const newArr = [...prev];
                        newArr.splice(existingIndex, 1);
                        return [updatedConvo, ...newArr];
                    } else {
                        // Handle new conversation
                        (async () => {
                            const { data: profile } = await supabase.from('profiles').select('id, full_name, avatar_url, username').eq('id', otherUserId).single();
                            if (profile) {
                                setConversations(currentPrev => {
                                    if (currentPrev.some(c => c.id === otherUserId)) return currentPrev;
                                    return [{
                                        id: profile.id,
                                        name: profile.full_name || 'Unknown',
                                        username: profile.username,
                                        avatar: profile.avatar_url,
                                        lastMessage: {
                                            content: newMsg.content,
                                            timestamp: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                            isMe
                                        },
                                        unreadCount: isMe ? 0 : 1,
                                        rawTimestamp: new Date(newMsg.created_at)
                                    }, ...currentPrev];
                                });
                            }
                        })();
                        return prev;
                    }
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // 6. Signaling Channel (Calls)
    useEffect(() => {
        if (!user) return;

        const handleIncomingOffer = async (payload: any) => {
            if (callState !== 'idle') {
                // Busy - could send reject
                return;
            }
            const { offer, sender } = payload;
            setIncomingCallOffer(offer);
            setCallPartner(sender);
            setCallType(payload.type);
            setCallState('incoming');
        };

        const handleAnswer = async (payload: any) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
            }
        };

        const handleCandidate = async (payload: any) => {
            if (peerConnection.current) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
            }
        };

        const handleEndCall = () => {
            cleanupCall();
        };

        const channel = supabase.channel(`signaling:${user.id}`)
            .on('broadcast', { event: 'call-offer' }, (p) => handleIncomingOffer(p.payload))
            .on('broadcast', { event: 'call-answer' }, (p) => handleAnswer(p.payload))
            .on('broadcast', { event: 'ice-candidate' }, (p) => handleCandidate(p.payload))
            .on('broadcast', { event: 'end-call' }, handleEndCall)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, callState]); // Re-sub if state changes? No, closure might be stale.
    // Actually callState in dependency might cause re-sub loops. Better to use refs or functional updates if possible.
    // However, for simplicity here, we assume user ID doesn't change often. 
    // Ideally, extract handlers to refs or use stable callbacks.

    // WebRTC Functions
    const createPeerConnection = () => {
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.onicecandidate = (event) => {
            if (event.candidate && activeCallChannel.current) {
                activeCallChannel.current.send({
                    type: 'broadcast',
                    event: 'ice-candidate',
                    payload: { candidate: event.candidate }
                });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            setCallState('connected');
        };

        return pc;
    };

    const startCall = async (type: 'audio' | 'video') => {
        if (!selectedThreadId || !activeParticipant) return;
        setCallType(type);
        setCallState('calling');
        setCallPartner({
            name: activeParticipant.name,
            avatar: activeParticipant.avatar,
            username: activeParticipant.username
        });

        // 1. Get Stream
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: type === 'video'
            });
            setLocalStream(stream);

            // 2. Create PC
            const pc = createPeerConnection();
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
            peerConnection.current = pc;

            // 3. Create Offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // 4. Send Offer
            // We need to publish to the PARTNER's signaling channel
            const channel = supabase.channel(`signaling:${selectedThreadId}`);
            channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    activeCallChannel.current = channel;
                    await channel.send({
                        type: 'broadcast',
                        event: 'call-offer',
                        payload: {
                            offer,
                            type,
                            sender: {
                                id: user.id,
                                name: user.user_metadata?.full_name || 'User',
                                avatar: user.user_metadata?.avatar_url,
                                username: user.user_metadata?.username
                            }
                        }
                    });
                }
            });

        } catch (err) {
            console.error("Call start failed", err);
            cleanupCall();
            toast({ title: "Call Failed", description: "Could not access camera/microphone", variant: "destructive" });
        }
    };

    const acceptCall = async () => {
        if (!incomingCallOffer) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: callType === 'video'
            });
            setLocalStream(stream);

            const pc = createPeerConnection();
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
            peerConnection.current = pc;

            await pc.setRemoteDescription(new RTCSessionDescription(incomingCallOffer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            // Send Answer to Caller
            // Caller is stored in callPartner (from offer payload sender)
            const channel = supabase.channel(`signaling:${callPartner.id}`);
            channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    activeCallChannel.current = channel;
                    await channel.send({
                        type: 'broadcast',
                        event: 'call-answer',
                        payload: { answer }
                    });
                    setCallState('connected');
                }
            });

        } catch (err) {
            console.error("Accept failed", err);
            cleanupCall();
        }
    };

    const cleanupCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
        if (activeCallChannel.current) {
            supabase.removeChannel(activeCallChannel.current);
            activeCallChannel.current = null;
        }
        setLocalStream(null);
        setRemoteStream(null);
        setCallState('idle');
        setCallPartner(null);
        setIncomingCallOffer(null);
    };

    const endCall = async () => {
        if (activeCallChannel.current) {
            await activeCallChannel.current.send({
                type: 'broadcast',
                event: 'end-call',
                payload: {}
            });
        }
        cleanupCall();
    };


    const handleToggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
            setIsMicOn(!isMicOn);
        }
    };

    const handleToggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !isVideoOn);
            setIsVideoOn(!isVideoOn);
        }
    };


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Validate Size (15MB)
        const limit = 15 * 1024 * 1024;
        if (file.size > limit) {
            toast({
                title: "File too large",
                description: "Please upload a file smaller than 15MB.",
                variant: "destructive"
            });
            return;
        }

        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            toast({
                title: "Configuration Error",
                description: "Cloudinary credentials missing.",
                variant: "destructive"
            });
            return;
        }

        // Optimistic Preview
        const tempId = Date.now().toString();
        const previewUrl = URL.createObjectURL(file);

        setPendingAttachments(prev => [...prev, {
            id: tempId,
            url: previewUrl, // Local preview
            preview: previewUrl,
            type: file.type.startsWith('image/') ? 'image' : 'file',
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            uploading: true
        }]);

        setIsUploading(true);
        if (fileInputRef.current) fileInputRef.current.value = '';

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const data = await res.json();

            // Update the pending attachment with real URL
            setPendingAttachments(prev => prev.map(a =>
                a.id === tempId ? {
                    ...a,
                    url: data.secure_url,
                    public_id: data.public_id,
                    uploading: false,
                    preview: a.preview // Keep local preview or switch to remote (optional)
                } : a
            ));

        } catch (error) {
            console.error(error);
            toast({
                title: "Upload Failed",
                description: error instanceof Error ? error.message : "Could not upload file.",
                variant: "destructive"
            });
            // Remove failed upload
            setPendingAttachments(prev => prev.filter(a => a.id !== tempId));
        } finally {
            // Check if any others are still uploading?
            // Actually setIsUploading is a global "something is uploading" flag?
            // Better to derive 'isUploading' from pendingAttachments.some(a => a.uploading)
            // But strict state updates are better.
            setIsUploading(false); // This might be premature if multiple files, but current UI restricts to one-at-a-time via single file input.
        }
    };

    const handleSendMessage = async () => {
        if ((!newMessage.trim() && pendingAttachments.length === 0) || !selectedThreadId || !user) return;
        setSending(true);

        try {
            const payload: any = {
                sender_id: user.id,
                receiver_id: selectedThreadId,
                content: newMessage,
                attachments: pendingAttachments,
                context_id: contextId // Add context for message isolation
            };

            const { data, error } = await supabase
                .from('messages')
                .insert(payload)
                .select()
                .single();

            if (error) throw error;

            // Optimistic update
            const newMsgObj = {
                id: data.id,
                senderId: user.id,
                content: data.content,
                timestamp: formatTime(new Date(data.created_at)),
                type: 'text',
                attachments: pendingAttachments
            };
            setMessages(prev => [...prev, newMsgObj]);
            setNewMessage('');
            setPendingAttachments([]);

            // Update conversations list (move to top)
            setConversations(prev => {
                const existing = prev.find(c => c.id === selectedThreadId);
                if (existing) {
                    return [
                        { ...existing, lastMessage: { content: data.content || (pendingAttachments.length ? 'Sent an attachment' : ''), timestamp: formatTime(new Date(data.created_at)), isMe: true } },
                        ...prev.filter(c => c.id !== selectedThreadId)
                    ];
                }
                // If new conversation (from modal search)
                const searchUser = searchUsers.find(u => u.id === selectedThreadId);
                if (searchUser) {
                    return [
                        {
                            id: searchUser.id,
                            name: searchUser.full_name,
                            username: searchUser.username,
                            avatar: searchUser.avatar_url,
                            lastMessage: { content: data.content, timestamp: formatTime(new Date(data.created_at)), isMe: true },
                            unreadCount: 0,
                            rawTimestamp: new Date()
                        },
                        ...prev
                    ];
                }
                return prev;
            });

        } catch (error) {
            console.error("Failed to send", error);
        } finally {
            setSending(false);
        }
    };

    const handleStartNewChat = (userProfile: any) => {
        // Check if already in conversations
        const existing = conversations.find(c => c.id === userProfile.id);

        if (!existing) {
            // Add temp conversation so it renders immediately
            const newConvo = {
                id: userProfile.id,
                name: userProfile.full_name || 'Unknown',
                username: userProfile.username,
                avatar: userProfile.avatar_url,
                role: userProfile.role,
                lastMessage: null,
                unreadCount: 0,
                rawTimestamp: new Date()
            };
            setConversations(prev => [newConvo, ...prev]);
        }

        setSelectedThreadId(userProfile.id);
        setShowNewChatModal(false);
        setSearchQuery('');
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const activeParticipant = conversations.find(c => c.id === selectedThreadId)
        || (selectedThreadId && searchUsers.find(u => u.id === selectedThreadId) ? {
            ...searchUsers.find(u => u.id === selectedThreadId),
            name: searchUsers.find(u => u.id === selectedThreadId).full_name,
            avatar: searchUsers.find(u => u.id === selectedThreadId).avatar_url,
        } : null);

    if (loadingConvos) return (
        <div className="flex items-center justify-center h-[calc(100vh-60px)]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-60px)] bg-background overflow-hidden">

            {/* --- LEFT SIDEBAR: Contacts --- */}
            <div className="w-80 border-r flex flex-col bg-card/50">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Messages</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowNewChatModal(true)}>
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search interactions..."
                            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="px-3 pb-4 space-y-1">
                        {conversations.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <MessageSquarePlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                <p className="text-sm text-muted-foreground">No conversations yet</p>
                                <Button variant="link" className="text-primary mt-2" onClick={() => setShowNewChatModal(true)}>
                                    Start a new chat
                                </Button>
                            </div>
                        ) : conversations.map((conv) => {
                            const isSelected = selectedThreadId === conv.id;
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedThreadId(conv.id)}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left",
                                        isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                                    )}
                                >
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border-2 border-background">
                                            <AvatarImage src={conv.avatar} />
                                            <AvatarFallback>{conv.name?.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className={cn("font-semibold text-sm", isSelected ? "text-primary text-base" : "")}>
                                                {conv.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                {conv.lastMessage?.timestamp}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={cn(
                                                "text-xs truncate max-w-[140px]",
                                                conv.unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"
                                            )}>
                                                {conv.lastMessage?.isMe && "You: "} {conv.lastMessage?.content || "No messages"}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                                                    {conv.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>

            {/* --- MIDDLE & RIGHT: Chat Area + Sidebar --- */}
            {activeParticipant ? (
                <>
                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-background relative z-10 w-full">
                        {/* Header */}
                        <div className="h-16 border-b flex items-center justify-between px-6 bg-card/30 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={activeParticipant.avatar} />
                                    <AvatarFallback>{activeParticipant.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{activeParticipant.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        @{activeParticipant.username || 'user'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Button variant="ghost" size="icon" className="hover:bg-muted hover:text-foreground" onClick={() => startCall('audio')}>
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:bg-muted hover:text-foreground" onClick={() => startCall('video')}>
                                    <Video className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:bg-muted hover:text-foreground">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 px-6 py-6 scroll-smooth">
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center py-10">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <p>No messages yet. Say hello!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMe = msg.senderId === user?.id;
                                        return (
                                            <div key={msg.id} className={cn("flex flex-col gap-1 max-w-[80%] group hover:bg-muted/30 p-1 rounded transition-colors", isMe ? "ml-auto items-end" : "")}>
                                                <div className="flex items-end gap-2">
                                                    {!isMe && (
                                                        <Avatar className="h-6 w-6 mb-1">
                                                            <AvatarImage src={activeParticipant.avatar} />
                                                        </Avatar>
                                                    )}

                                                    <div className={cn(
                                                        "rounded-2xl shadow-sm overflow-hidden",
                                                        (msg.type === 'image' || msg.type === 'file' || msg.attachments?.length > 0) ? "p-1 w-fit" : "p-3",
                                                        isMe
                                                            ? "bg-primary text-primary-foreground rounded-br-sm"
                                                            : "bg-muted rounded-bl-sm"
                                                    )}>
                                                        {msg.content && <p className={cn("text-sm mb-1", (msg.attachments?.length) ? "px-2 py-1" : "")}>{msg.content}</p>}

                                                        {msg.attachments && msg.attachments.length > 0 && (
                                                            <div className="space-y-1">
                                                                {msg.attachments.map((att: any, idx: number) => (
                                                                    <div key={idx} className="bg-background/20 rounded p-1">
                                                                        {att.type === 'image' ? (
                                                                            <img
                                                                                src={att.url}
                                                                                alt="Attachment"
                                                                                className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                                                onClick={() => setLightboxAttachment(att)}
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-background/30 rounded"
                                                                                onClick={() => window.open(att.url, '_blank')}
                                                                            >
                                                                                <FileText className="h-4 w-4" />
                                                                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-xs underline truncate max-w-[150px]">{att.name}</a>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {isMe && (
                                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={cn("text-[10px] text-muted-foreground px-1", isMe ? "text-right" : "")}>
                                                    {msg.timestamp}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-card/30 backdrop-blur-sm border-t">
                            {/* Attachment Preview */}
                            {pendingAttachments.length > 0 && (
                                <div className="flex gap-2 mb-2 px-2 overflow-x-auto">
                                    {pendingAttachments.map((att, i) => (
                                        <div key={i} className="relative group bg-muted p-2 rounded-md flex items-center gap-2">
                                            {att.type === 'image' ? (
                                                <div className="relative">
                                                    <img src={att.preview || att.url} alt="Preview" className="h-10 w-10 object-cover rounded" />
                                                    {att.uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded"><Loader2 className="h-4 w-4 animate-spin text-white" /></div>}
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <FileText className="h-8 w-8 text-orange-500" />
                                                    {att.uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded"><Loader2 className="h-4 w-4 animate-spin text-white" /></div>}
                                                </div>
                                            )}
                                            <div className="flex flex-col max-w-[100px]">
                                                <span className="text-xs truncate font-medium">{att.name}</span>
                                                <span className="text-[10px] text-muted-foreground">{att.size}</span>
                                            </div>
                                            <button
                                                onClick={() => setPendingAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2 bg-background p-2 rounded-xl border shadow-sm max-w-3xl mx-auto">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted/50 rounded-full">
                                    <Mic className="h-5 w-5" />
                                </Button>
                                <Input
                                    placeholder="Add a comment..."
                                    className="bg-transparent border-none focus-visible:ring-0 shadow-none px-2 text-sm"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={sending}
                                />
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-muted/50 rounded-full"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                                    </Button>
                                    <Separator orientation="vertical" className="h-6 mx-1" />
                                    <Button onClick={handleSendMessage} size="icon" disabled={sending || pendingAttachments.some(a => a.uploading) || (pendingAttachments.length === 0 && !newMessage.trim())} className="h-8 w-8 rounded-full shadow-md bg-primary hover:bg-primary/90">
                                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 text-white ml-0.5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-72 border-l bg-card/30 hidden xl:flex flex-col">
                        <div className="p-6 flex flex-col items-center text-center border-b">
                            <Avatar className="h-24 w-24 mb-4 ring-4 ring-muted/50">
                                <AvatarImage src={activeParticipant.avatar} />
                                <AvatarFallback>{activeParticipant.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-bold">{activeParticipant.name}</h2>
                            <p className="text-sm text-primary font-medium mb-1">@{activeParticipant.username}</p>
                            <p className="text-sm text-muted-foreground">{activeParticipant.role || 'Member'}</p>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-6">
                                {/* Dynamic Attachments */}
                                {(() => {
                                    const allAttachments = messages.flatMap(m => m.attachments || []).filter(Boolean);
                                    if (allAttachments.length === 0) return null;
                                    return (
                                        <div>
                                            <div className="flex items-center justify-between mb-3 text-sm font-medium text-muted-foreground">
                                                <span>Attachments</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                            <div className="space-y-2">
                                                {allAttachments.map((att: any, i: number) => (
                                                    <AttachmentItem
                                                        key={i}
                                                        icon={att.type === 'image' ? ImageIcon : FileText}
                                                        name={att.name || 'Attachment'}
                                                        size={att.size || 'Unknown size'}
                                                        color={att.type === 'image' ? 'bg-blue-500' : 'bg-orange-500'}
                                                    />
                                                ))}
                                                <Button variant="link" className="text-primary h-auto p-0 text-sm mt-1">View all</Button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </ScrollArea>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-background">
                    <MessageSquarePlus className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No conversation selected</h3>
                    <p className="text-sm text-muted-foreground/70 mb-4">Select a conversation or start a new one</p>
                    <Button onClick={() => setShowNewChatModal(true)} className="gap-2">
                        <Plus className="h-4 w-4" /> Start New Chat
                    </Button>
                </div>
            )
            }

            {/* --- NEW CHAT MODAL --- */}
            {
                showNewChatModal && (
                    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-card border shadow-lg rounded-xl w-full max-w-md">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="font-semibold">Start New Chat</h3>
                                <Button variant="ghost" size="icon" onClick={() => { setShowNewChatModal(false); setSearchQuery(''); }}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="p-4">
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <ScrollArea className="h-64">
                                    {searchingUsers ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : searchUsers.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground text-sm">
                                            {searchQuery ? 'No users found' : 'Type to search for users'}
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {searchUsers.map(user => (
                                                <button
                                                    key={user.id}
                                                    onClick={() => handleStartNewChat(user)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={user.avatar_url} />
                                                        <AvatarFallback>{user.full_name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{user.full_name}</p>
                                                        <p className="text-xs text-muted-foreground">@{user.username || 'user'}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                )
            }

            <CallOverlay
                isOpen={callState !== 'idle'}
                state={callState}
                type={callType}
                partner={callPartner}
                localStream={localStream}
                remoteStream={remoteStream}
                onAccept={acceptCall}
                onReject={endCall} // Reject is same as ending for now
                onEnd={endCall}
                onToggleMic={handleToggleMic}
                onToggleVideo={handleToggleVideo}
                isMicOn={isMicOn}
                isVideoOn={isVideoOn}
            />

            {/* Attachment Lightbox Modal */}
            {lightboxAttachment && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxAttachment(null)}
                    onKeyDown={(e) => e.key === 'Escape' && setLightboxAttachment(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10"
                        onClick={() => setLightboxAttachment(null)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                    <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        {lightboxAttachment.type === 'image' ? (
                            <img
                                src={lightboxAttachment.url}
                                alt={lightboxAttachment.name || 'Attachment'}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                        ) : (
                            <div className="bg-card p-8 rounded-xl text-center">
                                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <p className="font-medium mb-2">{lightboxAttachment.name}</p>
                                <p className="text-sm text-muted-foreground mb-4">{lightboxAttachment.size}</p>
                                <Button onClick={() => window.open(lightboxAttachment.url, '_blank')}>
                                    Download File
                                </Button>
                            </div>
                        )}
                    </div>
                    {lightboxAttachment.name && (
                        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-full">
                            {lightboxAttachment.name}
                        </p>
                    )}
                </div>
            )}
        </div >
    );
}
