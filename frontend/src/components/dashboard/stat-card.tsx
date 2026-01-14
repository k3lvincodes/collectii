import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    trend: number; // percentage
    trendLabel?: string; // e.g. "from last week"
    trendDirection?: 'up' | 'down'; // if omitted, inferred from trend > 0
    chartData?: number[]; // array of heights 0-100
    color?: 'blue' | 'purple' | 'pink' | 'orange' | 'green';
}

export function StatCard({
    title,
    value,
    trend,
    trendLabel = "from last week",
    trendDirection,
    chartData = [40, 55, 42, 50, 65, 48, 70],
    color = 'blue'
}: StatCardProps) {
    const isUp = trendDirection ? trendDirection === 'up' : trend > 0;

    const colorMap = {
        blue: { from: 'from-blue-500/40', to: 'to-blue-500/5', text: 'text-blue-600' },
        purple: { from: 'from-purple-500/40', to: 'to-purple-500/5', text: 'text-purple-600' },
        pink: { from: 'from-pink-500/40', to: 'to-pink-500/5', text: 'text-pink-600' },
        orange: { from: 'from-orange-500/40', to: 'to-orange-500/5', text: 'text-orange-600' },
        green: { from: 'from-green-500/40', to: 'to-green-500/5', text: 'text-green-600' },
    };

    const styles = colorMap[color] || colorMap.blue;

    return (
        <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardDescription className="text-xs font-medium">{title}</CardDescription>
                        <CardTitle className="text-2xl font-bold mt-1">{value}</CardTitle>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        isUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="text-xs text-muted-foreground">{trendLabel}</p>
                <div className="h-12 mt-2 flex items-end gap-0.5">
                    {chartData.map((height, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 bg-gradient-to-t rounded-t",
                                styles.from,
                                styles.to
                            )}
                            style={{ height: `${height}%` }}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
