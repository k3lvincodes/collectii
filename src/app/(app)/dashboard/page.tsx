
'use client';

import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts';
import { ArrowUpRight, PlusCircle, BookOpen, ListTodo, Users, Bell, BarChart3, Megaphone, Activity, UsersRound } from "lucide-react";

const taskProgressData = [
  { name: 'Mon', tasks: 12 },
  { name: 'Tue', tasks: 19 },
  { name: 'Wed', tasks: 8 },
  { name: 'Thu', tasks: 22 },
  { name: 'Fri', tasks: 15 },
  { name: 'Sat', tasks: 7 },
  { name: 'Sun', tasks: 5 },
];

const taskStatusData = [
    { name: 'Completed', value: 400, color: 'hsl(var(--chart-2))' },
    { name: 'In Progress', value: 300, color: 'hsl(var(--chart-4))' },
    { name: 'Overdue', value: 50, color: 'hsl(var(--destructive))' },
    { name: 'Open', value: 200, color: 'hsl(var(--chart-1))' },
];

const recentActivity = [
    { user: 'Alex', action: 'completed task "Design new logo"', time: '2m ago' },
    { user: 'Samantha', 'action': 'posted a new announcement in "Marketing"', time: '1h ago' },
    { user: 'David', 'action': 'was added to the "Q4 Project" team', time: '3h ago' },
    { user: 'Maria', 'action': 'assigned task "Update pricing page" to you', time: '5h ago' },
];

export default function DashboardPage() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="container px-0 space-y-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <ListTodo className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">951</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Teams
                </CardTitle>
                <UsersRound className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                <Bell className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50</div>
                <p className="text-xs text-destructive">
                  -5.2% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73.4%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last week
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Tasks Completed This Week</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={taskProgressData}>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'hsl(var(--accent))'}} contentStyle={{backgroundColor: 'hsl(var(--background) / 0.8)', border: '1px solid hsl(var(--border))', backdropFilter: 'blur(4px)'}}/>
                    <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  What's been happening across your teams.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {recentActivity.map((activity, index) => (
                  <div className="flex items-start gap-4" key={index}>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">
                          <span className="font-semibold text-primary">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
              <Card>
                  <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                      <Button variant="outline" asChild>
                          <Link href="/tasks"><PlusCircle className="mr-2 h-4 w-4 text-primary"/> Add Task</Link>
                      </Button>
                      <Button variant="outline" asChild>
                          <Link href="/teams"><Users className="mr-2 h-4 w-4 text-primary"/> Manage Teams</Link>
                      </Button>
                      <Button variant="outline" asChild>
                          <Link href="/announcements"><Megaphone className="mr-2 h-4 w-4 text-primary"/> Post Announcement</Link>
                      </Button>
                      <Button variant="outline" asChild>
                          <Link href="/docs"><BookOpen className="mr-2 h-4 w-4 text-primary"/> View Docs</Link>
                      </Button>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle>Task Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                          <Pie
                              data={taskStatusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              innerRadius={50}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              paddingAngle={5}
                          >
                              {taskStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} className="stroke-background" />
                              ))}
                              <Label value={`${(taskStatusData.find(d => d.name === 'Completed')!.value / taskStatusData.reduce((acc, curr) => acc + curr.value, 0) * 100).toFixed(0)}%`} position="center" fill="hsl(var(--foreground))" className="text-2xl font-bold" />
                              <Label value="Completed" position="center" dy={20} fill="hsl(var(--muted-foreground))" className="text-sm" />
                          </Pie>
                          <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background) / 0.8)', border: '1px solid hsl(var(--border))', backdropFilter: 'blur(4px)'}}/>
                          </PieChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </div>
        </div>
      </main>
    </>
  );
}
