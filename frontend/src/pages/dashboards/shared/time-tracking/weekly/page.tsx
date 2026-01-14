import { PlaceholderPage } from '@/components/placeholder-page';
import { Calendar } from 'lucide-react';

export default function WeeklyBreakdownPage() {
    return (
        <PlaceholderPage
            title="Weekly Breakdown"
            description="Week-by-week time analysis"
            icon={Calendar}
            cardTitle="Weekly Time Report"
            cardDescription="Review your weekly time allocation"
        />
    );
}
