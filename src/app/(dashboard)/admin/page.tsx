"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrdersDataTable } from "@/components/orders/orders-data-table";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { MiniChart } from "@/components/ui/mini-chart";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Activity,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
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
  const [revenueChartData, setRevenueChartData] = useState<Array<{value: number, label: string}>>([]);
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

        // Generate revenue chart data (last 7 days)
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayOrders = currentOrders?.filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.toDateString() === date.toDateString();
          }) || [];
          const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total_amount, 0);
          chartData.push({
            value: dayRevenue,
            label: date.toLocaleDateString('en-US', { weekday: 'short' })
          });
        }
        setRevenueChartData(chartData);

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

  const formatChangeIndicator = (current: number, previous: number) => {
    const change = calculateChange(current, previous);
    const isPositive = change > 0;
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isPositive 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        {Math.abs(change).toFixed(1)}%
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 dark:border-slate-700/20">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last 30 days</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Revenue
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              <AnimatedCounter 
                end={stats.currentPeriod.revenue} 
                prefix={formatCurrency(0).slice(0, -1)}
                duration={2000}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              {formatChangeIndicator(stats.currentPeriod.revenue, stats.previousPeriod.revenue)}
              <MiniChart 
                data={revenueChartData} 
                color="#3b82f6" 
                height={32}
                className="w-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Orders
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              <AnimatedCounter 
                end={stats.currentPeriod.orders} 
                duration={1500}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              {formatChangeIndicator(stats.currentPeriod.orders, stats.previousPeriod.orders)}
              <div className="flex items-center gap-1">
                <ProgressRing 
                  value={75} 
                  size={40} 
                  strokeWidth={4}
                  color="#10b981"
                  showValue={false}
                />
                <span className="text-xs text-muted-foreground">75% completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              New Customers
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              <AnimatedCounter 
                end={stats.currentPeriod.customers} 
                duration={1800}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              {formatChangeIndicator(stats.currentPeriod.customers, stats.previousPeriod.customers)}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                Active growth
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Available Materials
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              <AnimatedCounter 
                end={stats.currentPeriod.materials} 
                duration={1200}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 text-xs font-medium">
                <Target className="h-3 w-3" />
                In Stock
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                Ready to use
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Recent Orders
            </h2>
            <p className="text-muted-foreground text-sm">
              Latest orders from your customers
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            Live updates
          </div>
        </div>
        
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/20 dark:border-slate-700/20">
          <CardContent className="p-0">
            <OrdersDataTable 
              orders={recentOrders} 
              isLoading={isLoading}
              isAdmin
              showActions={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}