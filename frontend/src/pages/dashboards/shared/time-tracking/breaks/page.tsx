import { PlaceholderPage } from '@/components/placeholder-page';
import { Clock } from 'lucide-react';

export default function BreakLogsPage() {
    return (
        <PlaceholderPage
            title="Break Logs"
            description="Track your break times"
            icon={Clock}
            cardTitle="Break Management"
            cardDescription="Monitor your rest periods and breaks"
        />
    );
}
