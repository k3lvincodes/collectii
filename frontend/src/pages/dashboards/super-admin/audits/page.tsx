
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock Audit Data
const auditLogs = [
    { id: "log_1", action: "User Suspension", admin: "Sarah Admin", target: "Charlie Brown", date: "2024-01-15 14:30", details: "Violation of TOS" },
    { id: "log_2", action: "Plan Update", admin: "System", target: "Acme Corp", date: "2024-01-14 09:15", details: "Upgraded to Enterprise" },
    { id: "log_3", action: "Feature Flag Toggle", admin: "Mike Dev", target: "Global", date: "2024-01-13 18:45", details: "Enabled AI Beta" },
    { id: "log_4", action: "Org Approval", admin: "Sarah Admin", target: "Startup Inc", date: "2024-01-12 11:20", details: "Verified business docs" },
    { id: "log_5", action: "Login Failed", admin: "-", target: "admin@collectii.com", date: "2024-01-12 03:00", details: "Invalid password from 192.168.1.1" },
];

export default function AdminAuditsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLogs = auditLogs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Audit Logs</h1>
                    <p className="text-muted-foreground text-sm">Immutable record of administrative actions.</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search logs..."
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
                            <TableHead>Action</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <Badge variant="outline">{log.action}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{log.admin}</TableCell>
                                <TableCell>{log.target}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">{log.date}</TableCell>
                                <TableCell className="text-sm">{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
