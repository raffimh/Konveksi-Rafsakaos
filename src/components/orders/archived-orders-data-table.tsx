"use client"

import { useState } from "react"
import { ColumnDef, Row } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { Package, Eye, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { OrderDetailDialog } from "./order-detail-dialog"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  archived: boolean
  profiles?: {
    display_name: string
    email: string
    avatar_url?: string
  }
}

interface ArchivedOrdersDataTableProps {
  orders: Order[] | null
  isLoading: boolean
  selectedOrders: string[]
  onSelectOrder: (orderId: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
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
      <p className="text-lg font-medium">No archived orders found</p>
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

export function ArchivedOrdersDataTable({
  orders,
  isLoading,
  selectedOrders,
  onSelectOrder,
  onSelectAll
}: ArchivedOrdersDataTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleDeleteSingle = async () => {
    if (!orderToDelete) return;

    try {
      setIsDeleting(true);

      // First check if admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        throw new Error("Not authorized");
      }

      // Delete the order
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderToDelete.id)
        .eq("archived", true); // Safety check

      if (error) throw error;

      toast.success("Order deleted successfully");
      setShowDeleteDialog(false);
      setOrderToDelete(null);
      
      // Reload the page or call parent refresh
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => {
            table.toggleAllPageRowsSelected(!!value);
            onSelectAll(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedOrders.includes(row.original.id)}
          onCheckedChange={(value: boolean) => {
            onSelectOrder(row.original.id, !!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }: { row: Row<Order> }) => (
        <Button
          variant="ghost"
          className="h-auto p-0 font-medium text-primary hover:underline"
          onClick={() => handleRowClick(row.original)}
        >
          #{row.original.id.slice(0, 8)}
        </Button>
      ),
    },
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
              {row.original.profiles?.display_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {row.original.profiles?.email}
            </p>
          </div>
        </div>
      ),
    },
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
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
            statusColors[row.original.status]
          }`}
        >
          {statusLabels[row.original.status]}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="min-w-[140px] space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleRowClick(row.original)}
          >
            <Eye className="mr-1 h-3 w-3" />
            View Details
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => {
              setOrderToDelete(row.original);
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        </div>
      ),
    },
  ]

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
    <>
      <Card className="max-w-[calc(100vw-3rem)]">
        <div className="p-6">
          <DataTable columns={columns} data={orders} />
        </div>
      </Card>

      <OrderDetailDialog
        order={selectedOrder}
        open={showOrderDetail}
        onOpenChange={setShowOrderDetail}
        isAdmin={true}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete order #{orderToDelete?.id.slice(0, 8)}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSingle}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}