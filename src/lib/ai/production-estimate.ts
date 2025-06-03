import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/lib/types/supabase"

interface ProductionInput {
  newOrderQuantity: number;
  activeOrdersCount: number;
}

export function estimateProductionTime({ newOrderQuantity, activeOrdersCount }: ProductionInput): number {
  // Constants
  const PIECES_PER_ORDER = 24;
  const DAYS_PER_ORDER = 7;
  const MAX_CONCURRENT_ORDERS = 7;
  const BASE_PRODUCTION_DAYS = 7;

  // Calculate number of orders based on quantity
  const orderSize = Math.ceil(newOrderQuantity / PIECES_PER_ORDER);
  
  // Calculate total workload
  const totalWorkload = activeOrdersCount + orderSize;

  // If total workload exceeds capacity, add delay
  if (totalWorkload > MAX_CONCURRENT_ORDERS) {
    const extraOrders = totalWorkload - MAX_CONCURRENT_ORDERS;
    const extraDays = extraOrders * DAYS_PER_ORDER;
    return BASE_PRODUCTION_DAYS + extraDays;
  }

  // If within capacity, return base production time
  return BASE_PRODUCTION_DAYS;
}

export async function getActiveOrdersCount(
  supabase: SupabaseClient<Database>
): Promise<number> {
  // Get all orders that are still in processing (not completed)
  // Count all orders across all customers that haven't reached 'selesai' status
  const { data: orders } = await supabase
    .from("orders")
    .select("status")
    .in("status", ["menunggu_pembayaran", "diproses", "produksi"]);

  return orders?.length || 0;
}

export async function calculateProductionEstimate(
  supabase: SupabaseClient<Database>,
  newOrderQuantity: number
): Promise<number> {
  const activeOrdersCount = await getActiveOrdersCount(supabase);
  return estimateProductionTime({ newOrderQuantity, activeOrdersCount });
}