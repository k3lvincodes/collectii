import { PlaceholderPage } from '@/components/placeholder-page';
import { Activity } from 'lucide-react';

export default function WorkHoursPage() {
    return (
        <PlaceholderPage
            title="Work Hours"
            description="Track your working hours"
            icon={Activity}
            cardTitle="Work Hours Log"
            cardDescription="View your daily and weekly work hours"
        />
    );
}
