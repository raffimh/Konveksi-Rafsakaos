"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArchivedOrdersDataTable } from "@/components/orders/archived-orders-data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Archive, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Order {
  id: string;
  created_at: string;
  customer_id: string;
  material: string;
  quantity: number;
  design_url: string;
  design_description: string;
  total_amount: number;
  unique_code: number;
  status: 'menunggu_pembayaran' | 'diproses' | 'produksi' | 'selesai';
  estimated_completion_days?: number;
  is_paid: boolean;
  archived: boolean;
  profiles: {
    display_name: string;
    email: string;
  };
}

export default function ArchivedOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const supabase = createClient();

  const loadArchivedOrders = useCallback(async () => {
    try {
      setIsLoading(true);

      // Base query for archived orders only
      const query = supabase
        .from("orders")
        .select(`
          *,
          profiles (
            display_name,
            email
          )
        `)
        .eq("archived", true);

      // Apply search filter
      if (debouncedSearch.trim()) {
        const searchTerm = debouncedSearch.trim().toLowerCase();

        // Get results and filter locally
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // Filter results for ID matches
        const filteredData = data?.filter(order => 
          order.id.toLowerCase().includes(searchTerm) || 
          order.profiles?.display_name.toLowerCase().includes(searchTerm) ||
          order.profiles?.email.toLowerCase().includes(searchTerm)
        );

        setOrders(filteredData);
      } else {
        // No search, get all archived orders
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load archived orders:", error);
      toast.error("Failed to load archived orders");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, debouncedSearch]);

  useEffect(() => {
    loadArchivedOrders();
  }, [loadArchivedOrders]);

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) return;

    try {
      setIsDeleting(true);

      // First check if admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        throw new Error("Not authorized");
      }

      // Delete selected orders
      const { error } = await supabase
        .from("orders")
        .delete()
        .in("id", selectedOrders)
        .eq("archived", true); // Safety check to only delete archived orders

      if (error) throw error;

      toast.success(`${selectedOrders.length} order(s) deleted successfully`);
      setSelectedOrders([]);
      setShowDeleteDialog(false);
      loadArchivedOrders();
    } catch (error) {
      console.error("Failed to delete orders:", error);
      toast.error("Failed to delete orders");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectOrder = (orderId: string, selected: boolean) => {
    if (selected) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected && orders) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      loadArchivedOrders(); // Reset to show all orders when search is cleared
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Archive className="h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tight">Archived Orders</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search archived orders..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-[200px] sm:w-[300px]"
          />
          {selectedOrders.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedOrders.length})
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <ArchivedOrdersDataTable
          orders={orders}
          isLoading={isLoading}
          selectedOrders={selectedOrders}
          onSelectOrder={handleSelectOrder}
          onSelectAll={handleSelectAll}
        />
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Orders</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete {selectedOrders.length} selected order(s)? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}