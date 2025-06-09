-- Production Planning & Scheduling Tables

-- Production schedules for orders
CREATE TABLE public.production_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  planned_start_date timestamp with time zone NOT NULL,
  planned_end_date timestamp with time zone NOT NULL,
  actual_start_date timestamp with time zone,
  actual_end_date timestamp with time zone,
  status text CHECK (status IN ('scheduled', 'in_progress', 'completed', 'delayed')) DEFAULT 'scheduled' NOT NULL,
  priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium' NOT NULL,
  assigned_worker text,
  machine_allocation text,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  notes text
);

-- Production tasks breakdown
CREATE TABLE public.production_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  schedule_id uuid REFERENCES public.production_schedules(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  estimated_hours decimal(5,2) NOT NULL,
  actual_hours decimal(5,2),
  sequence_order integer NOT NULL,
  status text CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending' NOT NULL,
  assigned_to text,
  dependencies text[] DEFAULT '{}'
);

-- Workers/Staff management
CREATE TABLE public.workers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  email text UNIQUE,
  phone text,
  role text NOT NULL,
  shift_start time NOT NULL,
  shift_end time NOT NULL,
  capacity_percentage integer DEFAULT 100 CHECK (capacity_percentage >= 0 AND capacity_percentage <= 150),
  availability_status text CHECK (availability_status IN ('available', 'busy', 'unavailable')) DEFAULT 'available' NOT NULL,
  hourly_rate decimal(10,2),
  skills text[] DEFAULT '{}'
);

-- Machines and equipment
CREATE TABLE public.machines (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  capacity_per_hour integer NOT NULL,
  maintenance_schedule text,
  status text CHECK (status IN ('available', 'in_use', 'maintenance', 'broken')) DEFAULT 'available' NOT NULL,
  current_order_id uuid REFERENCES public.orders(id),
  purchase_date date,
  warranty_expiry date,
  specifications jsonb
);

-- Inventory/Stock management
CREATE TABLE public.inventory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  material_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity >= 0),
  unit text NOT NULL,
  minimum_stock integer DEFAULT 0,
  maximum_stock integer,
  unit_cost decimal(10,2),
  supplier_name text,
  supplier_contact text,
  last_reorder_date date,
  location text
);

-- Stock movements/transactions
CREATE TABLE public.stock_movements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  inventory_id uuid REFERENCES public.inventory(id) ON DELETE CASCADE NOT NULL,
  movement_type text CHECK (movement_type IN ('in', 'out', 'adjustment')) NOT NULL,
  quantity integer NOT NULL,
  reference_type text, -- 'order', 'purchase', 'adjustment'
  reference_id uuid,
  notes text,
  performed_by uuid REFERENCES public.profiles(id)
);

-- Quality control checkpoints
CREATE TABLE public.quality_checkpoints (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  checkpoint_name text NOT NULL,
  inspector_name text NOT NULL,
  status text CHECK (status IN ('passed', 'failed', 'needs_review')) NOT NULL,
  notes text,
  images text[] DEFAULT '{}',
  defects_found text[] DEFAULT '{}',
  corrective_actions text
);

-- Production metrics tracking
CREATE TABLE public.production_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  date date NOT NULL,
  efficiency_percentage decimal(5,2) DEFAULT 0,
  on_time_delivery_rate decimal(5,2) DEFAULT 0,
  average_completion_time decimal(10,2) DEFAULT 0,
  resource_utilization decimal(5,2) DEFAULT 0,
  quality_score decimal(5,2) DEFAULT 0,
  total_orders_completed integer DEFAULT 0,
  total_revenue decimal(12,2) DEFAULT 0
);

-- Indexes for performance
CREATE INDEX production_schedules_order_id_idx ON public.production_schedules(order_id);
CREATE INDEX production_schedules_status_idx ON public.production_schedules(status);
CREATE INDEX production_schedules_planned_start_idx ON public.production_schedules(planned_start_date);
CREATE INDEX production_tasks_schedule_id_idx ON public.production_tasks(schedule_id);
CREATE INDEX production_tasks_status_idx ON public.production_tasks(status);
CREATE INDEX workers_availability_idx ON public.workers(availability_status);
CREATE INDEX machines_status_idx ON public.machines(status);
CREATE INDEX inventory_material_idx ON public.inventory(material_name);
CREATE INDEX stock_movements_inventory_id_idx ON public.stock_movements(inventory_id);
CREATE INDEX quality_checkpoints_order_id_idx ON public.quality_checkpoints(order_id);
CREATE INDEX production_metrics_date_idx ON public.production_metrics(date);

