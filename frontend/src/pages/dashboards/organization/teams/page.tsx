
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, PlusCircle, UserPlus, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOutletContext } from "react-router-dom";
import { CreateTeamModal } from "@/components/modals/CreateTeamModal";
import { AddMemberModal } from "@/components/modals/AddMemberModal";
import { TeamDetailsModal } from "@/components/modals/TeamDetailsModal";

export default function TeamsPage() {
  const { currentContext } = useOutletContext<any>();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchTeams = async () => {
    if (currentContext.type !== 'organization' || !currentContext.orgId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
              *,
              lead:profiles!lead_id(full_name, avatar_url),
              members:team_members(count)
          `)
        .eq('organization_id', currentContext.orgId);

      if (error) throw error;

      // Map data to include member count properly
      const formattedTeams = data?.map(team => ({
        ...team,
        members: team.members?.[0]?.count || 0
      })) || [];

      setTeams(formattedTeams);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    checkUserRole();
  }, [currentContext]);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !currentContext.orgId) return;
    setCurrentUserId(user.id);

    // Check if user is org owner
    const { data: org } = await supabase
      .from('custom_organizations')
      .select('owner_id')
      .eq('id', currentContext.orgId)
      .single();

    if (org?.owner_id === user.id) {
      setIsOwnerOrAdmin(true);
      return;
    }

    // Check if user is org admin
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', currentContext.orgId)
      .eq('user_id', user.id)
      .single();

    setIsOwnerOrAdmin(['owner', 'admin'].includes(membership?.role || ''));
  };

  const handleTeamCreated = (newTeam: any) => {
    // Re-fetch to get proper relations
    fetchTeams();
  };

  const handleMemberAdded = () => {
    // Re-fetch to get updated member counts
    fetchTeams();
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="container px-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Teams</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddMemberModal(true)}>
                <UserPlus className="mr-2 h-4 w-4" /> {isOwnerOrAdmin ? 'Invite Member' : 'Recommend Member'}
              </Button>
              {isOwnerOrAdmin && (
                <Button onClick={() => setShowCreateTeamModal(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Team
                </Button>
              )}
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Departments & Groups</CardTitle>
              <CardDescription>Organize your members into teams.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Team Lead</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No teams found. Click "Add Team" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    teams.map((team: any) => (
                      <TableRow
                        key={team.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedTeam(team)}
                      >
                        <TableCell className="font-semibold">{team.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{team.members} Members</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {team.lead ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={team.lead.avatar_url} />
                                <AvatarFallback>{team.lead.full_name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{team.lead.full_name}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Manage Members</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Team Modal */}
      <CreateTeamModal
        open={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        organizationId={currentContext.orgId || ''}
        onSuccess={handleTeamCreated}
      />

      <AddMemberModal
        open={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        organizationId={currentContext.orgId || ''}
        teams={teams}
        onSuccess={handleMemberAdded}
        isOwnerOrAdmin={isOwnerOrAdmin}
      />

      {/* Team Details Modal */}
      <TeamDetailsModal
        open={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        team={selectedTeam}
        onMemberRemoved={fetchTeams}
      />
    </>
  );
}

