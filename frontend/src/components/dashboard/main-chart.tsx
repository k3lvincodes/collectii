import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    { name: 'May', uv: 4000, pv: 2400 },
    { name: 'Jun', uv: 3000, pv: 1398 },
    { name: 'Jul', uv: 2000, pv: 9800 },
    { name: 'Aug', uv: 2780, pv: 3908 },
    { name: 'Sep', uv: 1890, pv: 4800 },
    { name: 'Oct', uv: 2390, pv: 3800 },
    { name: 'Nov', uv: 3490, pv: 4300 },
    { name: 'Dec', uv: 2000, pv: 5800 },
    { name: 'Jan', uv: 2780, pv: 3908 },
    { name: 'Feb', uv: 1890, pv: 4800 },
    { name: 'Mar', uv: 2390, pv: 3800 },
    { name: 'Apr', uv: 3490, pv: 4300 },
];

export function MainChart() {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Task Done</CardTitle>
                    <Tabs defaultValue="monthly" className="w-auto">
                        <TabsList className="h-8">
                            <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
                            <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            {/* <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /> */}
                            {/* <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /> */}
                            <Tooltip />
                            <Area type="monotone" dataKey="uv" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
                            <Area type="monotone" dataKey="pv" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPv)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-muted-foreground">Team A</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-muted-foreground">Team B</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
