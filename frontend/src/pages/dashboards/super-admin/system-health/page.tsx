import { PlaceholderPage } from '@/components/placeholder-page';
import { Activity } from 'lucide-react';

export default function AdminSystemHealthPage() {
    return (
        <PlaceholderPage
            title="System Health"
            description="Monitor platform performance and uptime"
            icon={Activity}
            cardTitle="System Monitoring"
            cardDescription="Track system health, errors, and performance metrics"
        />
    );
}
