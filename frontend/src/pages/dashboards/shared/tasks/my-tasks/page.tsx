import { PlaceholderPage } from '@/components/placeholder-page';
import { User } from 'lucide-react';

export default function MyTasksPage() {
    return (
        <PlaceholderPage
            title="My Tasks"
            description="Tasks created and owned by you"
            icon={User}
            cardTitle="Personal Task List"
            cardDescription="View and manage your personal tasks"
        />
    );
}
