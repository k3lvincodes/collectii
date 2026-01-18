import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Shield, Key, Mail, Smartphone, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const passwordSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const emailSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
});

export default function SecuritySettings() {
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const { toast } = useToast();
    const supabase = createClient();

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: '' },
    });

    async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
        setIsLoadingPassword(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: data.password });

            if (error) throw error;

            toast({
                title: "Password updated",
                description: "Your password has been changed successfully.",
            });
            passwordForm.reset();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoadingPassword(false);
        }
    }

    async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
        setIsLoadingEmail(true);
        try {
            const { error } = await supabase.auth.updateUser({ email: data.email });

            if (error) throw error;

            toast({
                title: "Confirmation sent",
                description: "Check your new email address for a confirmation link.",
            });
            emailForm.reset();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoadingEmail(false);
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Ensure your account is using a long, random password to stay secure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoadingPassword}>
                                {isLoadingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Change Email Address
                    </CardTitle>
                    <CardDescription>
                        Update the email address associated with your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4 max-w-md">
                            <FormField
                                control={emailForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="new@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoadingEmail} variant="outline">
                                {isLoadingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Email
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <h4 className="font-medium text-base">Authenticator App</h4>
                            <p className="text-sm text-muted-foreground">
                                Use an app like Google Authenticator or Authy to generate verification codes.
                            </p>
                        </div>
                        <Switch disabled /> {/* Placeholder: MFA requires more complex setup */}
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/50 px-6 py-4">
                    <p className="text-xs text-muted-foreground w-full text-center">
                        Two-factor authentication support is coming soon.
                    </p>
                </CardFooter>
            </Card>

            <Card className="border-destructive/20">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions for your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h4 className="font-medium">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data.
                            </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
