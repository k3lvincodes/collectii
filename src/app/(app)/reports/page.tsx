import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';


const completionData = [
    { team: 'Engineering', completion: 85 },
    { team: 'Marketing', completion: 92 },
    { team: 'Product', completion: 78 },
    { team: 'Community', completion: 95 },
]

const activityData = [
  { date: '2024-07-01', Engineering: 30, Marketing: 20, Product: 25 },
  { date: '2024-07-02', Engineering: 35, Marketing: 22, Product: 28 },
  { date: '2024-07-03', Engineering: 40, Marketing: 18, Product: 30 },
  { date: '2024-07-04', Engineering: 25, Marketing: 25, Product: 22 },
  { date: '2024-07-05', Engineering: 38, Marketing: 28, Product: 35 },
  { date: '2024-07-06', Engineering: 42, Marketing: 30, Product: 32 },
  { date: '2024-07-07', Engineering: 32, Marketing: 26, Product: 29 },
];


export default function ReportsPage() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="container px-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Reports</h1>
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export (PDF/CSV)</Button>
          </div>

          <div className="grid gap-8 mt-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Team Task Completion (%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={completionData}>
                              <XAxis dataKey="team" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%"/>
                              <Tooltip cursor={{fill: 'hsl(var(--accent))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
                              <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>Team Activity (Tasks Completed per Day)</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={activityData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
                              <Legend wrapperStyle={{fontSize: "14px"}}/>
                              <Line type="monotone" dataKey="Engineering" stroke="#8884d8" />
                              <Line type="monotone" dataKey="Marketing" stroke="#82ca9d" />
                              <Line type="monotone" dataKey="Product" stroke="#ffc658" />
                          </LineChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>

          </div>
        </div>
      </main>
    </>
  );
}
