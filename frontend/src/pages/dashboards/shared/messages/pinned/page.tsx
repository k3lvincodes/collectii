import { PlaceholderPage } from '@/components/placeholder-page';
import { Star } from 'lucide-react';

export default function PinnedMessagesPage() {
    return (
        <PlaceholderPage
            title="Pinned Conversations"
            description="Your pinned important conversations"
            icon={Star}
            cardTitle="Pinned"
            cardDescription="Access your pinned conversations quickly"
        />
    );
}
