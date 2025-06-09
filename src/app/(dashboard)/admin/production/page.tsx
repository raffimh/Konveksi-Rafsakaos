"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  Calendar,
  Users,
  Factory,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  Activity,
  Package,
  Wrench,
} from "lucide-react";
import { ProductionSchedule, ProductionMetrics } from "@/lib/types/production";

interface ProductionStats extends ProductionMetrics {
  activeSchedules: number;
  availableWorkers: number;
  activeMachines: number;
  pendingTasks: number;
}

export default function ProductionPage() {
  const [stats, setStats] = useState<ProductionStats>({
    efficiency_percentage: 0,
    on_time_delivery_rate: 0,
    average_completion_time: 0,
    resource_utilization: 0,
    quality_score: 0,
    activeSchedules: 0,
    availableWorkers: 0,
    activeMachines: 0,
    pendingTasks: 0,
  });
  const [schedules, setSchedules] = useState<ProductionSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadProductionData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const loadProductionData = async () => {
    try {
      setIsLoading(true);

      // Load production schedules with order details
      const { data: schedulesData } = await supabase
        .from("production_schedules")
        .select(`
          *,
          orders (
            id,
            material,
            quantity,
            total_amount,
            profiles (
              display_name
            )
          )
        `)
        .order("created_at", { ascending: false });

      // Load workers for stats
      const { data: workersData } = await supabase
        .from("workers")
        .select("*")
        .order("name");

      // Load machines for stats
      const { data: machinesData } = await supabase
        .from("machines")
        .select("*")
        .order("name");

      // Load today's production metrics
      const today = new Date().toISOString().split('T')[0];
      const { data: metricsData } = await supabase
        .from("production_metrics")
        .select("*")
        .eq("date", today)
        .single();

      // Calculate stats
      const activeSchedules = schedulesData?.filter(s => s.status === 'in_progress').length || 0;
      const availableWorkers = workersData?.filter(w => w.availability_status === 'available').length || 0;
      const activeMachines = machinesData?.filter(m => m.status === 'in_use').length || 0;

      // Load pending tasks count
      const { count: pendingTasksCount } = await supabase
        .from("production_tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setStats({
        efficiency_percentage: metricsData?.efficiency_percentage || 85,
        on_time_delivery_rate: metricsData?.on_time_delivery_rate || 92,
        average_completion_time: metricsData?.average_completion_time || 5.2,
        resource_utilization: metricsData?.resource_utilization || 78,
        quality_score: metricsData?.quality_score || 94,
        activeSchedules,
        availableWorkers,
        activeMachines,
        pendingTasks: pendingTasksCount || 0,
      });

      setSchedules(schedulesData || []);

    } catch (error) {
      console.error("Error loading production data:", error);
      toast.error("Failed to load production data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateScheduleStatus = async (scheduleId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("production_schedules")
        .update({ 
          status,
          actual_start_date: status === 'in_progress' ? new Date().toISOString() : undefined,
          actual_end_date: status === 'completed' ? new Date().toISOString() : undefined,
          updated_at: new Date().toISOString()
        })
        .eq("id", scheduleId);

      if (error) throw error;

      toast.success("Production schedule updated successfully");
      loadProductionData();
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'delayed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Production Planning
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage production schedules, workers, and resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadProductionData} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Production KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Efficiency */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Production Efficiency
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                <AnimatedCounter 
                  end={stats.efficiency_percentage} 
                  suffix="%" 
                  duration={2000}
                />
              </div>
              <ProgressRing 
                value={stats.efficiency_percentage} 
                size={48} 
                strokeWidth={4}
                color="#3b82f6"
              />
            </div>
          </CardContent>
        </Card>

        {/* On-time Delivery */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              On-time Delivery
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                <AnimatedCounter 
                  end={stats.on_time_delivery_rate} 
                  suffix="%" 
                  duration={1800}
                />
              </div>
              <ProgressRing 
                value={stats.on_time_delivery_rate} 
                size={48} 
                strokeWidth={4}
                color="#10b981"
              />
            </div>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-900/20 border-purple-200/50 dark:border-purple-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Resource Utilization
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
              <Factory className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                <AnimatedCounter 
                  end={stats.resource_utilization} 
                  suffix="%" 
                  duration={1500}
                />
              </div>
              <ProgressRing 
                value={stats.resource_utilization} 
                size={48} 
                strokeWidth={4}
                color="#8b5cf6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quality Score */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/20 dark:to-amber-900/20 border-orange-200/50 dark:border-orange-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Quality Score
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                <AnimatedCounter 
                  end={stats.quality_score} 
                  suffix="%" 
                  duration={1200}
                />
              </div>
              <ProgressRing 
                value={stats.quality_score} 
                size={48} 
                strokeWidth={4}
                color="#f59e0b"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Status */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSchedules}</div>
            <p className="text-xs text-muted-foreground">Production in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableWorkers}</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Machines</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMachines}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Production Schedules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Production Schedules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading production schedules...
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No production schedules found
              </div>
            ) : (
              schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(schedule.priority)}`} />
                      <Badge className={getStatusColor(schedule.status)}>
                        {schedule.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="font-medium">
                        Order #{schedule.order_id.slice(-8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {schedule.assigned_worker && `Worker: ${schedule.assigned_worker}`}
                        {schedule.machine_allocation && ` • Machine: ${schedule.machine_allocation}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {new Date(schedule.planned_start_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Progress: {schedule.progress_percentage}%
                      </div>
                    </div>
                    <ProgressRing 
                      value={schedule.progress_percentage} 
                      size={40} 
                      strokeWidth={3}
                      color="#3b82f6"
                      showValue={false}
                    />
                    <div className="flex space-x-2">
                      {schedule.status === 'scheduled' && (
                        <Button
                          size="sm"
                          onClick={() => updateScheduleStatus(schedule.id, 'in_progress')}
                        >
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {schedule.status === 'in_progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateScheduleStatus(schedule.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}