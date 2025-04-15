
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableLocation } from "@/types";

const Tables = () => {
  const { tables, selectTable } = useShop();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TableLocation>("Garden");

  const handleTableClick = (tableId: string) => {
    selectTable(tableId);
    navigate(`/order/${tableId}`);
  };

  // Group tables by location
  const locations: TableLocation[] = ["Garden", "AC Room", "Balcony", "Pond", "Terrace", "Parcel"];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Table Management</h1>
          <p className="text-muted-foreground">
            Select a table to place or manage orders
          </p>
        </div>

        <Tabs defaultValue="Garden" onValueChange={(value) => setActiveTab(value as TableLocation)}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            {locations.map((location) => (
              <TabsTrigger key={location} value={location}>
                {location}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {locations.map((location) => (
            <TabsContent key={location} value={location}>
              <Card>
                <CardHeader>
                  <CardTitle>{location} Tables</CardTitle>
                  <CardDescription>
                    {tables.filter(t => t.location === location && t.status === 'Occupied').length} of 10 tables occupied
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {tables
                      .filter(table => table.location === location)
                      .map(table => (
                        <Button 
                          key={table.id}
                          onClick={() => handleTableClick(table.id)}
                          variant={table.status === 'Occupied' ? "destructive" : "default"}
                          className="h-24 text-lg font-bold"
                        >
                          Table {table.number}
                          <div className="text-xs mt-1 font-normal">
                            {table.status}
                          </div>
                        </Button>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Tables;
