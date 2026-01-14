"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, MoveUpRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface PerformanceScorecardProps {
    score: number;
    metrics: {
        onTime: number;
        consistency: number;
        peerReviews: number;
    };
    trend: number;
    trendDirection: 'up' | 'down';
}

export function PerformanceScorecard({
    score,
    metrics,
    trend,
    trendDirection
}: PerformanceScorecardProps) {
    const isUp = trendDirection === 'up';

    return (
        <Card className="h-full bg-white rounded-[32px] border-none shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 p-8">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <TrendingUp className="h-6 w-6 text-gray-900" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Performance Score</CardTitle>
                </div>
                <div className="flex gap-2">
                    <button className="h-10 w-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                        <MoveUpRight className="h-5 w-5" />
                    </button>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-2">
                <div className="flex flex-col gap-6 relative z-10">

                    {/* Big Score Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-sm font-bold shadow-sm",
                                isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                                {isUp ? '▲' : '▼'} {trend}%
                            </span>
                            <span className="text-gray-500 font-medium">vs last month</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[5rem] leading-none font-bold text-gray-900 tracking-tighter">{score}</span>
                            <span className="text-xl text-gray-400 font-medium ml-2">/ 100</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Top 10% in Consistency.</p>
                    </div>

                    {/* Footer Metrics - Specific to Performance */}
                    <div className="flex gap-3 mt-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-[#111827] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-black/20">
                            <Clock className="w-4 h-4" /> {metrics.onTime}% On-Time
                        </div>
                        <div className="flex items-center gap-2 bg-[#F3F4F6] text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium">
                            <TrendingUp className="w-4 h-4" /> {metrics.consistency}% Consistency
                        </div>
                    </div>
                </div>

                {/* Background Chart Visualization */}
                <div className="absolute right-8 bottom-8 flex items-end gap-3 h-40 opacity-90 pointer-events-none">
                    {[45, 60, 75, 50, 85, 65, 90].map((height, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            {i === 6 && <div className="text-xs font-bold bg-gray-900 text-white px-2 py-0.5 rounded-full mb-1">Today</div>}
                            <div
                                className={cn(
                                    "w-8 md:w-10 rounded-[20px] transition-all duration-500",
                                    i === 6 ? "bg-gray-900 shadow-xl" : "bg-gray-50"
                                )}
                                style={{ height: `${height * 1.2}%` }}
                            >
                                {/* Stripe pattern for inactive */}
                                {i !== 6 && (
                                    <div className="w-full h-full opacity-[0.05] bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)]" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
