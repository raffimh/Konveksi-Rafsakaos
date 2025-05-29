"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { OrdersDataTable } from "@/components/orders/orders-data-table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface Order {
  id: string;
  created_at: string;
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

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const supabase = createClient();

  const loadOrders = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Base query
      const query = supabase
        .from("orders")
        .select(`
          *,
          profiles (
            display_name,
            email
          )
        `)
        .eq("customer_id", user.id);

      // Apply search filters if needed
      if (debouncedSearch.trim()) {
        const searchTerm = debouncedSearch.trim().toLowerCase();

        // Get results and filter locally
        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) throw error;

        // Filter results for material or ID matches
        const filteredData = data?.filter(order => 
          order.id.toLowerCase().includes(searchTerm) || 
          order.material.toLowerCase().includes(searchTerm) ||
          order.status.toLowerCase().includes(searchTerm)
        );

        setOrders(filteredData || null);
      } else {
        // No search, get all orders
        const { data, error } = await query.order("created_at", { ascending: false });

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
  }, [supabase, debouncedSearch]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Subscribe to order changes
  useEffect(() => {
    const channel = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, loadOrders]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      loadOrders(); // Reset to show all orders when search is cleared
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">My Orders</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search by ID or material..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-[200px] sm:w-[300px]"
          />
          <Button onClick={() => router.push("/customer/orders/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <OrdersDataTable
        orders={orders}
        isLoading={isLoading}
      />
    </div>
  );
}