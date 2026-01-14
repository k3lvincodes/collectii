import { PlaceholderPage } from '@/components/placeholder-page';
import { UsersRound } from 'lucide-react';

export default function ProjectMembersPage() {
    return (
        <PlaceholderPage
            title="Project Members"
            description="Manage project team members"
            icon={UsersRound}
            cardTitle="Team Members"
            cardDescription="View and manage project collaborators"
        />
    );
}
