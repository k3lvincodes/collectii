import { PlaceholderPage } from '@/components/placeholder-page';
import { FileText } from 'lucide-react';

export default function ExportTimesheetPage() {
    return (
        <PlaceholderPage
            title="Export Timesheet"
            description="Download your time tracking data"
            icon={FileText}
            cardTitle="Timesheet Export"
            cardDescription="Export your timesheet in various formats"
        />
    );
}
