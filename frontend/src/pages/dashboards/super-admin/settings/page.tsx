
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Platform Settings</h1>
                    <p className="text-muted-foreground text-sm">Configure global platform behavior.</p>
                </div>
                <Button>Save Changes</Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="features">Feature Flags</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Configuration</CardTitle>
                            <CardDescription>
                                Basic platform details and contact info.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="platform-name">Platform Name</Label>
                                <Input id="platform-name" defaultValue="Collectii" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="support-email">Support Email</Label>
                                <Input id="support-email" defaultValue="support@collectii.com" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Mode</CardTitle>
                            <CardDescription>
                                Temporarily disable access for non-admin users.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Enable Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">Only admins will be able to log in.</p>
                            </div>
                            <Switch />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Authentication Policies</CardTitle>
                            <CardDescription>
                                Manage password strength and sessions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Enforce 2FA</Label>
                                    <p className="text-sm text-muted-foreground">Require Two-Factor Authentication for all admin accounts.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                                <Input id="session-timeout" type="number" defaultValue="60" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Flags</CardTitle>
                            <CardDescription>
                                Toggle beta features on or off globally.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">AI Assistant (Beta)</Label>
                                    <p className="text-sm text-muted-foreground">Enable the generative AI helper in the sidebar.</p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">New Analytics Dashboard</Label>
                                    <p className="text-sm text-muted-foreground">Enable the V2 analytics engine.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Public API Access</Label>
                                    <p className="text-sm text-muted-foreground">Allow users to generate API keys.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
