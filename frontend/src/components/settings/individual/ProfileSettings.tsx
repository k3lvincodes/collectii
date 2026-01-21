import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, Upload, Github, Linkedin, Globe, Twitter, Pen, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const AVATAR_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#78716C'
];

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

    const handleColorSelect = async (color: string) => {
        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: color })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setAvatarUrl(color);
            toast({
                title: "Avatar updated",
                description: "Your profile color has been updated.",
            });
        } catch (error: any) {
            toast({
                title: "Update failed",
                description: error.message || "Failed to update avatar color.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Profile Settings</CardTitle>
                <CardDescription className="text-sm">
                    Manage your public profile and how others see you on the platform.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <div className="relative group">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="relative cursor-pointer">
                                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-border shadow-sm transition-all group-hover:opacity-90">
                                        {!avatarUrl?.startsWith('#') && (
                                            <AvatarImage src={avatarUrl || ''} className="object-cover" />
                                        )}
                                        <AvatarFallback
                                            className="text-2xl sm:text-3xl font-medium text-white"
                                            style={{ backgroundColor: avatarUrl?.startsWith('#') ? avatarUrl : '#888' }}
                                        >
                                            {form.watch('full_name')?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Overlay Pen Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Pen className="h-6 w-6 text-white" />
                                    </div>

                                    {/* Loading State Overlay */}
                                    {isUploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 p-3">
                                <DropdownMenuLabel>Change Profile Picture</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <div className="grid grid-cols-6 gap-2 p-2">
                                    {AVATAR_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => handleColorSelect(color)}
                                            className={cn(
                                                "w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                                                avatarUrl === color && "ring-2 ring-primary ring-offset-2"
                                            )}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>

                                <DropdownMenuSeparator />

                                <div className="p-2">
                                    <div className="relative">
                                        <Button variant="outline" className="w-full relative" size="sm" disabled={isUploading}>
                                            <Upload className="h-3.5 w-3.5 mr-2" />
                                            Upload Image
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                disabled={isUploading}
                                            />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                        Max size 2MB. JPG, PNG, GIF.
                                    </p>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex flex-col gap-2 text-center sm:text-left pt-2">
                        <h3 className="font-medium text-lg">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground max-w-[200px] sm:max-w-none">
                            Click the avatar to change your profile picture or select a color.
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
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
                            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-medium">Social Links</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
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

                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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
