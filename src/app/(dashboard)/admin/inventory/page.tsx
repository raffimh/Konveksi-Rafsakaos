"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  Package,
  Plus,
  AlertTriangle,
  TrendingUp,
  Search,
  Edit3,
  Trash2,
  BarChart3,
} from "lucide-react";

interface InventoryItem {
  id: string;
  created_at: string;
  updated_at: string;
  material_name: string;
  quantity: number;
  unit: string;
  minimum_stock: number;
  maximum_stock?: number;
  unit_cost: number;
  supplier_name?: string;
  supplier_contact?: string;
  last_reorder_date?: string;
  location?: string;
}

interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  recentMovements: number;
}

const inventorySchema = z.object({
  material_name: z.string().min(1, "Material name is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  minimum_stock: z.number().min(0, "Minimum stock must be positive"),
  maximum_stock: z.number().optional(),
  unit_cost: z.number().min(0, "Unit cost must be positive"),
  supplier_name: z.string().optional(),
  supplier_contact: z.string().optional(),
  location: z.string().optional(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    recentMovements: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const supabase = createClient();

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      material_name: "",
      quantity: 0,
      unit: "",
      minimum_stock: 0,
      unit_cost: 0,
      supplier_name: "",
      supplier_contact: "",
      location: "",
    },
  });

  useEffect(() => {
    loadInventoryData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.material_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [inventory, searchTerm]);

  const loadInventoryData = async () => {
    try {
      setIsLoading(true);

      // Load inventory items
      const { data: inventoryData } = await supabase
        .from("inventory")
        .select("*")
        .order("material_name");

      // Load recent stock movements
      const { count: recentMovementsCount } = await supabase
        .from("stock_movements")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (inventoryData) {
        setInventory(inventoryData);
        
        // Calculate stats
        const totalItems = inventoryData.length;
        const lowStockItems = inventoryData.filter(item => item.quantity <= item.minimum_stock).length;
        const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);

        setStats({
          totalItems,
          lowStockItems,
          totalValue,
          recentMovements: recentMovementsCount || 0,
        });
      }

    } catch (error) {
      console.error("Error loading inventory data:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: InventoryFormData) => {
    try {
      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from("inventory")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingItem.id);

        if (error) throw error;
        toast.success("Inventory item updated successfully");
      } else {
        // Create new item
        const { error } = await supabase
          .from("inventory")
          .insert([data]);

        if (error) throw error;
        toast.success("Inventory item added successfully");
      }

      loadInventoryData();
      setIsAddDialogOpen(false);
      setEditingItem(null);
      form.reset();
    } catch (error) {
      console.error("Error saving inventory item:", error);
      toast.error("Failed to save inventory item");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Inventory item deleted successfully");
      loadInventoryData();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item");
    }
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item);
    form.reset({
      material_name: item.material_name,
      quantity: item.quantity,
      unit: item.unit,
      minimum_stock: item.minimum_stock,
      maximum_stock: item.maximum_stock || undefined,
      unit_cost: item.unit_cost,
      supplier_name: item.supplier_name || "",
      supplier_contact: item.supplier_contact || "",
      location: item.location || "",
    });
    setIsAddDialogOpen(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minimum_stock) {
      return { status: "Low Stock", color: "bg-red-100 text-red-700 border-red-200" };
    }
    if (item.maximum_stock && item.quantity >= item.maximum_stock) {
      return { status: "Overstock", color: "bg-orange-100 text-orange-700 border-orange-200" };
    }
    return { status: "Normal", color: "bg-green-100 text-green-700 border-green-200" };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your material inventory and stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => {
                setEditingItem(null);
                form.reset();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="material_name"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Material Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter material name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input placeholder="pcs, meters, kg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="minimum_stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Stock</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Cost (IDR)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supplier_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supplier Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter supplier name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Storage location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingItem(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      {editingItem ? "Update" : "Add"} Item
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Items
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              <AnimatedCounter 
                end={stats.totalItems} 
                duration={1500}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Materials in inventory
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Low Stock Items
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              <AnimatedCounter 
                end={stats.lowStockItems} 
                duration={1200}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Need reordering
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Value
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              Rp <AnimatedCounter 
                end={stats.totalValue} 
                duration={2000}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Inventory valuation
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Recent Movements
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              <AnimatedCounter 
                end={stats.recentMovements} 
                duration={1000}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading inventory...
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No inventory items found
              </div>
            ) : (
              filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <div className="font-medium">{item.material_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.supplier_name && `Supplier: ${item.supplier_name}`}
                          {item.location && ` • Location: ${item.location}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {item.quantity} {item.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Min: {item.minimum_stock} {item.unit}
                        </div>
                      </div>
                      <Badge className={stockStatus.color}>
                        {stockStatus.status}
                      </Badge>
                      <div className="text-right">
                        <div className="font-medium">
                          Rp {item.unit_cost.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          per {item.unit}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/20"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950/20"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}