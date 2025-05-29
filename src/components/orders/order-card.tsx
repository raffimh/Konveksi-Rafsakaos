"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentDetails } from "@/components/orders/payment-details"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

interface Order {
  id: string
  created_at: string
  material: string
  quantity: number
  design_url: string
  design_description: string
  total_amount: number
  unique_code: number
  status: 'menunggu_pembayaran' | 'diproses' | 'produksi' | 'selesai'
  estimated_completion_days?: number
  is_paid: boolean
}

interface OrderCardProps {
  order: Order
  onPaymentComplete?: () => void
}

const statusColors = {
  menunggu_pembayaran: "text-yellow-600 bg-yellow-50",
  diproses: "text-blue-600 bg-blue-50",
  produksi: "text-purple-600 bg-purple-50",
  selesai: "text-green-600 bg-green-50",
}

const statusLabels = {
  menunggu_pembayaran: "Pending Payment",
  diproses: "Processing",
  produksi: "In Production",
  selesai: "Completed",
}

export function OrderCard({ order, onPaymentComplete }: OrderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              statusColors[order.status]
            }`}
          >
            {statusLabels[order.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Order Details</h4>
            <div className="text-sm">
              <p><span className="font-medium">Material:</span> {order.material}</p>
              <p><span className="font-medium">Quantity:</span> {order.quantity} pcs</p>
              <p><span className="font-medium">Total Amount:</span> {formatCurrency(order.total_amount)}</p>
              {order.estimated_completion_days && order.status === "produksi" && (
                <p>
                  <span className="font-medium">Estimated Completion:</span>{" "}
                  {order.estimated_completion_days} days
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Design</h4>
            <div className="relative aspect-square w-full max-w-[200px] rounded-lg overflow-hidden border">
              <Image
                src={order.design_url}
                alt={`Design for order ${order.id}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {order.design_description && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Design Description</h4>
            <p className="text-sm text-muted-foreground">{order.design_description}</p>
          </div>
        )}

        {order.status === "menunggu_pembayaran" && !order.is_paid && (
          <PaymentDetails
            orderId={order.id}
            amount={order.total_amount}
            uniqueCode={order.unique_code}
            onPaymentComplete={onPaymentComplete}
          />
        )}
      </CardContent>
    </Card>
  )
}