
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
import { MoreHorizontal, PlusCircle, UserPlus, Loader2, Users, User, ChevronRight } from "lucide-react";
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
    // If Organization context
    if (currentContext.type === 'organization' && currentContext.orgId) {
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
    }
    // If Personal context - fetch teams user is a member of
    else if (currentContext.type === 'personal') {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch team IDs first
        const { data: memberships } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('user_id', user.id);

        const teamIds = memberships?.map(m => m.team_id) || [];

        if (teamIds.length === 0) {
          setTeams([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('teams')
          .select(`
                      *,
                      lead:profiles!lead_id(full_name, avatar_url),
                      members:team_members(count)
                  `)
          .in('id', teamIds);

        if (error) throw error;

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
        <div className="container px-0 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold font-headline">Teams</h1>
            <div className="flex gap-2">
              {currentContext.type === 'organization' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 sm:px-4"
                  onClick={() => setShowAddMemberModal(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">
                    {isOwnerOrAdmin ? 'Invite Member' : 'Recommend'}
                  </span>
                </Button>
              )}
              {isOwnerOrAdmin && (
                <Button
                  size="sm"
                  className="h-9 px-3 sm:px-4"
                  onClick={() => setShowCreateTeamModal(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Add Team</span>
                </Button>
              )}
            </div>
          </div>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Departments & Groups</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Organize your members into teams.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              {teams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-sm sm:text-base">No teams found.</p>
                  {isOwnerOrAdmin && (
                    <p className="text-muted-foreground/70 text-xs sm:text-sm mt-1">Click "Add Team" to create one.</p>
                  )}
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="block sm:hidden space-y-3">
                    {teams.map((team: any) => (
                      <div
                        key={team.id}
                        className="bg-muted/50 rounded-lg p-4 cursor-pointer hover:bg-muted/70 transition-colors"
                        onClick={() => setSelectedTeam(team)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">{team.name}</h3>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{team.members} members</span>
                              </div>
                            </div>
                            {team.lead && (
                              <div className="flex items-center gap-2 mt-3">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={team.lead.avatar_url} />
                                  <AvatarFallback className="text-[10px]">
                                    {team.lead.full_name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  Lead: {team.lead.full_name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8">
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
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team Name</TableHead>
                          <TableHead>Members</TableHead>
                          <TableHead>Team Lead</TableHead>
                          <TableHead className="w-[60px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teams.map((team: any) => (
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
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
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
        onSuccess={() => {
          fetchTeams();
        }}
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
