import React, { useEffect, useRef, useState } from 'react';
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

// Helper to format seconds to MM:SS or HH:MM:SS
function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const [callDuration, setCallDuration] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Attach local stream to video element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Attach remote stream to video AND audio elements
    useEffect(() => {
        if (remoteStream) {
            // For video calls, attach to video element
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            // For audio calls (or as fallback), attach to audio element
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = remoteStream;
                // Try to play audio
                remoteAudioRef.current.play().catch(err => {
                    console.warn('Audio autoplay blocked:', err);
                });
            }
        }
    }, [remoteStream]);

    // Start/stop call duration timer
    useEffect(() => {
        if (state === 'connected') {
            // Reset and start timer
            setCallDuration(0);
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            // Clear timer when not connected
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setCallDuration(0);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [state]);

    if (!isOpen || state === 'idle') return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
            {/* Hidden audio element for remote audio playback */}
            <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

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
                            {state === 'incoming'
                                ? `Incoming ${type === 'video' ? 'Video' : 'Audio'} Call...`
                                : 'Calling...'}
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
                    {/* Call Duration Timer */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-white text-sm font-mono font-medium">
                            {formatDuration(callDuration)}
                        </span>
                    </div>

                    {/* Remote Stream (Main) */}
                    <div className="flex-1 relative bg-zinc-900 flex items-center justify-center">
                        {/* Remote Video - Always rendered for video calls */}
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
                                <span className="text-white/60 text-sm">
                                    {type === 'audio' ? 'Audio Call' : 'Connecting...'}
                                </span>
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

