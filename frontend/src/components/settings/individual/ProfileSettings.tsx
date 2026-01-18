import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, Upload, Github, Linkedin, Globe, Twitter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/lib/supabase/client';

const profileSchema = z.object({
    full_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    username: z.string().min(3, { message: "Username must be at least 3 characters." }).regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores, and hyphens." }),
    bio: z.string().max(300, { message: "Bio must not exceed 300 characters." }).optional().or(z.literal('')),
    contact_email: z.string().email().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const { toast } = useToast();
    const supabase = createClient();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: '',
            username: '',
            bio: '',
            contact_email: '',
            website: '',
            twitter: '',
            linkedin: '',
            github: '',
        },
    });

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error loading profile:', error);
                return;
            }

            if (profile) {
                setAvatarUrl(profile.avatar_url);
                form.reset({
                    full_name: profile.full_name || '',
                    username: profile.username || '',
                    bio: profile.bio || '',
                    contact_email: profile.contact_email || '',
                    website: profile.social_links?.website || '',
                    twitter: profile.social_links?.twitter || '',
                    linkedin: profile.social_links?.linkedin || '',
                    github: profile.social_links?.github || '',
                });
            }
        }

        loadProfile();
    }, [form, supabase]);

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const social_links = {
                website: data.website,
                twitter: data.twitter,
                linkedin: data.linkedin,
                github: data.github,
            };

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: data.full_name,
                    username: data.username,
                    bio: data.bio,
                    contact_email: data.contact_email,
                    social_links,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;

            toast({
                title: "Profile updated",
                description: "Your profile settings have been saved successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update profile.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setAvatarUrl(publicUrl);
            toast({
                title: "Avatar updated",
                description: "Your profile picture has been updated.",
            });
        } catch (error: any) {
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload avatar.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                    Manage your public profile and how others see you on the platform.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-8 flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarUrl || ''} />
                        <AvatarFallback className="text-xl">
                            {form.watch('full_name')?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">
                            JPG, GIF or PNG. Max size of 2MB.
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="relative cursor-pointer" disabled={isUploading}>
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                Upload New
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={isUploading}
                                />
                            </Button>
                            {avatarUrl && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setAvatarUrl(null)} // This logic needs to actually update DB to null if we want to delete
                                    className="text-destructive hover:text-destructive"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john_doe" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Unique handle for your profile URL.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="contact_email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="hello@example.com" type="email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        A public-facing email address (optional).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Brief description for your profile. Max 300 characters.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <h3 className="mb-4 text-lg font-medium">Social Links</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="https://example.com" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="twitter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Twitter</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Twitter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="@username" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="github"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>GitHub</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Github className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="username" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="linkedin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Linkedin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="in/username" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
