import { PlaceholderPage } from '@/components/placeholder-page';
import { Settings } from 'lucide-react';

export default function MessageSettingsPage() {
    return (
        <PlaceholderPage
            title="Message Settings"
            description="Configure messaging preferences"
            icon={Settings}
            cardTitle="Settings"
            cardDescription="Manage your messaging settings"
        />
    );
}
