
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Juice } from "@/types";

const JuiceManagement = () => {
  const { juices, addJuice, updateJuice, deleteJuice } = useShop();
  const [editingJuice, setEditingJuice] = useState<Juice | null>(null);
  const [newJuice, setNewJuice] = useState<Omit<Juice, "id">>({
    name: "",
    price: 0,
    image: "",
  });

  const handleCreateJuice = () => {
    if (!newJuice.name.trim() || newJuice.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid juice name and price",
        variant: "destructive",
      });
      return;
    }

    addJuice(newJuice);
    
    setNewJuice({
      name: "",
      price: 0,
      image: "",
    });
    
    toast({
      title: "Juice Created",
      description: "The juice has been added to the menu",
    });
  };

  const handleUpdateJuice = () => {
    if (!editingJuice) return;
    
    if (!editingJuice.name.trim() || editingJuice.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid juice name and price",
        variant: "destructive",
      });
      return;
    }

    updateJuice(editingJuice.id, editingJuice);
    
    setEditingJuice(null);
    
    toast({
      title: "Juice Updated",
      description: "The juice has been updated in the menu",
    });
  };

  const handleDeleteJuice = (id: string) => {
    if (confirm("Are you sure you want to delete this juice from the menu?")) {
      deleteJuice(id);
      
      toast({
        title: "Juice Deleted",
        description: "The juice has been removed from the menu",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Juice Management</h1>
            <p className="text-muted-foreground">
              Add, update, or remove juices from the menu
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Juice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Juice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Juice Name</Label>
                  <Input
                    id="name"
                    value={newJuice.name}
                    onChange={(e) => setNewJuice({ ...newJuice, name: e.target.value })}
                    placeholder="Enter juice name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newJuice.price}
                    onChange={(e) => setNewJuice({ ...newJuice, price: Number(e.target.value) })}
                    placeholder="Enter price"
                    min="0"
                    step="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    value={newJuice.image || ""}
                    onChange={(e) => setNewJuice({ ...newJuice, image: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleCreateJuice}>Create Juice</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Juices Menu</CardTitle>
            <CardDescription>
              Currently serving {juices.length} varieties of juice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-muted/50 p-4 font-medium">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-6 text-right">Actions</div>
              </div>
              <div className="divide-y">
                {juices.map((juice) => (
                  <div key={juice.id} className="grid grid-cols-12 items-center p-4">
                    <div className="col-span-4 font-medium">{juice.name}</div>
                    <div className="col-span-2">₹{juice.price.toFixed(2)}</div>
                    <div className="col-span-6 flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingJuice(juice)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Juice</DialogTitle>
                          </DialogHeader>
                          {editingJuice && (
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Juice Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingJuice.name}
                                  onChange={(e) => setEditingJuice({ ...editingJuice, name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-price">Price (₹)</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={editingJuice.price}
                                  onChange={(e) => setEditingJuice({ ...editingJuice, price: Number(e.target.value) })}
                                  min="0"
                                  step="5"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-image">Image URL (Optional)</Label>
                                <Input
                                  id="edit-image"
                                  value={editingJuice.image || ""}
                                  onChange={(e) => setEditingJuice({ ...editingJuice, image: e.target.value })}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleUpdateJuice}>Update Juice</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteJuice(juice.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JuiceManagement;
