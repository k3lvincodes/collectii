import { AppHeader } from "@/components/app-header";
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
import { MoreHorizontal, PlusCircle, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const teams = [
    { name: 'Engineering', members: 5, lead: 'Alice' },
    { name: 'Marketing', members: 3, lead: 'Bob' },
    { name: 'Product', members: 4, lead: 'Charlie' },
    { name: 'Community', members: 2, lead: 'David' },
]

export default function TeamsPage() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Teams</h1>
          <div className="flex gap-2">
            <Button variant="outline"><UserPlus className="mr-2 h-4 w-4"/> Add Member</Button>
            <Button><PlusCircle className="mr-2 h-4 w-4"/> Add Team</Button>
          </div>
        </div>
        
        <Card>
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
                        {teams.map(team => (
                            <TableRow key={team.name}>
                                <TableCell className="font-semibold">{team.name}</TableCell>
                                <TableCell>
                                    <div className="flex -space-x-2">
                                        {Array.from({length: team.members}).map((_, i) => (
                                            <Avatar key={i} className="border-2 border-background">
                                                <AvatarImage src={`https://i.pravatar.cc/40?u=${team.name}${i}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{team.lead}</TableCell>
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </main>
    </>
  );
}
