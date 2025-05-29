"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { Package } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  customer?: {
    display_name: string
    email: string
  }
  profiles?: {
    display_name: string
    email: string
    avatar_url?: string
  }
}

interface OrdersDataTableProps {
  orders: Order[] | null
  isLoading: boolean
  isAdmin?: boolean
  onStatusChange?: (orderId: string, newStatus: string) => void
  showActions?: boolean
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

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Package className="h-8 w-8 text-muted-foreground" />
      <p className="text-lg font-medium">No orders found</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  )
}

export function OrdersDataTable({ 
  orders, 
  isLoading,
  isAdmin,
  onStatusChange,
  showActions
}: OrdersDataTableProps) {
  const baseColumns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }: { row: Row<Order> }) => (
        <span className="font-medium">{row.original.id.slice(0, 8)}</span>
      ),
    },
    ...(isAdmin
      ? [
          {
            accessorKey: "customer",
            header: "Customer",
            cell: ({ row }: { row: Row<Order> }) => (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage 
                    src={row.original.profiles?.avatar_url} 
                    alt={row.original.profiles?.display_name || "Customer"} 
                  />
                  <AvatarFallback>
                    {(row.original.profiles?.display_name || "?")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">
                    {row.original.profiles?.display_name || row.original.customer?.display_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {row.original.profiles?.email || row.original.customer?.email}
                  </p>
                </div>
              </div>
            ),
          },
        ]
      : []),
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }: { row: Row<Order> }) => (
        <span className="whitespace-nowrap">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }: { row: Row<Order> }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.material}</p>
          <p className="text-sm text-muted-foreground">{row.original.quantity} pcs</p>
          {row.original.design_url && (
            <div className="relative w-12 h-12 rounded overflow-hidden">
              <Image
                src={row.original.design_url}
                alt={`Design for order ${row.original.id}`}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }: { row: Row<Order> }) => (
        <div className="space-y-1 whitespace-nowrap">
          <p>{formatCurrency(row.original.total_amount)}</p>
          {row.original.unique_code && (
            <p className="text-xs text-muted-foreground">
              Code: {row.original.unique_code}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: Row<Order> }) => (
        <div className="space-y-1">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
              statusColors[row.original.status]
            }`}
          >
            {statusLabels[row.original.status]}
          </span>
          {row.original.estimated_completion_days && (
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              Est. {row.original.estimated_completion_days} days
            </p>
          )}
        </div>
      ),
    },
  ]

  const actionColumn: ColumnDef<Order> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="min-w-[140px]">
        <Select
          value={row.original.status}
          onValueChange={(value) => onStatusChange?.(row.original.id, value)}
          disabled={row.original.status === "selesai"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="menunggu_pembayaran">
              Pending Payment
            </SelectItem>
            <SelectItem value="diproses">Processing</SelectItem>
            <SelectItem value="produksi">In Production</SelectItem>
            <SelectItem value="selesai">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
  }

  const columns = showActions 
    ? [...baseColumns, actionColumn]
    : baseColumns

  if (isLoading) {
    return (
      <Card className="max-w-[calc(100vw-3rem)]">
        <div className="p-6">
          <LoadingSkeleton />
        </div>
      </Card>
    )
  }

  if (!orders?.length) {
    return (
      <Card className="max-w-[calc(100vw-3rem)]">
        <div className="p-6">
          <EmptyOrders />
        </div>
      </Card>
    )
  }

  return (
    <Card className="max-w-[calc(100vw-3rem)]">
      <div className="p-6">
        <DataTable columns={columns} data={orders} />
      </div>
    </Card>
  )
}
