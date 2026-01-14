import { PlaceholderPage } from '@/components/placeholder-page';
import { FileEdit } from 'lucide-react';

export default function DraftTasksPage() {
    return (
        <PlaceholderPage
            title="Draft Tasks"
            description="Unfinished task drafts"
            icon={FileEdit}
            cardTitle="Draft Tasks"
            cardDescription="Continue editing your draft tasks"
        />
    );
}
