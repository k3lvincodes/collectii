import { PlaceholderPage } from '@/components/placeholder-page';
import { Inbox } from 'lucide-react';

export default function AssignedPage() {
    return (
        <PlaceholderPage
            title="Assigned by Others"
            description="Tasks that have been delegated to you"
            icon={Inbox}
            cardTitle="Assigned Tasks"
            cardDescription="View tasks assigned to you by team members"
        />
    );
}
