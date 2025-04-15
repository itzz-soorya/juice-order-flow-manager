
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Plus, Minus, Printer, ArrowLeft, X, Check, Clock } from "lucide-react";

const Order = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { 
    tables, 
    juices, 
    currentOrder, 
    selectTable, 
    createOrder, 
    addItemToOrder, 
    removeItemFromOrder,
    completeOrder,
    cancelOrder,
    selectedTable,
    markOrderDelivered,
    markOrderDelayed
  } = useShop();
  
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isOrderSent, setIsOrderSent] = useState(false);

  useEffect(() => {
    if (!tableId) {
      navigate("/tables");
      return;
    }
    
    selectTable(tableId);
    
    // If there's no existing order, create a new one
    if (!currentOrder && selectedTable) {
      createOrder(tableId);
    }
  }, [tableId, selectTable, currentOrder, createOrder, navigate, selectedTable]);

  if (!selectedTable) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-bold">Table not found</h2>
            <p className="text-muted-foreground mb-4">The selected table does not exist</p>
            <Button onClick={() => navigate("/tables")}>Back to Tables</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleQuantityChange = (juiceId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [juiceId]: Math.max(0, value) // Ensure quantity is not negative
    }));
  };

  const handleAddToOrder = (juiceId: string) => {
    const quantity = quantities[juiceId] || 1;
    if (quantity > 0) {
      addItemToOrder(juiceId, quantity);
      setQuantities(prev => ({
        ...prev,
        [juiceId]: 0 // Reset after adding
      }));
      toast({
        title: "Added to order",
        description: `Added ${quantity} item(s) to the order`,
      });
    }
  };

  const handlePrintOrder = () => {
    if (!currentOrder || currentOrder.items.length === 0) {
      toast({
        title: "Cannot print empty order",
        description: "Please add items to the order first",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Order sent to printer",
      description: "The order has been sent to the juice maker",
    });
    
    // In a real app, we would send the order to a printer or kitchen display system
    completeOrder();
    setIsOrderSent(true);
  };

  const handleCancelOrder = () => {
    cancelOrder();
    navigate("/tables");
  };

  const handleOrderDelivered = () => {
    markOrderDelivered();
    toast({
      title: "Order delivered",
      description: "Table is now available for new customers",
    });
    navigate("/tables");
  };

  const handleOrderDelayed = () => {
    markOrderDelayed();
    toast({
      title: "Order delayed",
      description: "The order has been marked as delayed",
      variant: "destructive",
    });
  };

  // Calculate total
  const total = currentOrder?.items.reduce((sum, item) => {
    const juice = juices.find(j => j.id === item.juiceId);
    return sum + (juice?.price || 0) * item.quantity;
  }, 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Order for Table {selectedTable.number} ({selectedTable.location})
            </h1>
            <p className="text-muted-foreground">
              Add juice items to the order
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/tables")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tables
          </Button>
        </div>

        {/* Order Status Buttons - Only shown after order is sent to juice maker */}
        {isOrderSent && (
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Update the status of this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  onClick={handleOrderDelivered} 
                  className="gap-2 flex-1"
                  variant="default"
                >
                  <Check className="h-4 w-4" />
                  Mark as Delivered
                </Button>
                <Button 
                  onClick={handleOrderDelayed} 
                  className="gap-2 flex-1"
                  variant="outline"
                >
                  <Clock className="h-4 w-4" />
                  Mark as Delayed
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Juice Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Juice Menu</CardTitle>
              <CardDescription>Select juices to add to the order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {juices.map(juice => (
                <div key={juice.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">{juice.name}</h3>
                    <p className="text-sm text-muted-foreground">₹{juice.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => handleQuantityChange(juice.id, (quantities[juice.id] || 0) - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantities[juice.id] || 0}
                        onChange={e => handleQuantityChange(juice.id, parseInt(e.target.value) || 0)}
                        className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => handleQuantityChange(juice.id, (quantities[juice.id] || 0) + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleAddToOrder(juice.id)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Order */}
          <Card>
            <CardHeader>
              <CardTitle>Current Order</CardTitle>
              <CardDescription>
                Items in the current order for Table {selectedTable.number}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentOrder && currentOrder.items.length > 0 ? (
                <div className="space-y-4">
                  {currentOrder.items.map(item => {
                    const juice = juices.find(j => j.id === item.juiceId);
                    if (!juice) return null;
                    
                    return (
                      <div key={item.juiceId} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <h3 className="font-medium">{juice.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x ₹{juice.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            ₹{(juice.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItemFromOrder(item.juiceId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between font-bold pt-4">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No items in the order yet. Add juices from the menu.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={handleCancelOrder}
              >
                Cancel Order
              </Button>
              <Button 
                onClick={handlePrintOrder}
                className="gap-2"
                disabled={!currentOrder || currentOrder.items.length === 0 || isOrderSent}
              >
                <Printer className="h-4 w-4" />
                Send to Juice Maker
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Order;
