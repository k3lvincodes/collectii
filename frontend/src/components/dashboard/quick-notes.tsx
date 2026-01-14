"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { cn } from "@/lib/utils" // Fixed import path

interface QuickNotesProps {
    initialNotes?: string
}

export function QuickNotes({ initialNotes = "" }: QuickNotesProps) {
    const [note, setNote] = useState(initialNotes)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = () => {
        setIsSaving(true)
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false)
        }, 1000)
    }

    return (
        <Card className="border-none shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] bg-[#FFF9C4] rounded-[32px] h-full relative overflow-hidden group flex flex-col transition-all hover:-translate-y-1">
            {/* "Post-it" Note Visual Style */}
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-8 z-10 relative">
                <div className="flex items-center gap-3">
                    <CardTitle className="text-xl font-bold text-yellow-900/80 font-handwriting">Quick Notes</CardTitle>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        className="h-10 w-10 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-900"
                    >
                        <Save className={cn("h-5 w-5", isSaving && "animate-pulse")} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-1 relative">
                <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Capture your thoughts..."
                    className="h-full w-full bg-transparent border-none resize-none focus-visible:ring-0 text-yellow-900 placeholder:text-yellow-900/40 text-lg leading-relaxed font-medium"
                />
            </CardContent>
            {/* Corner Fold Effect */}
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-yellow-600/10 rounded-tl-2xl" />
        </Card>
    )
}
