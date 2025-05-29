import { createClient } from "@/lib/supabase/client"
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js'

interface Order {
  id: string
  customer_id: string
  status: 'menunggu_pembayaran' | 'diproses' | 'produksi' | 'selesai'
  total_amount: number
  created_at: string
}

type OrderUpdatePayload = RealtimePostgresUpdatePayload<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}>

export function subscribeToOrderUpdates(
  userId: string,
  onUpdate: (payload: OrderUpdatePayload) => void
): () => void {
  const supabase = createClient()

  const channel = supabase
    .channel('orders')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `customer_id=eq.${userId}`,
      },
      (payload: OrderUpdatePayload) => {
        createNotification(payload)
        onUpdate(payload)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

async function createNotification(payload: OrderUpdatePayload) {
  const supabase = createClient()
  const newOrder = payload.new as Order
  const oldOrder = payload.old as Order

  // Only create notification for status changes
  if (oldOrder.status === newOrder.status) return

  const notificationData = {
    user_id: newOrder.customer_id,
    title: "Order Status Updated",
    message: `Order #${newOrder.id.slice(0, 8)} status changed to ${getStatusLabel(newOrder.status)}`,
    type: "order_status" as const,
  }

  await supabase.from("notifications").insert(notificationData)
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    menunggu_pembayaran: "Pending Payment",
    diproses: "Processing",
    produksi: "In Production",
    selesai: "Completed",
  }

  return labels[status] || status
}