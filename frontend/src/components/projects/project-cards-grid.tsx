import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: 'active' | 'completed' | 'on-hold';
    dueDate: string;
    nextMilestone: string;
    members: { name: string; avatar?: string }[];
    color: string; // e.g., "bg-blue-500"
}

interface ProjectCardsGridProps {
    projects: Project[];
}

export function ProjectCardsGrid({ projects }: ProjectCardsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow border-none shadow ring-1 ring-border">
                    <div className={`h-2 ${project.color}`} />
                    <CardHeader className="pb-2 pt-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg">{project.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Due {project.dueDate}</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                                <span>Progress</span>
                                <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-1.5" />
                        </div>

                        <div className="bg-muted/50 p-2 rounded text-xs">
                            <span className="font-medium text-primary">Next Milestone:</span> {project.nextMilestone}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4 flex justify-between items-center">
                        <div className="flex -space-x-2">
                            {project.members.map((member, i) => (
                                <Avatar key={i} className="h-7 w-7 border-2 border-background ring-1 ring-border">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback className="text-[10px]">{member.name[0]}</AvatarFallback>
                                </Avatar>
                            ))}
                            {project.members.length > 3 && (
                                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background ring-1 ring-border">
                                    +{project.members.length - 3}
                                </div>
                            )}
                        </div>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                            {project.status.replace('-', ' ')}
                        </Badge>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
