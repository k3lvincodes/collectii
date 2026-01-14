import { PlaceholderPage } from '@/components/placeholder-page';
import { CheckCircle2 } from 'lucide-react';

export default function CompletedTasksPage() {
    return (
        <PlaceholderPage
            title="Completed Tasks"
            description="All your finished tasks"
            icon={CheckCircle2}
            cardTitle="Completed Tasks"
            cardDescription="Review your completed work"
        />
    );
}
