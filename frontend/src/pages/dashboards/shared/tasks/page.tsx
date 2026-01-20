import { createClient } from '@/lib/supabase/client';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Loader2, MoreHorizontal, Calendar, MessageSquare, Paperclip } from "lucide-react";

import { CreateTaskModal } from "@/components/modals/CreateTaskModal";
import { TaskDetailModal } from "@/components/tasks/task-detail-modal";
import { format, isToday, isTomorrow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  assignee_id?: string;
  team_id?: string;
  organization_id?: string;
  team?: { name: string }[] | null;
  organization?: { name: string }[] | null;
  deliverables?: string[];
}

interface FormattedTask {
  id: string;
  title: string;
  project: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  progress: number;
  description: string;
}

export default function TasksPage() {
  const supabase = createClient();
  const navigate = useNavigate();
  const { contextSlug } = useParams();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [reviewTasks, setReviewTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Determine context type
  const [contextType, setContextType] = useState<'personal' | 'organization'>('personal');
  const [contextId, setContextId] = useState<string | undefined>(undefined);

  const formatDeadline = (deadline?: string): string => {
    if (!deadline) return 'No date';
    const date = new Date(deadline);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const mapPriority = (p: string): 'Low' | 'Medium' | 'High' => {
    if (p === 'high') return 'High';
    if (p === 'medium') return 'Medium';
    return 'Low';
  };

  const getProgress = (status: string): number => {
    if (status === 'todo') return 0;
    if (status === 'in_progress') return 50;
    if (status === 'review') return 80;
    return 100;
  };

  const formatTask = (task: Task): FormattedTask => ({
    id: task.id,
    title: task.title,
    project: task.team?.[0]?.name || task.organization?.[0]?.name || 'Personal',
    priority: mapPriority(task.priority),
    dueDate: formatDeadline(task.deadline),
    progress: getProgress(task.status),
    description: task.description || '',
  });

  const fetchTasks = async (currentUser: any, type: 'personal' | 'organization', id?: string) => {
    let query = supabase
      .from('tasks')
      .select(`
        id, title, description, status, priority, deadline, assignee_id, organization_id, deliverables,
        team:teams(name),
        organization:custom_organizations(name)
      `)
      .eq('assignee_id', currentUser.id)
      .neq('status', 'done')
      .order('deadline', { ascending: true });

    // Apply context filter
    if (type === 'organization' && id) {
      query = query.eq('organization_id', id);
    } else {
      // Personal context: only show tasks with NO organization
      query = query.is('organization_id', null);
    }

    const { data: myTasks } = await query;

    // Fetch tasks in review status (filtered similarly)
    let reviewQuery = supabase
      .from('tasks')
      .select(`
        id, title, description, status, priority, deadline, assignee_id, organization_id, deliverables,
        team:teams(name),
        organization:custom_organizations(name)
      `)
      .eq('status', 'review')
      .neq('assignee_id', currentUser.id)
      .order('deadline', { ascending: true })
      .limit(10);

    if (type === 'organization' && id) {
      reviewQuery = reviewQuery.eq('organization_id', id);
    } else {
      reviewQuery = reviewQuery.is('organization_id', null);
    }

    const { data: reviewData } = await reviewQuery;

    if (myTasks) {
      setActiveTasks(myTasks);
    }

    setAssignedTasks([]);

    if (reviewData) {
      setReviewTasks(reviewData);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/sign-in');
        return;
      }
      setUser(user);

      // Get profile to check username
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Determine context
      let currentType: 'personal' | 'organization' = 'personal';
      let currentId: string | undefined = undefined;

      if (contextSlug && profileData?.username !== contextSlug) {
        // It's an organization
        currentType = 'organization';
        currentId = contextSlug;
      }

      setContextType(currentType);
      setContextId(currentId);

      await fetchTasks(user, currentType, currentId);
      setLoading(false);
    };

    init();
  }, [navigate, contextSlug]);

  const handleTaskCreated = async () => {
    if (user) {
      await fetchTasks(user, contextType, contextId);
    }
  };

  const handleDelete = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this task?')) return;

    const response = await supabase.from('tasks').delete().eq('id', taskId);

    if (!response.error) {
      if (user) await fetchTasks(user, contextType, contextId);
    } else {
      console.error("Failed to delete task");
    }
  };

  const getProjectName = (t: Task) => t.team?.[0]?.name || t.organization?.[0]?.name || 'Personal';

  const filteredActive = activeTasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getProjectName(t).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssigned = assignedTasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getProjectName(t).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReview = reviewTasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getProjectName(t).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background flex flex-col">
      <div className="flex-1 p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto w-full space-y-3 sm:space-y-4 md:space-y-6">

        {/* Header Area */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">Manage your work, track progress, and collaborate.</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3">
              <Filter className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button size="sm" className="h-8 px-2 sm:px-3" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>

        {/* Smart Tabs System */}
        <Tabs defaultValue="active" className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
              <TabsList className="w-max sm:w-auto inline-flex">
                <TabsTrigger value="active" className="text-xs sm:text-sm px-2.5 sm:px-3">Active</TabsTrigger>
                <TabsTrigger value="assigned" className="text-xs sm:text-sm px-2.5 sm:px-3">Assigned</TabsTrigger>
                <TabsTrigger value="review" className="text-xs sm:text-sm px-2.5 sm:px-3">Review</TabsTrigger>
                <TabsTrigger value="drafts" className="text-xs sm:text-sm px-2.5 sm:px-3">Drafts</TabsTrigger>
              </TabsList>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-9 bg-background h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="active" className="space-y-3 sm:space-y-4">
            {filteredActive.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed rounded-lg bg-card">
                <p className="text-muted-foreground text-sm mb-4">No active tasks.</p>
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>Create Task</Button>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-2">
                  {filteredActive.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border rounded-lg bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">
                            {getProjectName(task).charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{getProjectName(task)}</p>
                          </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={(e) => handleDelete(e, task.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <Badge
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDeadline(task.deadline)}
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Progress value={getProgress(task.status)} className="h-1.5 w-12" />
                          <span className="text-[10px] text-muted-foreground">{getProgress(task.status)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[400px]">Task Name</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="w-[150px]">Progress</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActive.map((task) => (
                        <TableRow
                          key={task.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedTask(task)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                {getProjectName(task).charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">{task.title}</span>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> 2</span>
                                  <span className="flex items-center gap-1"><Paperclip className="h-3 w-3" /> 1</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">{getProjectName(task)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.priority === 'high' ? 'destructive' :
                                  task.priority === 'medium' ? 'secondary' : 'outline'
                              }
                            >
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDeadline(task.deadline)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={getProgress(task.status)} className="h-2" />
                              <span className="text-xs text-muted-foreground w-8 text-right">{getProgress(task.status)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTask(task);
                                }}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => handleDelete(e, task.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="assigned" className="space-y-3 sm:space-y-4">
            {filteredAssigned.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed rounded-lg bg-card">
                <p className="text-muted-foreground text-sm mb-4">No tasks assigned to you by others.</p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-2">
                  {filteredAssigned.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border rounded-lg bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">
                            {getProjectName(task).charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{getProjectName(task)}</p>
                          </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={(e) => handleDelete(e, task.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <Badge
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDeadline(task.deadline)}
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Progress value={getProgress(task.status)} className="h-1.5 w-12" />
                          <span className="text-[10px] text-muted-foreground">{getProgress(task.status)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[400px]">Task Name</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="w-[150px]">Progress</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssigned.map((task) => (
                        <TableRow
                          key={task.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedTask(task)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                {getProjectName(task).charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">{task.title}</span>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> 2</span>
                                  <span className="flex items-center gap-1"><Paperclip className="h-3 w-3" /> 1</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">{getProjectName(task)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.priority === 'high' ? 'destructive' :
                                  task.priority === 'medium' ? 'secondary' : 'outline'
                              }
                            >
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDeadline(task.deadline)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={getProgress(task.status)} className="h-2" />
                              <span className="text-xs text-muted-foreground w-8 text-right">{getProgress(task.status)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTask(task);
                                }}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => handleDelete(e, task.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="review" className="space-y-3 sm:space-y-4">
            {filteredReview.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed rounded-lg bg-card">
                <p className="text-muted-foreground text-sm mb-4">No tasks waiting for review.</p>
                <Button variant="outline" size="sm">View Archive</Button>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-2">
                  {filteredReview.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 border rounded-lg bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">
                            {getProjectName(task).charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{getProjectName(task)}</p>
                          </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={(e) => handleDelete(e, task.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <Badge
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDeadline(task.deadline)}
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <Progress value={getProgress(task.status)} className="h-1.5 w-12" />
                          <span className="text-[10px] text-muted-foreground">{getProgress(task.status)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[400px]">Task Name</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="w-[150px]">Progress</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReview.map((task) => (
                        <TableRow
                          key={task.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedTask(task)}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                {getProjectName(task).charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">{task.title}</span>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> 2</span>
                                  <span className="flex items-center gap-1"><Paperclip className="h-3 w-3" /> 1</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">{getProjectName(task)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.priority === 'high' ? 'destructive' :
                                  task.priority === 'medium' ? 'secondary' : 'outline'
                              }
                            >
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDeadline(task.deadline)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={getProgress(task.status)} className="h-2" />
                              <span className="text-xs text-muted-foreground w-8 text-right">{getProgress(task.status)}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTask(task);
                                }}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => handleDelete(e, task.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-3 sm:space-y-4">
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed rounded-lg bg-card">
              <p className="text-muted-foreground text-sm mb-4">You have no drafts.</p>
              <Button variant="outline" size="sm">Create Template</Button>
            </div>
          </TabsContent>
        </Tabs>

      </div>

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdate={() => {
          if (user) fetchTasks(user, contextType, contextId);
          setSelectedTask(null);
        }}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={showCreateModal || !!editingTask}
        userId={user?.id || ''}
        contextType={contextType}
        contextId={contextId}
        onClose={() => {
          setShowCreateModal(false);
          setEditingTask(null);
        }}
        onSuccess={() => {
          handleTaskCreated();
          setShowCreateModal(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />
    </div >
  );
}
