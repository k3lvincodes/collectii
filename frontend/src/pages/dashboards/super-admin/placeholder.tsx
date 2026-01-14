
import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function AdminPlaceholderPage() {
    const location = useLocation();
    const pageName = location.pathname.split("/").pop()?.replace(/-/g, " ") || "Page";

    // Capitalize first letter of each word
    const title = pageName.replace(/\b\w/g, (l) => l.toUpperCase());

    return (
        <div className="flex flex-1 flex-col items-center justify-center h-full p-4 text-center space-y-4">
            <div className="bg-muted/30 p-6 rounded-full">
                <Construction className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground max-w-[500px]">
                    This page is currently under development. Check back soon for updates.
                </p>
            </div>
            <div className="text-xs text-muted-foreground/30 font-mono mt-8">
                Route: {location.pathname}
            </div>
        </div>
    );
}
