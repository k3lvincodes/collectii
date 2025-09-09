'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { runPrioritizeTasks } from '@/app/actions/ai';
import { tasks as mockTasks, teamMembers as mockTeamMembers } from '@/lib/mock-data';
import type { PrioritizeTasksOutput } from '@/ai/flows/ai-task-prioritization';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type TaskWithNewPriority = PrioritizeTasksOutput[0];

const priorityBadgeVariant = {
  high: 'destructive',
  medium: 'secondary',
  low: 'outline',
} as const;

export function TaskPrioritizer() {
  const [tasks, setTasks] = useState<TaskWithNewPriority[]>(
    mockTasks.map(t => ({ ...t, newPriority: t.priority }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePrioritize = async () => {
    setIsLoading(true);
    const result = await runPrioritizeTasks({
      tasks: mockTasks,
      teamMembers: mockTeamMembers,
    });

    if (result.success && result.data) {
      setTasks(result.data);
      toast({
        title: "Tasks Prioritized!",
        description: "AI has suggested new priorities for your tasks.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  const getPriorityChange = (task: TaskWithNewPriority) => {
    const priorityOrder = { low: 1, medium: 2, high: 3 };
    if (priorityOrder[task.newPriority] > priorityOrder[task.priority]) return 'increased';
    if (priorityOrder[task.newPriority] < priorityOrder[task.priority]) return 'decreased';
    return 'same';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Manage and prioritize your team's tasks.</CardDescription>
        </div>
        <Button onClick={handlePrioritize} disabled={isLoading}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Prioritizing...' : 'Prioritize with AI'}
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Original Priority</TableHead>
              <TableHead>AI Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const priorityChange = getPriorityChange(task);
              return (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>{mockTeamMembers.find(m => m.id === task.assignee)?.name}</TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell>
                  <Badge variant={priorityBadgeVariant[task.priority]}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {priorityChange !== 'same' && <ArrowRight className={cn("h-4 w-4", {
                      "text-green-500": priorityChange === 'increased',
                      "text-red-500": priorityChange === 'decreased',
                    })} />}
                    <Badge variant={priorityBadgeVariant[task.newPriority]}>{task.newPriority}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                    <Badge variant={task.status === 'completed' ? 'default' : 'secondary'} className={cn({'bg-green-700 text-white': task.status === 'completed' })}>{task.status}</Badge>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
