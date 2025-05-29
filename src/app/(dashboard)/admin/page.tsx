"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrdersDataTable } from "@/components/orders/orders-data-table";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface DashboardStats {
  currentPeriod: {
    revenue: number;
    orders: number;
    customers: number;
    materials: number;
  };
  previousPeriod: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

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

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    currentPeriod: {
      revenue: 0,
      orders: 0,
      customers: 0,
      materials: 0,
    },
    previousPeriod: {
      revenue: 0,
      orders: 0,
      customers: 0,
    },
  });
  const [recentOrders, setRecentOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Current period (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Previous period (30-60 days ago)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        // Get current period orders
        const { data: currentOrders } = await supabase
          .from("orders")
          .select("*")
          .gte("created_at", thirtyDaysAgo.toISOString());

        // Get previous period orders
        const { data: previousOrders } = await supabase
          .from("orders")
          .select("*")
          .gte("created_at", sixtyDaysAgo.toISOString())
          .lt("created_at", thirtyDaysAgo.toISOString());

        // Get current period customers
        const { count: currentCustomers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "customer")
          .gte("created_at", thirtyDaysAgo.toISOString());

        // Get previous period customers
        const { count: previousCustomers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "customer")
          .gte("created_at", sixtyDaysAgo.toISOString())
          .lt("created_at", thirtyDaysAgo.toISOString());

        // Get total materials
        const { count: materialCount } = await supabase
          .from("materials")
          .select("*", { count: "exact", head: true });

        // Calculate totals
        const currentRevenue = currentOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
        const previousRevenue = previousOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

        setStats({
          currentPeriod: {
            revenue: currentRevenue,
            orders: currentOrders?.length || 0,
            customers: currentCustomers || 0,
            materials: materialCount || 0,
          },
          previousPeriod: {
            revenue: previousRevenue,
            orders: previousOrders?.length || 0,
            customers: previousCustomers || 0,
          },
        });

        // Get recent orders with profiles for the table
        const { data: recentOrdersData } = await supabase
          .from("orders")
          .select(`
            *,
            profiles (
              display_name,
              email
            )
          `)
          .order("created_at", { ascending: false })
          .limit(5);

        setRecentOrders(recentOrdersData);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [supabase]);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {formatCurrency(stats.currentPeriod.revenue)}
            </CardTitle>
            <div className="absolute right-4 top-4">
              {calculateChange(stats.currentPeriod.revenue, stats.previousPeriod.revenue) > 0 ? (
                <Badge variant="secondary" className="flex gap-1 bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3" />
                  +{calculateChange(stats.currentPeriod.revenue, stats.previousPeriod.revenue).toFixed(1)}%
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex gap-1 bg-red-100 text-red-800">
                  <TrendingDown className="h-3 w-3" />
                  {calculateChange(stats.currentPeriod.revenue, stats.previousPeriod.revenue).toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.currentPeriod.revenue > stats.previousPeriod.revenue 
                ? "Revenue trending up"
                : "Revenue trending down"}
            </div>
            <div className="text-muted-foreground">
              Compared to previous period
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {stats.currentPeriod.orders}
            </CardTitle>
            <div className="absolute right-4 top-4">
              {calculateChange(stats.currentPeriod.orders, stats.previousPeriod.orders) > 0 ? (
                <Badge variant="secondary" className="flex gap-1 bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3" />
                  +{calculateChange(stats.currentPeriod.orders, stats.previousPeriod.orders).toFixed(1)}%
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex gap-1 bg-red-100 text-red-800">
                  <TrendingDown className="h-3 w-3" />
                  {calculateChange(stats.currentPeriod.orders, stats.previousPeriod.orders).toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.currentPeriod.orders > stats.previousPeriod.orders
                ? "Order volume increasing"
                : "Order volume decreasing"}
            </div>
            <div className="text-muted-foreground">
              Last 30 days vs previous
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>New Customers</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {stats.currentPeriod.customers}
            </CardTitle>
            <div className="absolute right-4 top-4">
              {calculateChange(stats.currentPeriod.customers, stats.previousPeriod.customers) > 0 ? (
                <Badge variant="secondary" className="flex gap-1 bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3" />
                  +{calculateChange(stats.currentPeriod.customers, stats.previousPeriod.customers).toFixed(1)}%
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex gap-1 bg-red-100 text-red-800">
                  <TrendingDown className="h-3 w-3" />
                  {calculateChange(stats.currentPeriod.customers, stats.previousPeriod.customers).toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stats.currentPeriod.customers > stats.previousPeriod.customers
                ? "Customer growth up"
                : "Customer growth down"}
            </div>
            <div className="text-muted-foreground">
              New signups this period
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Available Materials</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {stats.currentPeriod.materials}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Product catalog
            </div>
            <div className="text-muted-foreground">
              Total active materials
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="relative">
        <h3 className="text-xl font-semibold tracking-tight mb-4">Recent Orders</h3>
        <OrdersDataTable 
          orders={recentOrders} 
          isLoading={isLoading}
          isAdmin
          showActions={false}
        />
      </div>
    </div>
  );
}