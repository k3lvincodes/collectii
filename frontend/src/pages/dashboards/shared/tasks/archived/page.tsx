import { PlaceholderPage } from '@/components/placeholder-page';
import { Archive } from 'lucide-react';

export default function ArchivedTasksPage() {
    return (
        <PlaceholderPage
            title="Archived Tasks"
            description="Previously archived tasks"
            icon={Archive}
            cardTitle="Archived Tasks"
            cardDescription="View your archived task history"
        />
    );
}
