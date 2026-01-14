
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface UsernameSetupModalProps {
    open: boolean;
    user: any;
    onSuccess: (newUsername: string) => void;
}

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    if (url.endsWith('/api')) return url;
    return `${url}/api`;
};

const API_URL = getApiUrl();

export function UsernameSetupModal({ open, user, onSuccess }: UsernameSetupModalProps) {
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounce check
    useEffect(() => {
        if (!username || username.length < 3) {
            setStatus('invalid');
            return;
        }

        const timer = setTimeout(async () => {
            setStatus('checking');
            try {
                const res = await fetch(`${API_URL}/admin/username/check`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username })
                });
                const data = await res.json();
                if (data.available) {
                    setStatus('available');
                } else {
                    setStatus('taken');
                }
            } catch (err) {
                console.error("Check failed", err);
                setStatus('idle'); // fallback
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status !== 'available' || loading) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/admin/username/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, username })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                onSuccess(username);
            } else {
                setError(data.error || 'Failed to update username');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border shadow-lg rounded-xl w-full max-w-md p-6 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">Create your Username</h2>
                    <p className="text-muted-foreground mt-2">
                        You need to set a unique username before proceeding. This will be your identity on the platform.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                            <Input
                                id="username"
                                placeholder="username"
                                value={username}
                                onChange={(e) => {
                                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '');
                                    setUsername(val);
                                }}
                                className={
                                    status === 'available' ? 'border-green-500 ring-green-500/20' :
                                        status === 'taken' ? 'border-red-500 ring-red-500/20' : ''
                                }
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {status === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                {status === 'available' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {status === 'taken' && <AlertCircle className="h-4 w-4 text-red-500" />}
                            </div>
                        </div>
                        {status === 'taken' && <p className="text-xs text-red-500">Username is already taken.</p>}
                        {status === 'available' && <p className="text-xs text-green-500">Username is available!</p>}
                        <p className="text-xs text-muted-foreground">Only letters, numbers, and underscores.</p>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={status !== 'available' || loading || username.length < 3}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Continue
                    </Button>
                </form>
            </div>
        </div>
    );
}