-- Enable RLS
ALTER TABLE public.production_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admin can view/modify all production data
CREATE POLICY "Admin can manage production schedules"
  ON production_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Allow system functions to insert production schedules
CREATE POLICY "System can create production schedules"
  ON production_schedules FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can manage production tasks"
  ON production_tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can manage workers"
  ON workers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can manage machines"
  ON machines FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can manage inventory"
  ON inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can manage stock movements"
  ON stock_movements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can manage quality checkpoints"
  ON quality_checkpoints FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admin can view production metrics"
  ON production_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Customers can view limited production info for their orders
CREATE POLICY "Customers can view their order production schedules"
  ON production_schedules FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders
      WHERE customer_id = auth.uid()
    )
  );

-- Functions and Triggers

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_production_schedules_updated_at 
  BEFORE UPDATE ON production_schedules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_production_tasks_updated_at 
  BEFORE UPDATE ON production_tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workers_updated_at 
  BEFORE UPDATE ON workers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_machines_updated_at 
  BEFORE UPDATE ON machines 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at 
  BEFORE UPDATE ON inventory 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quality_checkpoints_updated_at 
  BEFORE UPDATE ON quality_checkpoints 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create production schedule when order status changes to 'diproses'
CREATE OR REPLACE FUNCTION create_production_schedule()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create schedule when status changes to 'diproses' and no schedule exists
  IF NEW.status = 'diproses' AND OLD.status != 'diproses' THEN
    -- Check if production schedule already exists
    IF NOT EXISTS (
      SELECT 1 FROM production_schedules
      WHERE order_id = NEW.id
    ) THEN
      -- Calculate planned dates based on estimated completion days
      INSERT INTO production_schedules (
        order_id,
        planned_start_date,
        planned_end_date,
        priority
      ) VALUES (
        NEW.id,
        timezone('utc'::text, now()),
        timezone('utc'::text, now() + INTERVAL '1 day' * COALESCE(NEW.estimated_completion_days, 7)),
        CASE
          WHEN NEW.quantity > 100 THEN 'high'
          WHEN NEW.quantity > 50 THEN 'medium'
          ELSE 'low'
        END
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto production schedule creation
CREATE TRIGGER auto_create_production_schedule
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_production_schedule();

-- Function to check inventory levels and create alerts
CREATE OR REPLACE FUNCTION check_inventory_levels()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if stock is below minimum level
  IF NEW.quantity <= NEW.minimum_stock THEN
    -- Insert notification for admin about low stock
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type
    )
    SELECT
      id,
      'Low Stock Alert',
      'Material "' || NEW.material_name || '" is running low. Current stock: ' || NEW.quantity || ', Minimum: ' || NEW.minimum_stock,
      'system'
    FROM profiles
    WHERE role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for inventory level checking
CREATE TRIGGER check_inventory_trigger
  AFTER UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION check_inventory_levels();

-- Sample data for development
INSERT INTO public.workers (name, email, role, shift_start, shift_end, skills) VALUES
  ('Ahmad Pratama', 'ahmad@konveksi.com', 'Cutting Specialist', '08:00:00', '17:00:00', ARRAY['cutting', 'pattern_making']),
  ('Sari Dewi', 'sari@konveksi.com', 'Sewing Operator', '08:00:00', '17:00:00', ARRAY['sewing', 'overlock']),
  ('Budi Santoso', 'budi@konveksi.com', 'Quality Inspector', '09:00:00', '18:00:00', ARRAY['quality_control', 'finishing']),
  ('Maya Sinta', 'maya@konveksi.com', 'Finishing Specialist', '08:00:00', '17:00:00', ARRAY['pressing', 'packaging']);

INSERT INTO public.machines (name, type, capacity_per_hour) VALUES
  ('Singer Industrial 1', 'Sewing Machine', 20),
  ('Overlock Machine A', 'Overlock', 15),
  ('Cutting Table 1', 'Cutting Equipment', 50),
  ('Steam Press 1', 'Pressing Equipment', 30);

INSERT INTO public.inventory (material_name, quantity, unit, minimum_stock, unit_cost, supplier_name) VALUES
  ('Benang Katun Putih', 500, 'cone', 50, 15000, 'PT Benang Nusantara'),
  ('Benang Katun Hitam', 300, 'cone', 50, 15000, 'PT Benang Nusantara'),
  ('Kancing Plastik 12mm', 10000, 'pcs', 1000, 500, 'UD Kancing Jaya'),
  ('Label Brand', 2000, 'pcs', 200, 1000, 'CV Label Indonesia');