import { PlaceholderPage } from '@/components/placeholder-page';
import { Calendar } from 'lucide-react';

export default function SchedulePage() {
    return (
        <PlaceholderPage
            title="Today's Schedule"
            description="View and manage your daily schedule"
            icon={Calendar}
            cardTitle="Schedule View"
            cardDescription="Calendar integration and task scheduling"
        />
    );
}
