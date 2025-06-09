export interface ProductionSchedule {
  id: string;
  order_id: string;
  created_at: string;
  updated_at: string;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_worker?: string;
  machine_allocation?: string;
  progress_percentage: number;
  notes?: string;
}

export interface ProductionTask {
  id: string;
  schedule_id: string;
  name: string;
  description?: string;
  estimated_hours: number;
  actual_hours?: number;
  sequence_order: number;
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: string;
  dependencies?: string[];
}

export interface WorkerSchedule {
  id: string;
  worker_name: string;
  email: string;
  shift_start: string;
  shift_end: string;
  capacity_percentage: number;
  current_tasks: ProductionTask[];
  availability_status: 'available' | 'busy' | 'unavailable';
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  capacity_per_hour: number;
  maintenance_schedule?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'broken';
  current_order_id?: string;
}

export interface ProductionMetrics {
  efficiency_percentage: number;
  on_time_delivery_rate: number;
  average_completion_time: number;
  resource_utilization: number;
  quality_score: number;
}