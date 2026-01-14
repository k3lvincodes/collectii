import { PlaceholderPage } from '@/components/placeholder-page';
import { Calendar } from 'lucide-react';

export default function ProjectTimelinePage() {
    return (
        <PlaceholderPage
            title="Project Timeline"
            description="Visualize project schedules and milestones"
            icon={Calendar}
            cardTitle="Timeline View"
            cardDescription="Track project progress over time"
        />
    );
}
