import { PlaceholderPage } from '@/components/placeholder-page';
import { Bell } from 'lucide-react';

export default function UnreadMessagesPage() {
    return (
        <PlaceholderPage
            title="Unread Messages"
            description="Messages you haven't read yet"
            icon={Bell}
            cardTitle="Unread"
            cardDescription="Catch up on unread messages"
        />
    );
}
