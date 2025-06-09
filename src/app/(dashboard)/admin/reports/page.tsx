"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { MiniChart } from "@/components/ui/mini-chart";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Download,
  RefreshCw,
  PieChart,
  Activity,
  Target,
} from "lucide-react";

interface ReportData {
  revenue: {
    current: number;
    previous: number;
    chartData: Array<{ value: number; label: string }>;
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    chartData: Array<{ value: number; label: string }>;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
  materials: {
    topSelling: Array<{ name: string; quantity: number; revenue: number }>;
    performance: Array<{ value: number; label: string }>;
  };
  production: {
    efficiency: number;
    onTimeDelivery: number;
    qualityScore: number;
    averageTime: number;
  };
}

interface TimeRange {
  value: string;
  label: string;
  days: number;
}

const timeRanges: TimeRange[] = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
  { value: "1y", label: "Last year", days: 365 },
];

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    revenue: { current: 0, previous: 0, chartData: [] },
    orders: { total: 0, completed: 0, pending: 0, chartData: [] },
    customers: { total: 0, new: 0, returning: 0 },
    materials: { topSelling: [], performance: [] },
    production: { efficiency: 0, onTimeDelivery: 0, qualityScore: 0, averageTime: 0 },
  });
  const [selectedRange, setSelectedRange] = useState<string>("30d");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadReportData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRange, supabase]);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      const range = timeRanges.find(r => r.value === selectedRange);
      if (!range) return;

      const currentDate = new Date();
      const startDate = new Date(currentDate.getTime() - range.days * 24 * 60 * 60 * 1000);
      const previousStartDate = new Date(startDate.getTime() - range.days * 24 * 60 * 60 * 1000);

      // Load orders for current and previous periods
      const { data: currentOrders } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startDate.toISOString());

      const { data: previousOrders } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", previousStartDate.toISOString())
        .lt("created_at", startDate.toISOString());

      // Load customers
      const { data: allCustomers } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "customer");

      const { data: newCustomers } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "customer")
        .gte("created_at", startDate.toISOString());

      // Calculate revenue data
      const currentRevenue = currentOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const previousRevenue = previousOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Generate revenue chart data
      const revenueChartData = generateChartData(currentOrders || [], range.days);

      // Calculate order statistics
      const totalOrders = currentOrders?.length || 0;
      const completedOrders = currentOrders?.filter(o => o.status === 'selesai').length || 0;
      const pendingOrders = currentOrders?.filter(o => o.status !== 'selesai').length || 0;

      // Generate orders chart data
      const ordersChartData = [
        { value: completedOrders, label: "Completed" },
        { value: pendingOrders, label: "Pending" },
      ];

      // Calculate material performance
      const materialStats = calculateMaterialStats(currentOrders || []);

      // Load production metrics
      const { data: productionMetrics } = await supabase
        .from("production_metrics")
        .select("*")
        .gte("date", startDate.toISOString().split('T')[0])
        .order("date", { ascending: false });

      const avgEfficiency = productionMetrics?.reduce((sum, m) => sum + (m.efficiency_percentage || 0), 0) / (productionMetrics?.length || 1) || 85;
      const avgOnTime = productionMetrics?.reduce((sum, m) => sum + (m.on_time_delivery_rate || 0), 0) / (productionMetrics?.length || 1) || 92;
      const avgQuality = productionMetrics?.reduce((sum, m) => sum + (m.quality_score || 0), 0) / (productionMetrics?.length || 1) || 94;
      const avgTime = productionMetrics?.reduce((sum, m) => sum + (m.average_completion_time || 0), 0) / (productionMetrics?.length || 1) || 5.2;

      setReportData({
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          chartData: revenueChartData,
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders,
          chartData: ordersChartData,
        },
        customers: {
          total: allCustomers?.length || 0,
          new: newCustomers?.length || 0,
          returning: (allCustomers?.length || 0) - (newCustomers?.length || 0),
        },
        materials: materialStats,
        production: {
          efficiency: avgEfficiency,
          onTimeDelivery: avgOnTime,
          qualityScore: avgQuality,
          averageTime: avgTime,
        },
      });

    } catch (error) {
      console.error("Error loading report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setIsLoading(false);
    }
  };

  const generateChartData = (orders: Array<{created_at: string; total_amount: number}>, days: number) => {
    const data = [];
    const interval = Math.max(1, Math.floor(days / 7)); // Show max 7 data points

    for (let i = days - 1; i >= 0; i -= interval) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toDateString() === date.toDateString();
      });
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total_amount, 0);
      
      data.push({
        value: dayRevenue,
        label: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return data;
  };

  const calculateMaterialStats = (orders: Array<{material: string; quantity: number; total_amount: number}>) => {
    const materialMap = new Map();
    
    orders.forEach(order => {
      const material = order.material;
      if (materialMap.has(material)) {
        const existing = materialMap.get(material);
        materialMap.set(material, {
          name: material,
          quantity: existing.quantity + order.quantity,
          revenue: existing.revenue + order.total_amount,
        });
      } else {
        materialMap.set(material, {
          name: material,
          quantity: order.quantity,
          revenue: order.total_amount,
        });
      }
    });

    const topSelling = Array.from(materialMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const performance = topSelling.map(item => ({
      value: item.revenue,
      label: item.name,
    }));

    return { topSelling, performance };
  };

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatChangeIndicator = (current: number, previous: number) => {
    const change = calculateChange(current, previous);
    const isPositive = change >= 0;
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isPositive 
          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {Math.abs(change).toFixed(1)}%
      </div>
    );
  };

  const exportReport = () => {
    const csvContent = generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rafsakaos-report-${selectedRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Report exported successfully");
  };

  const generateCSVReport = () => {
    const headers = [
      "Metric",
      "Current Period",
      "Previous Period",
      "Change (%)"
    ];

    const rows = [
      ["Revenue", `Rp ${reportData.revenue.current.toLocaleString()}`, `Rp ${reportData.revenue.previous.toLocaleString()}`, `${calculateChange(reportData.revenue.current, reportData.revenue.previous).toFixed(1)}%`],
      ["Total Orders", reportData.orders.total.toString(), "", ""],
      ["Completed Orders", reportData.orders.completed.toString(), "", ""],
      ["Pending Orders", reportData.orders.pending.toString(), "", ""],
      ["Total Customers", reportData.customers.total.toString(), "", ""],
      ["New Customers", reportData.customers.new.toString(), "", ""],
      ["Production Efficiency", `${reportData.production.efficiency.toFixed(1)}%`, "", ""],
      ["On-time Delivery", `${reportData.production.onTimeDelivery.toFixed(1)}%`, "", ""],
      ["Quality Score", `${reportData.production.qualityScore.toFixed(1)}%`, "", ""],
    ];

    return [headers, ...rows].map(row => row.join(",")).join("\n");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Advanced Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadReportData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportReport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue */}
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
                end={reportData.revenue.current} 
                prefix={formatCurrency(0).slice(0, -1)}
                duration={2000}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              {formatChangeIndicator(reportData.revenue.current, reportData.revenue.previous)}
              <MiniChart 
                data={reportData.revenue.chartData} 
                color="#3b82f6" 
                height={32}
                className="w-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total Orders
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              <AnimatedCounter 
                end={reportData.orders.total} 
                duration={1500}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                {reportData.orders.completed} completed
              </div>
              <ProgressRing 
                value={(reportData.orders.completed / Math.max(reportData.orders.total, 1)) * 100} 
                size={40} 
                strokeWidth={4}
                color="#10b981"
                showValue={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers */}
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
                end={reportData.customers.new} 
                duration={1800}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                Total: {reportData.customers.total}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                Growth
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Efficiency */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Production Efficiency
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              <AnimatedCounter 
                end={reportData.production.efficiency} 
                suffix="%" 
                duration={1200}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                Quality: {reportData.production.qualityScore.toFixed(1)}%
              </div>
              <ProgressRing 
                value={reportData.production.efficiency} 
                size={40} 
                strokeWidth={4}
                color="#f59e0b"
                showValue={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Selling Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Selling Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading material data...
                </div>
              ) : reportData.materials.topSelling.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No material data available
                </div>
              ) : (
                reportData.materials.topSelling.map((material, index) => (
                  <div key={material.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{material.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {material.quantity} pieces
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(material.revenue)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Revenue
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Production Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Production Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Production Efficiency</div>
                  <div className="text-sm text-muted-foreground">Overall efficiency rate</div>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressRing 
                    value={reportData.production.efficiency} 
                    size={48} 
                    strokeWidth={4}
                    color="#3b82f6"
                  />
                  <div className="text-lg font-semibold">
                    {reportData.production.efficiency.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">On-time Delivery</div>
                  <div className="text-sm text-muted-foreground">Orders delivered on time</div>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressRing 
                    value={reportData.production.onTimeDelivery} 
                    size={48} 
                    strokeWidth={4}
                    color="#10b981"
                  />
                  <div className="text-lg font-semibold">
                    {reportData.production.onTimeDelivery.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Quality Score</div>
                  <div className="text-sm text-muted-foreground">Average quality rating</div>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressRing 
                    value={reportData.production.qualityScore} 
                    size={48} 
                    strokeWidth={4}
                    color="#f59e0b"
                  />
                  <div className="text-lg font-semibold">
                    {reportData.production.qualityScore.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Average Completion Time</div>
                  <div className="text-sm text-muted-foreground">Days per order</div>
                </div>
                <div className="text-lg font-semibold">
                  {reportData.production.averageTime.toFixed(1)} days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
