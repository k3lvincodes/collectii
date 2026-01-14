import { PlaceholderPage } from '@/components/placeholder-page';
import { ListTodo } from 'lucide-react';

export default function TaskCommentsPage() {
    return (
        <PlaceholderPage
            title="Task Comments"
            description="Comments on tasks and assignments"
            icon={ListTodo}
            cardTitle="Task Discussions"
            cardDescription="View task-related conversations"
        />
    );
}
