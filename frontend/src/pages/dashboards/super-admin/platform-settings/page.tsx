import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { adminNavSections } from '@/config/dashboard-nav';

export default function PlatformSettingsPage() {
    const section = adminNavSections.find(s => s.title === 'Platform Settings');

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Platform Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Configure system-wide settings and integrations
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section?.items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg">{item.label}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        {item.label}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
