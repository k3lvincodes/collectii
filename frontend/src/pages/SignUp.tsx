
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'signup' | 'verify'>('signup');
    const [email, setEmail] = useState("");
    const { toast } = useToast();
    const navigate = useNavigate();
    const supabase = createClient();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        const emailValue = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;

        setEmail(emailValue);

        try {
            // 1. Check if email exists via backend
            const checkRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/auth/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailValue }),
            });
            if (!checkRes.ok) {
                const errorData = await checkRes.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to verify email availability');
            }
            const { exists, verified } = await checkRes.json();

            // Only block if the account exists AND is already verified
            if (exists && verified) {
                toast({
                    variant: "destructive",
                    title: "Account exists",
                    description: "An account with this email already exists. Please sign in instead.",
                });
                setIsLoading(false);
                return;
            }

            // 2. Proceed with Signup (or Resend)
            if (exists && !verified) {
                // If user exists but is not verified, we try to resend the OTP
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: emailValue,
                });

                if (error) {
                    toast({
                        variant: "destructive",
                        title: "Error requesting OTP",
                        description: error.message,
                    });
                    setIsLoading(false);
                } else {
                    toast({
                        title: "OTP Resent",
                        description: "This email is already registered but not verified. A new code has been sent.",
                    });
                    setStep('verify');
                    setIsLoading(false);
                }
                return;
            }

            // Normal new user signup
            const { data, error } = await supabase.auth.signUp({
                email: emailValue,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: error.message,
                });
                setIsLoading(false);
            } else if (data.user) {
                toast({
                    title: "OTP Sent",
                    description: "Please check your email for the verification code.",
                });
                setStep('verify');
                setIsLoading(false);
            }
        } catch (err) {
            console.error(err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
            });
            setIsLoading(false);
        }
    };

    const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        const token = formData.get("otp") as string;

        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
            setIsLoading(false);
        } else {
            toast({
                title: "Success",
                description: "Account verified successfully!",
            });
            navigate("/app");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute top-8 left-8">
                <Link to="/" className="font-bold font-headline text-lg">Collectii<span className="text-primary">.</span></Link>
            </div>
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">
                        {step === 'signup' ? 'Sign Up' : 'Verify Account'}
                    </CardTitle>
                    <CardDescription>
                        {step === 'signup'
                            ? 'Create an account to get started'
                            : `Enter the 6-digit code sent to ${email}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'signup' ? (
                        <div className="grid gap-4">
                            <Button variant="outline" className="w-full" type="button">
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Continue with Google
                            </Button>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Sending Code...' : 'Create Account'}
                                </Button>
                            </form>
                            <div className="mt-4 text-center text-sm">
                                Already have an account?{" "}
                                <Link to="/sign-in" className="underline">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleVerify} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="otp">Verification Code</Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    placeholder="123456"
                                    required
                                    maxLength={6}
                                    className="text-center text-2xl tracking-[1em]"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify & Continue'}
                            </Button>
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setStep('signup')}
                                className="text-xs"
                            >
                                Back to Sign Up
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
