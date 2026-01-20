
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Loader2, BarChart3 } from "lucide-react";
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
        const dayStr = format(date, 'MMM d'); // Shorter format for mobile
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
        <div className="container px-0 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold font-headline">Reports</h1>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 sm:px-4"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export (PDF/CSV)</span>
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {/* Team Task Completion Chart */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Team Task Completion</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Percentage of completed tasks by team</CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-6 pt-0 sm:pt-0">
                  {completionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220} className="sm:!h-[300px]">
                      <BarChart data={completionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <XAxis
                          dataKey="team"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          unit="%"
                          width={35}
                        />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--accent))' }}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            fontSize: '12px',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] text-center">
                      <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground text-sm">No team data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team Activity Chart */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Team Activity</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Tasks completed per day (last 7 days)</CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-6 pt-0 sm:pt-0">
                  {activityData.length > 0 && teams.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={220} className="sm:!h-[300px]">
                        <LineChart data={activityData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={10}
                            tickLine={false}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={10}
                            tickLine={false}
                            width={25}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              fontSize: '12px',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend
                            wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }}
                            iconSize={8}
                          />
                          {teams.map((team, index) => (
                            <Line
                              key={team.id}
                              type="monotone"
                              dataKey={team.name}
                              stroke={colors[index % colors.length]}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                      {/* Mobile Legend Enhancement */}
                      <div className="grid grid-cols-2 gap-2 mt-4 sm:hidden">
                        {teams.map((team, index) => (
                          <div key={team.id} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span className="text-xs text-muted-foreground truncate">{team.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] text-center">
                      <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground text-sm">No activity data available</p>
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

