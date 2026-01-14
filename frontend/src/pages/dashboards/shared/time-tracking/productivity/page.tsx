import { PlaceholderPage } from '@/components/placeholder-page';
import { TrendingUp } from 'lucide-react';

export default function ProductivityPage() {
    return (
        <PlaceholderPage
            title="Productivity Summary"
            description="Analyze your productivity metrics"
            icon={TrendingUp}
            cardTitle="Productivity Analytics"
            cardDescription="Track your work patterns and efficiency"
        />
    );
}
