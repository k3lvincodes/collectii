import { PlaceholderPage } from '@/components/placeholder-page';
import { FolderOpen } from 'lucide-react';

export default function ProjectFilesPage() {
    return (
        <PlaceholderPage
            title="Project Files"
            description="Manage project documents and assets"
            icon={FolderOpen}
            cardTitle="File Management"
            cardDescription="Access and organize project files"
        />
    );
}
