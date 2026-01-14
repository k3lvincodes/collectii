import { PlaceholderPage } from '@/components/placeholder-page';
import { FileEdit } from 'lucide-react';

export default function NotesPage() {
    return (
        <PlaceholderPage
            title="Quick Notes"
            description="Jot down ideas and quick reminders"
            icon={FileEdit}
            cardTitle="Note Taking"
            cardDescription="Create and manage your personal notes"
        />
    );
}
