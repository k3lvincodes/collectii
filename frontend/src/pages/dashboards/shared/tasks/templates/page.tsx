import { PlaceholderPage } from '@/components/placeholder-page';
import { ClipboardList } from 'lucide-react';

export default function TaskTemplatesPage() {
    return (
        <PlaceholderPage
            title="Task Templates"
            description="Reusable task templates"
            icon={ClipboardList}
            cardTitle="Task Templates"
            cardDescription="Create and manage task templates for recurring work"
        />
    );
}
