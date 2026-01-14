import { PlaceholderPage } from '@/components/placeholder-page';
import { TrendingUp } from 'lucide-react';

export default function ProgressPage() {
    return (
        <PlaceholderPage
            title="Task Progress Stats"
            description="Track your task completion and productivity metrics"
            icon={TrendingUp}
            cardTitle="Progress Analytics"
            cardDescription="Visualize your task completion rates and trends"
        />
    );
}
