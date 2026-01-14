import { PlaceholderPage } from '@/components/placeholder-page';
import { Bell } from 'lucide-react';

export default function RemindersPage() {
    return (
        <PlaceholderPage
            title="Reminders & Deadlines"
            description="Never miss an important deadline"
            icon={Bell}
            cardTitle="Reminder System"
            cardDescription="Manage your reminders and upcoming deadlines"
        />
    );
}
