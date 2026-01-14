import { PlaceholderPage } from '@/components/placeholder-page';
import { ClipboardList } from 'lucide-react';

export default function TimesheetPage() {
    return (
        <PlaceholderPage
            title="Timesheet"
            description="Your detailed timesheet records"
            icon={ClipboardList}
            cardTitle="Timesheet Management"
            cardDescription="View and edit your timesheet entries"
        />
    );
}
