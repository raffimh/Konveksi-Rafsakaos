"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OrdersTable } from "@/components/orders/orders-table";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/use-i18n";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { MiniChart } from "@/components/ui/mini-chart";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Package,
  Activity,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Star,
  Heart,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

interface CustomerStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  activeOrders: number;
  totalSpent: number;
  averageOrderValue: number;
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
  customer_id: string;
}

export default function CustomerPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<CustomerStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spendingChartData, setSpendingChartData] = useState<Array<{value: number, label: string}>>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get customer orders
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        if (orders) {
          // Calculate stats
          const totalOrders = orders.length;
          const pendingOrders = orders.filter(order => order.status === 'menunggu_pembayaran').length;
          const activeOrders = orders.filter(order => ['diproses', 'produksi'].includes(order.status)).length;
          const completedOrders = orders.filter(order => order.status === 'selesai').length;
          const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
          const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

          setStats({
            totalOrders,
            pendingOrders,
            completedOrders,
            activeOrders,
            totalSpent,
            averageOrderValue,
          });

          // Generate spending chart data (last 6 months)
          const chartData = [];
          for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthOrders = orders.filter(order => {
              const orderDate = new Date(order.created_at);
              return orderDate.getMonth() === date.getMonth() && 
                     orderDate.getFullYear() === date.getFullYear();
            });
            const monthSpending = monthOrders.reduce((sum, order) => sum + order.total_amount, 0);
            chartData.push({
              value: monthSpending,
              label: date.toLocaleDateString('en-US', { month: 'short' })
            });
          }
          setSpendingChartData(chartData);

          // Set recent orders (limit to 5)
          setRecentOrders(orders.slice(0, 5));
        }

      } catch (error) {
        console.error("Error loading customer data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomerData();
  }, [supabase]);

  const completionRate = stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            {t.dashboard.welcome}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.dashboard.overview}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Link href="/customer/orders/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t.orders.newOrder}
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {t.dashboard.totalOrders}
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              <AnimatedCounter 
                end={stats.totalOrders} 
                duration={1500}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-medium">
                <TrendingUp className="h-3 w-3" />
                All time
              </div>
              <MiniChart 
                data={spendingChartData} 
                color="#3b82f6" 
                height={32}
                className="w-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Orders Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Active Orders
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              <AnimatedCounter 
                end={stats.activeOrders} 
                duration={1200}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium">
                <Activity className="h-3 w-3" />
                In Progress
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                Being crafted
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payment Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Pending Payment
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              <AnimatedCounter 
                end={stats.pendingOrders} 
                duration={1800}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 text-xs font-medium">
                <Clock className="h-3 w-3" />
                Awaiting
              </div>
              <ProgressRing 
                value={stats.pendingOrders > 0 ? 25 : 0} 
                size={40} 
                strokeWidth={4}
                color="#f59e0b"
                showValue={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Completed Orders Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Completed
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              <AnimatedCounter 
                end={stats.completedOrders} 
                duration={2000}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 text-xs font-medium">
                <Star className="h-3 w-3" />
                Delivered
              </div>
              <ProgressRing 
                value={completionRate} 
                size={40} 
                strokeWidth={4}
                color="#8b5cf6"
                showValue={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950/20 dark:to-pink-900/20 border-rose-200/50 dark:border-rose-800/30 hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6">
            <Link href="/customer/orders/new" className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-rose-900 dark:text-rose-100">New Order</h3>
                <p className="text-sm text-rose-700 dark:text-rose-300">Start a custom project</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-rose-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950/20 dark:to-blue-900/20 border-cyan-200/50 dark:border-cyan-800/30 hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6">
            <Link href="/customer/materials" className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cyan-900 dark:text-cyan-100">Browse Materials</h3>
                <p className="text-sm text-cyan-700 dark:text-cyan-300">Explore our catalog</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-cyan-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-6">
            <Link href="/customer/orders" className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Order Status</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">Track your orders</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-emerald-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              {t.dashboard.recentOrders}
            </h2>
            <p className="text-muted-foreground text-sm">
              Your latest custom clothing orders
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/customer/orders">View all orders</Link>
          </Button>
        </div>
        
        {recentOrders && recentOrders.length > 0 ? (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/20 dark:border-slate-700/20">
            <CardContent className="p-0">
              <OrdersTable orders={recentOrders} isLoading={isLoading} />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-white/20 dark:border-slate-700/20">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No orders yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-md">
                Start creating your custom apparel order now and experience our quality craftsmanship
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Link href="/customer/orders/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Order
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Total Spending & Loyalty Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Spending Card */}
        <Card className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/20 dark:via-blue-950/20 dark:to-cyan-950/20 border-indigo-200/50 dark:border-indigo-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Total Investment</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">Your custom clothing journey</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                <AnimatedCounter 
                  end={stats.totalSpent} 
                  prefix={formatCurrency(0).slice(0, -1)}
                  duration={2500}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-indigo-600 dark:text-indigo-400">
                  Average per order: <span className="font-medium">{formatCurrency(stats.averageOrderValue)}</span>
                </div>
                <MiniChart 
                  data={spendingChartData} 
                  color="#6366f1" 
                  height={40}
                  className="w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Card */}
        <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-fuchsia-950/20 border-violet-200/50 dark:border-violet-800/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-violet-900 dark:text-violet-100">
                    Valued Customer
                  </h3>
                  <p className="text-sm text-violet-700 dark:text-violet-300">
                    Thank you for choosing Rafsakaos!
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                      {stats.completedOrders} orders completed
                    </div>
                    <div className="text-xs text-violet-500">•</div>
                    <div className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                      {Math.round(completionRate)}% success rate
                    </div>
                  </div>
                </div>
              </div>
              <ProgressRing 
                value={Math.min(stats.totalOrders * 10, 100)} 
                size={60} 
                strokeWidth={4}
                color="#8b5cf6"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}