import { PlaceholderPage } from '@/components/placeholder-page';
import { Clock } from 'lucide-react';

export default function PendingTasksPage() {
    return (
        <PlaceholderPage
            title="Pending Tasks"
            description="Tasks awaiting action"
            icon={Clock}
            cardTitle="Pending Tasks"
            cardDescription="View tasks that need attention"
        />
    );
}
