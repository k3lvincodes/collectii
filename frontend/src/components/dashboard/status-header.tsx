"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusHeaderProps {
    userName: string
}

export function StatusHeader({ userName }: StatusHeaderProps) {
    const [status, setStatus] = useState<'online' | 'away' | 'dnd' | 'busy'>('online');
    const [viewDate, setViewDate] = useState<'today' | 'tomorrow'>('today');

    const statusConfig = {
        online: { label: 'Online', color: 'bg-green-500' },
        away: { label: 'Away', color: 'bg-yellow-500' },
        dnd: { label: 'Do Not Disturb', color: 'bg-red-500' },
        busy: { label: 'Busy', color: 'bg-orange-500' },
    };

    return (
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground text-lg font-medium">Hello,</span>
                    <span className="text-[#0A0D14] text-lg font-bold">{userName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <h1 className="text-5xl lg:text-7xl font-bold font-headline tracking-tighter text-[#0A0D14]">
                        {viewDate === 'today' ? "Today's Focus" : "Tomorrow's Plan"}
                    </h1>
                    {/* Quick Date Switcher - Bento Pill Style */}
                    <div className="bg-white p-1 rounded-full border border-gray-200 flex items-center shadow-sm w-fit">
                        <button
                            onClick={() => setViewDate('today')}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                                viewDate === 'today' ? "bg-[#0A0D14] text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setViewDate('tomorrow')}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
                                viewDate === 'tomorrow' ? "bg-[#0A0D14] text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            Tomorrow
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {/* Status Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-white hover:bg-gray-50 text-sm font-medium px-5 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 transition-all outline-none ring-offset-2 focus:ring-2 ring-gray-200">
                        <span className={cn("h-2.5 w-2.5 rounded-full", statusConfig[status].color)} />
                        {statusConfig[status].label}
                        <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-gray-100 shadow-xl p-2 w-48">
                        <DropdownMenuItem className="rounded-xl cursor-pointer py-2" onClick={() => setStatus('online')}>
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2" /> Online
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer py-2" onClick={() => setStatus('away')}>
                            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" /> Away
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer py-2" onClick={() => setStatus('dnd')}>
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2" /> Do Not Disturb
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer py-2" onClick={() => setStatus('busy')}>
                            <span className="h-2 w-2 rounded-full bg-orange-500 mr-2" /> Busy
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Create New Button */}
                <Button className="bg-[#0A0D14] hover:bg-black/80 text-white rounded-full px-8 py-7 shadow-xl shadow-black/10 transition-all hover:scale-105 active:scale-95">
                    <span className="mr-2 text-2xl font-light">+</span> <span className="text-base font-medium">Create New</span>
                </Button>
            </div>
        </div>
    )
}
