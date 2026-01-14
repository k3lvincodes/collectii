import { PlaceholderPage } from '@/components/placeholder-page';
import { FolderKanban } from 'lucide-react';

export default function ProjectDiscussionsPage() {
    return (
        <PlaceholderPage
            title="Project Discussions"
            description="Project-specific conversations"
            icon={FolderKanban}
            cardTitle="Project Chat"
            cardDescription="Discuss projects with your team"
        />
    );
}
