import { PlaceholderPage } from '@/components/placeholder-page';
import { Briefcase } from 'lucide-react';

export default function ActiveProjectsPage() {
    return (
        <PlaceholderPage
            title="Active Projects"
            description="Currently running projects"
            icon={Briefcase}
            cardTitle="Active Projects"
            cardDescription="Manage your active project portfolio"
        />
    );
}
