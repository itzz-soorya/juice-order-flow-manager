
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableLocation } from "@/types";
import { Coffee, Users, Clock } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tables, juices, orders } = useShop();

  // Calculate stats
  const totalTables = tables.length;
  const occupiedTables = tables.filter(table => table.status === 'Occupied').length;
  const freeTables = totalTables - occupiedTables;
  
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const totalJuices = juices.length;

  // Group tables by location for the admin view
  const tablesByLocation = tables.reduce((acc, table) => {
    const location = table.location;
    if (!acc[location]) {
      acc[location] = { total: 0, occupied: 0 };
    }
    acc[location].total += 1;
    if (table.status === 'Occupied') {
      acc[location].occupied += 1;
    }
    return acc;
  }, {} as Record<TableLocation, { total: number; occupied: number }>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {currentUser?.username}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening at Sadmonks Juice Shop today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTables}</div>
              <p className="text-xs text-muted-foreground">
                {freeTables} Free, {occupiedTables} Occupied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Juices Available</CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalJuices}</div>
              <p className="text-xs text-muted-foreground">
                Variety of fresh juices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders waiting to be served
              </p>
            </CardContent>
          </Card>
        </div>

        {currentUser?.role === "admin" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Table Status by Location</CardTitle>
              <CardDescription>
                Overview of table availability across different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(tablesByLocation).map(([location, data]) => (
                  <div key={location} className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div>
                      <p className="text-sm font-medium leading-none">{location}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.occupied} of {data.total} occupied
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-medium text-primary">
                        {Math.round((data.occupied / data.total) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
