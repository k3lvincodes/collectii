
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { createClient } from "@/lib/supabase/client";
import { useOutletContext } from "react-router-dom";
import { format, subDays, isSameDay, parseISO } from 'date-fns';

interface ReportsPageContext {
  currentContext: {
    type: 'personal' | 'organization';
    orgId?: string;
  };
  user: any;
}

export default function ReportsPage() {
  const { currentContext, user } = useOutletContext<ReportsPageContext>();
  const [loading, setLoading] = useState(true);
  const [completionData, setCompletionData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [currentContext, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let teamIds: string[] = [];
      let teamsMap: Record<string, string> = {}; // id -> name
      let availableTeams: any[] = [];

      // 1. Fetch Teams based on context
      if (currentContext.type === 'organization' && currentContext.orgId) {
        const { data: orgTeams } = await supabase
          .from('teams')
          .select('id, name')
          .eq('organization_id', currentContext.orgId);

        if (orgTeams) {
          availableTeams = orgTeams;
          orgTeams.forEach(t => {
            teamIds.push(t.id);
            teamsMap[t.id] = t.name;
          });
        }
      } else {
        // Personal: Fetch teams user is a member of
        const { data: memberTeams } = await supabase
          .from('team_members')
          .select('team_id, teams(id, name)')
          .eq('user_id', user.id);

        if (memberTeams) {
          memberTeams.forEach((mt: any) => {
            if (mt.teams) {
              availableTeams.push(mt.teams);
              teamIds.push(mt.teams.id);
              teamsMap[mt.teams.id] = mt.teams.name;
            }
          });
        }
      }

      setTeams(availableTeams);

      if (teamIds.length === 0) {
        setCompletionData([]);
        setActivityData([]);
        setLoading(false);
        return;
      }

      // 2. Fetch Tasks for these teams
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, team_id, status, completed_at, created_at')
        .in('team_id', teamIds);

      if (!tasks) {
        setLoading(false);
        return;
      }

      // 3. Calculate Completion %
      // Group by team
      const teamStats: Record<string, { total: number, completed: number }> = {};
      teamIds.forEach(id => { teamStats[id] = { total: 0, completed: 0 } });

      tasks.forEach(task => {
        if (task.team_id && teamStats[task.team_id]) {
          teamStats[task.team_id].total++;
          if (task.status === 'done') {
            teamStats[task.team_id].completed++;
          }
        }
      });

      const calculatedCompletion = Object.keys(teamStats).map(teamId => ({
        team: teamsMap[teamId],
        completion: teamStats[teamId].total > 0
          ? Math.round((teamStats[teamId].completed / teamStats[teamId].total) * 100)
          : 0
      }));
      setCompletionData(calculatedCompletion);

      // 4. Calculate Activity (Last 7 Days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return d;
      });

      const activity = last7Days.map(date => {
        const dayStr = format(date, 'yyyy-MM-dd');
        const entry: any = { date: dayStr };

        // Initialize 0 for all teams
        availableTeams.forEach(t => entry[t.name] = 0);

        // Count completed tasks for this day
        tasks.forEach(task => {
          if (task.status === 'done' && task.completed_at && task.team_id) {
            const taskDate = parseISO(task.completed_at);
            if (isSameDay(taskDate, date)) {
              const teamName = teamsMap[task.team_id];
              if (teamName) {
                entry[teamName] = (entry[teamName] || 0) + 1;
              }
            }
          }
        });

        return entry;
      });

      setActivityData(activity);

    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate colors for lines
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F'];

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="container px-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Reports</h1>
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export (PDF/CSV)</Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-8 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Task Completion (%)</CardTitle>
                </CardHeader>
                <CardContent>
                  {completionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={completionData}>
                        <XAxis dataKey="team" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                        <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                        <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No team data available
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Activity (Tasks Completed per Day)</CardTitle>
                </CardHeader>
                <CardContent>
                  {activityData.length > 0 && teams.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                        <Legend wrapperStyle={{ fontSize: "14px" }} />
                        {teams.map((team, index) => (
                          <Line
                            key={team.id}
                            type="monotone"
                            dataKey={team.name}
                            stroke={colors[index % colors.length]}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No activity data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
