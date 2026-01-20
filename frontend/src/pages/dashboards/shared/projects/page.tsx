import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from 'lucide-react';
import { ProjectCardsGrid } from '@/components/projects/project-cards-grid';
import { ProjectTimelineView } from '@/components/projects/project-timeline-view';
import { ProjectFilesView } from '@/components/projects/project-files-view';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { format } from 'date-fns';

interface Project {
    id: string;
    name: string;
    description: string;
    progress: number;
    status: 'active' | 'on_hold' | 'completed' | 'archived';
    due_date: string | null;
    next_milestone: string | null;
    owner_id: string;
    organization_id: string | null;
}

interface FormattedProject {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: 'active' | 'on-hold' | 'completed';
    dueDate: string;
    nextMilestone: string;
    members: { name: string }[];
    color: string;
}

const PROJECT_COLORS = [
    'bg-indigo-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-purple-500',
    'bg-cyan-500',
];

export default function ProjectsPage() {
    const supabase = createClient();
    const navigate = useNavigate();
    const { contextSlug } = useParams();

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<FormattedProject[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [contextType, setContextType] = useState<'personal' | 'organization'>('personal');
    const [contextId, setContextId] = useState<string | undefined>(undefined);

    const formatProject = (project: Project, members: { name: string }[], index: number): FormattedProject => ({
        id: project.id,
        title: project.name,
        description: project.description || '',
        progress: project.progress || 0,
        status: project.status === 'on_hold' ? 'on-hold' : (project.status as any),
        dueDate: project.due_date ? format(new Date(project.due_date), 'MMM d, yyyy') : 'No date',
        nextMilestone: project.next_milestone || 'No milestone',
        members: members,
        color: PROJECT_COLORS[index % PROJECT_COLORS.length],
    });

    const fetchProjects = async (currentUser: any, type: 'personal' | 'organization', id?: string) => {
        // Fetch projects where user is owner or member, filtered by context
        let query = supabase
            .from('projects')
            .select('*')
            .eq('owner_id', currentUser.id)
            .neq('status', 'archived')
            .order('created_at', { ascending: false });

        if (type === 'organization' && id) {
            query = query.eq('organization_id', id);
        }

        const { data: ownedProjects } = await query;
        let allProjects = ownedProjects || [];

        // For member projects, we need to join project_members -> projects
        // AND apply the organization filter on the project itself.
        // This is complex with simple Supabase queries, so we fetch member projects first then filter.

        const { data: memberProjects } = await supabase
            .from('project_members')
            .select('project_id')
            .eq('user_id', currentUser.id);

        const memberProjectIds = memberProjects?.map(m => m.project_id) || [];

        if (memberProjectIds.length > 0) {
            let memberQuery = supabase
                .from('projects')
                .select('*')
                .in('id', memberProjectIds)
                .neq('status', 'archived');

            if (type === 'organization' && id) {
                memberQuery = memberQuery.eq('organization_id', id);
            }

            const { data: additionalProjects } = await memberQuery;

            if (additionalProjects) {
                // Merge without duplicates
                const existingIds = new Set(allProjects.map(p => p.id));
                additionalProjects.forEach(p => {
                    if (!existingIds.has(p.id)) {
                        allProjects.push(p);
                    }
                });
            }
        }

        // Fetch members for each project
        const formattedProjects: FormattedProject[] = [];
        for (let i = 0; i < allProjects.length; i++) {
            const project = allProjects[i];
            const { data: projectMembers } = await supabase
                .from('project_members')
                .select(`
                    user_id,
                    profile:profiles(full_name)
                `)
                .eq('project_id', project.id)
                .limit(5);

            const members = projectMembers?.map(pm => ({
                name: (pm.profile as any)?.full_name?.charAt(0) || 'U'
            })) || [];

            formattedProjects.push(formatProject(project, members, i));
        }

        setProjects(formattedProjects);
    };

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/sign-in');
                return;
            }
            setUser(user);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();

            setProfile(profileData);

            let currentType: 'personal' | 'organization' = 'personal';
            let currentId: string | undefined = undefined;

            if (contextSlug && profileData?.username !== contextSlug) {
                currentType = 'organization';
                currentId = contextSlug;
            }

            setContextType(currentType);
            setContextId(currentId);

            await fetchProjects(user, currentType, currentId);
            setLoading(false);
        };

        init();
    }, [navigate, contextSlug]);

    const handleProjectCreated = async () => {
        if (user) {
            await fetchProjects(user, contextType, contextId);
        }
    };

    const activeProjects = projects.filter(p => p.status === 'active');
    const onHoldProjects = projects.filter(p => p.status === 'on-hold');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background flex flex-col">
            <div className="flex-1 p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto w-full space-y-4 sm:space-y-6 md:space-y-8">

                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Projects</h1>
                        <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">Collaborate, track progress, and hit your milestones.</p>
                    </div>
                    <Button size="sm" className="h-8 px-2 sm:px-3 shrink-0" onClick={() => setShowCreateModal(true)}>
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">New Project</span>
                    </Button>
                </div>

                <Tabs defaultValue="active" className="space-y-3 sm:space-y-4 md:space-y-6">
                    <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
                        <TabsList className="w-max sm:w-auto inline-flex">
                            <TabsTrigger value="active" className="text-xs sm:text-sm px-2.5 sm:px-3">Active ({activeProjects.length})</TabsTrigger>
                            <TabsTrigger value="onhold" className="text-xs sm:text-sm px-2.5 sm:px-3">On Hold ({onHoldProjects.length})</TabsTrigger>
                            <TabsTrigger value="timeline" className="text-xs sm:text-sm px-2.5 sm:px-3">Timeline</TabsTrigger>
                            <TabsTrigger value="files" className="text-xs sm:text-sm px-2.5 sm:px-3">Files</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="active" className="space-y-3 sm:space-y-4 md:space-y-6">
                        {activeProjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed rounded-lg bg-card">
                                <p className="text-muted-foreground text-sm mb-4">No active projects.</p>
                                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(true)}>Create Project</Button>
                            </div>
                        ) : (
                            <ProjectCardsGrid projects={activeProjects} />
                        )}
                    </TabsContent>

                    <TabsContent value="onhold" className="space-y-3 sm:space-y-4 md:space-y-6">
                        {onHoldProjects.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed rounded-lg bg-card">
                                <p className="text-muted-foreground text-sm mb-4">No projects on hold.</p>
                            </div>
                        ) : (
                            <ProjectCardsGrid projects={onHoldProjects} />
                        )}
                    </TabsContent>

                    <TabsContent value="timeline" className="space-y-3 sm:space-y-4 md:space-y-6">
                        <ProjectTimelineView />
                    </TabsContent>

                    <TabsContent value="files" className="space-y-3 sm:space-y-4 md:space-y-6">
                        <ProjectFilesView />
                    </TabsContent>
                </Tabs>
            </div>

            <CreateProjectModal
                open={showCreateModal}
                userId={user?.id || ''}
                contextType={contextType}
                contextId={contextId}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleProjectCreated}
            />
        </div>
    );
}
