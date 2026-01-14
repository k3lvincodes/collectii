
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Activity,
    Users,
    CreditCard,
    Building2,
    Shield,
    TrendingUp,
    AlertTriangle,
    Database,
    Server,
    ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
    const [healthData, setHealthData] = useState<any>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

                // Fetch System Health
                const healthRes = await fetch(`${apiUrl}/api/system/health`);
                if (healthRes.ok) setHealthData(await healthRes.json());

                // Fetch Metrics
                const metricsRes = await fetch(`${apiUrl}/api/system/metrics`);
                if (metricsRes.ok) setMetrics(await metricsRes.json());

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / (3600 * 24));
        if (days > 0) return `${days} days`;
        const hours = Math.floor(seconds / 3600);
        if (hours > 0) return `${hours} hours`;
        const mins = Math.floor(seconds / 60);
        return `${mins} mins`;
    };

    return (
        <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Platform Overview</h1>
                    <p className="text-muted-foreground mt-1">Pulse of the Product: Growth, Stability, and Revenue.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Download Report</Button>
                    <Button>System Diagnostics</Button>
                </div>
            </div>

            {/* Growth Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (MRR)</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics ? formatCurrency(metrics.mrr?.value || 0) : '...'}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span className={`${metrics?.mrr?.trendUp ? 'text-green-500' : 'text-red-500'} flex items-center mr-1`}>
                                <TrendingUp className={`h-3 w-3 mr-1 ${metrics?.mrr?.trendUp ? '' : 'rotate-180'}`} />
                                {metrics?.mrr?.trend || 0}%
                            </span>
                            from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.activeOrgs?.value || 0}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span className="text-green-500 flex items-center mr-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{metrics?.activeOrgs?.newCount || 0}
                            </span>
                            new this month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.users?.total?.toLocaleString() || 0}</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span className="text-green-500 flex items-center mr-1">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{metrics?.users?.newCount || 0}
                            </span>
                            new this month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.churn?.value?.toFixed(1) || 0}%</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span className={`${!metrics?.churn?.trendUp ? 'text-green-500' : 'text-red-500'} flex items-center mr-1`}>
                                <ArrowDownRight className={`h-3 w-3 mr-1 ${!metrics?.churn?.trendUp ? '' : 'rotate-180'}`} />
                                {metrics?.churn?.trend || 0}%
                            </span>
                            from last month
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* System Health Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>System Health Status</CardTitle>
                        <CardDescription>Real-time infrastructure monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-green-500/10 rounded-full">
                                        <Activity className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">API Uptime</p>
                                        <p className="text-sm text-muted-foreground">Since last restart</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-500">{healthData ? formatUptime(healthData.uptime) : 'Loading...'}</p>
                                    <p className="text-xs text-muted-foreground">Operational</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-full ${healthData?.db?.latency > 300 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                                        <Database className={`h-6 w-6 ${healthData?.db?.latency > 300 ? 'text-yellow-500' : 'text-green-500'}`} />
                                    </div>
                                    <div>
                                        <p className="font-medium">Database Latency</p>
                                        <p className="text-sm text-muted-foreground">Response time</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${healthData?.db?.latency > 300 ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {healthData ? `${healthData.db.latency}ms` : '...'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{healthData?.db?.status || 'Checking...'}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-green-500/10 rounded-full">
                                        <Server className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Storage Capacity</p>
                                        <p className="text-sm text-muted-foreground">Supabase DB</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-500">
                                        {healthData?.db?.size ? `${healthData.db.size}` : 'N/A'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {healthData?.db?.size ? 'Used' : 'Size Unavailable'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Global Alerts Feed */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Global Alerts</CardTitle>
                        <CardDescription>Recent system-wide notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-700 dark:text-red-400">High Error Rate Detected</p>
                                    <p className="text-xs text-muted-foreground mt-1">Spike in 500 errors on /api/webhooks/stripe. Investigating...</p>
                                    <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold">10 mins ago</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">New Admin Login</p>
                                    <p className="text-xs text-muted-foreground mt-1">Admin 'Sarah' logged in from new IP (London, UK).</p>
                                    <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold">1 hour ago</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-3 bg-muted rounded-lg border">
                                <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Scheduled Maintenance</p>
                                    <p className="text-xs text-muted-foreground mt-1">Database migration completed options successfully.</p>
                                    <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold">2 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
