import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { adminNavSections } from '@/config/dashboard-nav';

export default function OrganizationManagementPage() {
    const section = adminNavSections.find(s => s.title === 'Organization Management');

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Organization Management</h1>
                <p className="text-muted-foreground mt-1">
                    Manage all organizations on the platform
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section?.items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} to={item.href}>
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
