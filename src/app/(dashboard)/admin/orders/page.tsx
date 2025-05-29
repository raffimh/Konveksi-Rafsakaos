"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { OrdersDataTable } from "@/components/orders/orders-data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";

const orderStatuses = [
  { value: "all", label: "All Orders" },
  { value: "menunggu_pembayaran", label: "Pending Payment" },
  { value: "diproses", label: "Processing" },
  { value: "produksi", label: "In Production" },
  { value: "selesai", label: "Completed" },
];

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
  profiles: {
    display_name: string;
    email: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const supabase = createClient();

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);

      // Base query
      let query = supabase
        .from("orders")
        .select(`
          *,
          profiles (
            display_name,
            email
          )
        `);

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

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
        // No search, get all orders
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      // Only show error toast for non-search related errors
      if (!debouncedSearch) {
        toast.error("Failed to load orders");
      }
    } finally {
      setIsLoading(false);
    }
  }, [supabase, statusFilter, debouncedSearch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
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

      // Then update order
      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === "diproses" ? { is_paid: true } : {}),
          ...(newStatus === "produksi"
            ? {
                estimated_completion_days: calculateEstimatedDays(
                  orders?.length || 0
                ),
              }
            : {})
        })
        .eq("id", orderId);

      if (error) throw error;

      toast.success("Order status updated");
      loadOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  }

  function calculateEstimatedDays(totalOrders: number) {
    const baseTime = 7; // Base time per order in days
    const maxOrdersPerWeek = 7; // Maximum orders that can be processed per week
    return Math.max(
      baseTime,
      Math.ceil(totalOrders / maxOrdersPerWeek) * baseTime
    );
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      loadOrders(); // Reset to show all orders when search is cleared
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search by ID or customer..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-[200px] sm:w-[300px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {orderStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <OrdersDataTable
          orders={orders}
          isLoading={isLoading}
          isAdmin
          showActions
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
