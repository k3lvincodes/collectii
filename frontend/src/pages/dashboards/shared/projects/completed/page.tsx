import { PlaceholderPage } from '@/components/placeholder-page';
import { CheckCircle2 } from 'lucide-react';

export default function CompletedProjectsPage() {
    return (
        <PlaceholderPage
            title="Completed Projects"
            description="Successfully finished projects"
            icon={CheckCircle2}
            cardTitle="Completed Projects"
            cardDescription="Review your project history"
        />
    );
}
