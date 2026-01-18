import React, { useEffect, useRef } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type CallState = 'idle' | 'calling' | 'incoming' | 'connected';
type CallType = 'audio' | 'video';

interface CallOverlayProps {
    isOpen: boolean;
    state: CallState;
    type: CallType;
    partner: { name: string; avatar: string; username: string } | null;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onAccept: () => void;
    onReject: () => void;
    onEnd: () => void;
    onToggleMic: () => void;
    onToggleVideo: () => void;
    isMicOn: boolean;
    isVideoOn: boolean;
}

export function CallOverlay({
    isOpen,
    state,
    type,
    partner,
    localStream,
    remoteStream,
    onAccept,
    onReject,
    onEnd,
    onToggleMic,
    onToggleVideo,
    isMicOn,
    isVideoOn
}: CallOverlayProps) {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    if (!isOpen || state === 'idle') return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">

            {/* Incoming / Calling State */}
            {(state === 'incoming' || state === 'calling') && (
                <div className="bg-card border shadow-2xl rounded-2xl p-8 flex flex-col items-center gap-6 max-w-sm w-full animate-in fade-in zoom-in duration-300">
                    <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-lg">
                        <AvatarImage src={partner?.avatar} />
                        <AvatarFallback className="text-4xl">{partner?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">{partner?.name}</h2>
                        <p className="text-muted-foreground animate-pulse">
                            {state === 'incoming' ? 'Incoming Call...' : 'Calling...'}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 w-full justify-center">
                        {state === 'incoming' && (
                            <Button
                                size="icon"
                                className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
                                onClick={onAccept}
                            >
                                {type === 'video' ? <Video className="h-6 w-6 text-white" /> : <Phone className="h-6 w-6 text-white" />}
                            </Button>
                        )}
                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg"
                            onClick={state === 'incoming' ? onReject : onEnd}
                        >
                            {state === 'incoming' ? <X className="h-6 w-6 text-white" /> : <PhoneOff className="h-6 w-6 text-white" />}
                        </Button>
                    </div>
                </div>
            )}

            {/* Connected State */}
            {state === 'connected' && (
                <div className="relative w-full max-w-4xl h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                    {/* Remote Stream (Main) */}
                    <div className="flex-1 relative bg-zinc-900 flex items-center justify-center">
                        {/* Remote Video - Always rendered for audio playback */}
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className={`w-full h-full object-cover ${type !== 'video' ? 'hidden' : ''}`}
                        />

                        {/* Avatar Overlay for Audio Calls (or fallback) */}
                        {(type === 'audio' || !remoteStream) && (
                            <div className="flex flex-col items-center gap-4 absolute inset-0 justify-center z-10">
                                <Avatar className="h-32 w-32 ring-4 ring-white/10">
                                    <AvatarImage src={partner?.avatar} />
                                    <AvatarFallback>{partner?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-white text-xl font-medium">{partner?.name}</h3>
                                {type === 'audio' && <span className="text-white/60 text-sm">Audio Call</span>}
                            </div>
                        )}

                        {/* Local Stream (PIP) */}
                        {type === 'video' && localStream && (
                            <div className="absolute bottom-4 right-4 w-48 h-36 bg-zinc-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover mirror-mode"
                                    style={{ transform: 'scaleX(-1)' }} // Mirror effect
                                />
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="h-20 bg-zinc-900/90 border-t border-white/10 flex items-center justify-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-12 w-12 rounded-full ${!isMicOn ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            onClick={onToggleMic}
                        >
                            {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                        </Button>

                        <Button
                            size="icon"
                            className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                            onClick={onEnd}
                        >
                            <PhoneOff className="h-6 w-6" />
                        </Button>

                        {type === 'video' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-12 w-12 rounded-full ${!isVideoOn ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                onClick={onToggleVideo}
                            >
                                {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
