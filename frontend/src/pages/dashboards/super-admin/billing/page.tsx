
import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Edit2, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
    if (url.endsWith('/api')) return url;
    return `${url}/api`;
};

const API_URL = getApiUrl();

export default function AdminBillingPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [loadingTx, setLoadingTx] = useState(true);
    const [loadingPlans, setLoadingPlans] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        features: "",
        popular: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTransactions();
        fetchPlans();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/transactions`);
            if (res.ok) {
                const data = await res.json();
                setTransactions(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error loading transactions:", error);
        } finally {
            setLoadingTx(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/plans`);
            if (res.ok) {
                const data = await res.json();
                setPlans(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error loading plans:", error);
        } finally {
            setLoadingPlans(false);
        }
    };

    const handleOpenModal = (plan?: any) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                description: plan.description || "",
                price: plan.price,
                features: Array.isArray(plan.features) ? plan.features.join("\n") : plan.features || "",
                popular: plan.popular || false
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: "",
                description: "",
                price: 0,
                features: "",
                popular: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                features: formData.features.split("\n").filter(f => f.trim() !== "")
            };

            let res;
            if (editingPlan) {
                res = await fetch(`${API_URL}/admin/plans/${editingPlan.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`${API_URL}/admin/plans`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                setIsModalOpen(false);
                fetchPlans(); // Refresh
            }
        } catch (error) {
            console.error("Error saving plan:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Billing & Subscriptions</h1>
                    <p className="text-muted-foreground text-sm">Manage pricing plans and view transaction logs.</p>
                </div>
            </div>

            <Tabs defaultValue="transactions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="transactions">Transaction Logs</TabsTrigger>
                    <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>
                                A log of all recent payment attempts on the platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User/Org</TableHead>
                                            <TableHead>Plan</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loadingTx ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                    Loading transactions...
                                                </TableCell>
                                            </TableRow>
                                        ) : transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                                    No transactions found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map((tx) => (
                                                <TableRow key={tx.id}>
                                                    <TableCell className="font-medium">{tx.user_org}</TableCell>
                                                    <TableCell>{tx.plan}</TableCell>
                                                    <TableCell>{tx.date}</TableCell>
                                                    <TableCell>{tx.amount}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={tx.status === 'success' ? 'default' : 'destructive'} className="capitalize">
                                                            {tx.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">View</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="plans" className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => handleOpenModal()}><Plus className="mr-2 h-4 w-4" /> Create New Plan</Button>
                    </div>

                    {loadingPlans ? (
                        <div className="text-center py-10">Loading plans...</div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-3">
                            {plans.map((plan) => (
                                <Card key={plan.id} className={plan.popular ? "border-primary shadow-sm" : ""}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>{plan.name}</CardTitle>
                                                <CardDescription>{plan.description}</CardDescription>
                                            </div>
                                            {plan.popular && <Badge>Most Popular</Badge>}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                                        <ul className="mt-4 space-y-2 text-sm">
                                            {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, idx: number) => (
                                                <li key={idx} className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> {feature}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant={plan.popular ? "default" : "outline"} onClick={() => handleOpenModal(plan)}>
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit Plan
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
                        <DialogDescription>
                            Configure the details of the pricing plan.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="col-span-3"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="features" className="text-right">Features</Label>
                                <Textarea
                                    id="features"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="col-span-3"
                                    placeholder="One feature per line"
                                    rows={5}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="popular" className="text-right">Popular</Label>
                                <div className="flex items-center space-x-2 col-span-3">
                                    <Switch
                                        id="popular"
                                        checked={formData.popular}
                                        onCheckedChange={(c) => setFormData({ ...formData, popular: c })}
                                    />
                                    <Label htmlFor="popular">Mark as Most Popular</Label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
