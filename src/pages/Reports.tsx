
import { useShop } from "@/context/ShopContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock sales data for demonstration
const mockMonthlySales = [
  { month: "Jan", sales: 24500, profit: 12250 },
  { month: "Feb", sales: 27800, profit: 13900 },
  { month: "Mar", sales: 32400, profit: 16200 },
  { month: "Apr", sales: 29600, profit: 14800 },
  { month: "May", sales: 34500, profit: 17250 },
  { month: "Jun", sales: 37800, profit: 18900 },
];

// Mock juice sales data
const mockJuiceSales = [
  { name: "Orange Juice", sales: 2860, profit: 1430 },
  { name: "Apple Juice", sales: 2350, profit: 1175 },
  { name: "Mango Juice", sales: 3540, profit: 1770 },
  { name: "Pineapple Juice", sales: 1980, profit: 990 },
  { name: "Watermelon Juice", sales: 2160, profit: 1080 },
  { name: "Mixed Fruit Juice", sales: 3250, profit: 1625 },
  { name: "Grape Juice", sales: 1890, profit: 945 },
  { name: "Strawberry Juice", sales: 2480, profit: 1240 },
];

const Reports = () => {
  const { juices } = useShop();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Reports</h1>
          <p className="text-muted-foreground">
            View sales and profit data for your juice shop
          </p>
        </div>

        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly Performance</TabsTrigger>
            <TabsTrigger value="juice">Juice Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales and Profit</CardTitle>
                <CardDescription>
                  Overview of sales and profit for the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockMonthlySales}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`₹${value}`, ""]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="Total Sales" fill="#60A5FA" />
                      <Bar dataKey="profit" name="Total Profit" fill="#4ADE80" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
                <CardDescription>Key metrics for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">
                      Total Sales
                    </div>
                    <div className="text-2xl font-bold">₹37,800</div>
                    <div className="text-xs text-green-500">+8.7% from last month</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">
                      Total Profit
                    </div>
                    <div className="text-2xl font-bold">₹18,900</div>
                    <div className="text-xs text-green-500">+8.7% from last month</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm font-medium text-muted-foreground">
                      Profit Margin
                    </div>
                    <div className="text-2xl font-bold">50%</div>
                    <div className="text-xs text-muted-foreground">Consistent with target</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="juice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Juice Sales Performance</CardTitle>
                <CardDescription>
                  Sales and profit breakdown by juice type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockJuiceSales}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip
                        formatter={(value) => [`₹${value}`, ""]}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="Sales" fill="#A78BFA" />
                      <Bar dataKey="profit" name="Profit" fill="#F87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Juices</CardTitle>
                <CardDescription>Juices with the highest sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 bg-muted/50 p-4 font-medium">
                    <div className="col-span-4">Juice Name</div>
                    <div className="col-span-3">Price</div>
                    <div className="col-span-3">Total Sales</div>
                    <div className="col-span-2">Profit</div>
                  </div>
                  <div className="divide-y">
                    {mockJuiceSales
                      .sort((a, b) => b.sales - a.sales)
                      .slice(0, 5)
                      .map((juice, index) => (
                        <div key={index} className="grid grid-cols-12 items-center p-4">
                          <div className="col-span-4 font-medium">{juice.name}</div>
                          <div className="col-span-3">
                            ₹{juices.find(j => j.name === juice.name)?.price.toFixed(2) || "N/A"}
                          </div>
                          <div className="col-span-3">₹{juice.sales.toLocaleString()}</div>
                          <div className="col-span-2">₹{juice.profit.toLocaleString()}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
