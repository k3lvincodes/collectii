import { PlaceholderPage } from '@/components/placeholder-page';
import { Calendar } from 'lucide-react';

export default function MonthlyBreakdownPage() {
    return (
        <PlaceholderPage
            title="Monthly Breakdown"
            description="Month-by-month time analysis"
            icon={Calendar}
            cardTitle="Monthly Time Report"
            cardDescription="Review your monthly time allocation"
        />
    );
}
