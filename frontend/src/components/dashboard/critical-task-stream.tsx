"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, ArrowUpRight } from "lucide-react"

interface Task {
    id: string;
    title: string;
    project: string;
    dueDate: string;
    priority: 'high' | 'urgent';
    status: 'pending' | 'completed';
}

interface CriticalTaskStreamProps {
    tasks: Task[];
}

export function CriticalTaskStream({ tasks }: CriticalTaskStreamProps) {
    return (
        <Card className="border-none shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] h-full bg-white rounded-[32px] relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0 p-8">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="bg-gray-50 p-2.5 rounded-xl">
                        <Calendar className="h-5 w-5 text-gray-900" />
                    </div>
                    Critical Tasks
                </CardTitle>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="relative min-h-[300px] p-8 pt-2">
                {/* Dashed Timeline Line */}
                <div className="absolute left-[70%] top-0 bottom-0 w-[2px] border-l-2 border-dashed border-gray-200" />

                {/* "Due Date" Indicator at top */}
                <div className="absolute right-8 top-0 text-xs font-bold text-gray-400 uppercase tracking-wider">Due Soon</div>

                <div className="space-y-6 relative">
                    {/* Task Item 1 - Floating Bento Pill */}
                    <div className="relative group">
                        <div className="bg-[#E0E7FF] rounded-[24px] p-4 pr-16 shadow-sm hover:shadow-md transition-all cursor-pointer w-[80%] ml-auto translate-x-4 relative z-20">
                            <div className="flex items-center gap-3 mb-2">
                                {/* Priority Badge */}
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shrink-0">
                                    <span className="text-indigo-600 font-bold text-xs">H</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-900 leading-tight">Finalize UI Design System</h4>
                                    <p className="text-xs text-indigo-600/80 font-medium">Playsole App • Today</p>
                                </div>
                            </div>
                        </div>
                        {/* Overflowing pill end effect / Status Action */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-gray-50 h-[80%] w-12 rounded-l-2xl rounded-r-none flex items-center justify-center">
                            {/* Check circle for "Mark Done" (One-Click Update) */}
                            <div className="h-6 w-6 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer group/check flex items-center justify-center bg-white" title="Mark Complete">
                                <div className="h-3 w-3 rounded-full bg-green-500 opacity-0 group-hover/check:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>

                    {/* Task Item 2 - Floating Bento Pill (Yellow) */}
                    <div className="relative group w-[75%]">
                        <div className="bg-[#FEF3C7] rounded-[24px] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative z-20">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h4 className="font-bold text-amber-900">Review API Specs</h4>
                                    <p className="text-xs text-amber-800/70 font-medium">Backend • Tomorrow</p>
                                </div>
                                <div className="flex gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-700 animate-pulse" />
                                </div>
                            </div>
                            <div className="absolute -bottom-3 right-4 bg-[#8B5CF6] text-white p-1.5 rounded-full shadow-sm z-30 cursor-pointer hover:scale-110 transition-transform" title="Update Status">
                                <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </div>
                    </div>

                    {/* Task Item 3 - Floating Bento Pill (Purple/Gray) */}
                    <div className="relative group w-[60%] ml-[30%] mt-8">
                        <div className="bg-[#F3F4F6] rounded-[24px] p-3 pl-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer relative z-20">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">M</div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Update User Profile</h4>
                                <p className="text-[10px] text-gray-500 font-medium">Thu, Dec 19</p>
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
