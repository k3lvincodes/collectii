import { PlaceholderPage } from '@/components/placeholder-page';
import { Star } from 'lucide-react';

export default function FavoriteTasksPage() {
    return (
        <PlaceholderPage
            title="Favorite Tasks"
            description="Your starred and important tasks"
            icon={Star}
            cardTitle="Favorite Tasks"
            cardDescription="Quick access to your most important tasks"
        />
    );
}
