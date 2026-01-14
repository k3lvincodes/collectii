

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createTask } from '@/app/actions/tasks';
import { useNavigate } from 'react-router-dom';

export function AddTaskDialog() {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    // Append manually controlled fields
    if (deadline) formData.append('deadline', deadline.toISOString());
    // Selects usually don't emit name if not inside a native select, so ensure we capture them via name attribute on Select if supported or hidden input
    // Radix UI Select does not render a native select with name by default unless we use a hidden input. 
    // Let's assume the user fills them. BUT wait, Radix Select creates a hidden input if 'name' is provided to Select? 
    // No, it doesn't automatically. We should use state or Hidden Input.
    // Let's rely on event.currentTarget having the inputs if we name them?
    // Actually, providing `name` to Radix Select primitive adds a hidden input. 
    // So we just need to Add `name` prop to Select components.

    const result = await createTask(formData);

    setLoading(false);

    if (result.success) {
      toast({
        title: "Task Created",
        description: "The new task has been added to your list.",
      });
      setOpen(false);
      window.location.reload();
      // Reset form? Dialog unmounts so maybe fine, but better to reset states if we controlled them.
      setStartDate(undefined);
      setDeadline(undefined);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create task",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Task
              </Label>
              <Input id="title" name="title" placeholder="e.g. Design new homepage" className="col-span-3" required />
            </div>
            {/* 
                For Assignee and others, we mock the select for now as we don't have the list dynamically in this Client Component 
                unless we pass it as props or fetch it. 
                For MVP, let's leave Assignee empty or mock.
            */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Set priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" defaultValue="todo">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Date Pickers */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'col-span-3 justify-start text-left font-normal',
                      !deadline && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <input type="hidden" name="deadline" value={deadline ? deadline.toISOString() : ''} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

