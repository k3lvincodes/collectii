
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MoreHorizontal,
    Search,
    Building2,
    Ban,
    CheckCircle,
    FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    if (url.endsWith('/api')) return url;
    return `${url}/api`;
};

const API_URL = getApiUrl();

export default function AdminOrganizationsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [orgs, setOrgs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/organizations`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setOrgs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error loading organizations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrgs();
    }, []);

    const filteredOrgs = orgs.filter(org =>
        org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.owner?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Organization Management</h1>
                    <p className="text-muted-foreground text-sm">Manage companies, subscriptions, and lifecycle.</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search organizations..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Organization</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Users</TableHead>
                            <TableHead>MRR</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    Loading organizations...
                                </TableCell>
                            </TableRow>
                        ) : filteredOrgs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No organizations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrgs.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-md">
                                                <Building2 className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-0.5">
                                                <p className="text-sm font-medium leading-none">{org.name}</p>
                                                <p className="text-xs text-muted-foreground">Owner: {org.owner}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {org.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{org.users}</TableCell>
                                    <TableCell>{org.mrr}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={org.status === 'active' ? 'default' : org.status === 'suspended' ? 'destructive' : 'secondary'}
                                            className="capitalize"
                                        >
                                            {org.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <FileText className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve/Verify
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Ban className="mr-2 h-4 w-4" /> Suspend Org
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
