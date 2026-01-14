import { PlaceholderPage } from '@/components/placeholder-page';
import { User } from 'lucide-react';

export default function DirectMessagesPage() {
    return (
        <PlaceholderPage
            title="Direct Messages"
            description="One-on-one conversations"
            icon={User}
            cardTitle="Direct Messaging"
            cardDescription="Chat directly with team members"
        />
    );
}
