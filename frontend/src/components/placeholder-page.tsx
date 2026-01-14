import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    cardTitle?: string;
    cardDescription?: string;
}

export function PlaceholderPage({
    title,
    description,
    icon: Icon,
    cardTitle = 'Coming Soon',
    cardDescription = 'This feature is under development',
}: PlaceholderPageProps) {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="h-8 w-8 text-primary" />}
                <div>
                    <h1 className="text-3xl font-bold font-headline">{title}</h1>
                    <p className="text-muted-foreground mt-1">{description}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{cardTitle}</CardTitle>
                    <CardDescription>{cardDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-6 mb-4">
                            {Icon && <Icon className="h-12 w-12 text-muted-foreground" />}
                        </div>
                        <p className="text-lg font-medium mb-2">{cardTitle}</p>
                        <p className="text-sm text-muted-foreground max-w-md">
                            This page is currently being developed. Check back soon for updates!
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
