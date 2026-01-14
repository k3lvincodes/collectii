import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { FileText, Image as ImageIcon, File, Download, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ProjectFile {
    id: string;
    name: string;
    file_type: string | null;
    size_bytes: number | null;
    url: string | null;
    created_at: string;
    uploaded_by: string;
    uploader?: { full_name: string }[] | null;
}

function formatFileSize(bytes: number | null): string {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProjectFilesView() {
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchFiles = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('project_files')
                .select(`
                    id, name, file_type, size_bytes, url, created_at, uploaded_by,
                    uploader:profiles(full_name)
                `)
                .order('created_at', { ascending: false });

            if (data) {
                setFiles(data as ProjectFile[]);
            }
            setLoading(false);
        };

        fetchFiles();
    }, []);

    const getIcon = (type: string | null) => {
        if (!type) return <File className="h-5 w-5 text-gray-500" />;
        if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
        if (type.includes('image') || type.includes('fig')) return <ImageIcon className="h-5 w-5 text-purple-500" />;
        if (type.includes('doc')) return <FileText className="h-5 w-5 text-blue-500" />;
        return <File className="h-5 w-5 text-gray-500" />;
    };

    const handleDownload = (file: ProjectFile) => {
        if (file.url) {
            window.open(file.url, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                <CardTitle>File Repository</CardTitle>
                <Button size="sm" variant="outline" disabled>
                    <Upload className="mr-2 h-4 w-4" /> Upload File
                </Button>
            </CardHeader>
            <CardContent className="px-0">
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-card">
                        <File className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No files uploaded yet.</p>
                        <p className="text-sm text-muted-foreground">Files will appear here when uploaded to projects.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[400px]">File Name</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-lg">
                                                {getIcon(file.file_type)}
                                            </div>
                                            <span className="font-medium text-sm">{file.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {formatFileSize(file.size_bytes)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {file.uploader?.[0]?.full_name || 'Unknown'}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(new Date(file.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => handleDownload(file)}
                                                disabled={!file.url}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
