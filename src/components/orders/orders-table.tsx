import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { Package } from "lucide-react";

interface Order {
  id: string;
  created_at: string;
  material: string;
  quantity: number;
  design_url: string;
  design_description: string;
  total_amount: number;
  unique_code: number;
  status: "menunggu_pembayaran" | "diproses" | "produksi" | "selesai";
  estimated_completion_days?: number;
  is_paid: boolean;
  customer?: {
    display_name: string;
    email: string;
  };
  profiles?: {
    display_name: string;
    email: string;
  };
}

interface OrdersTableProps {
  orders: Order[] | null;
  isLoading: boolean;
  isAdmin?: boolean;
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

const statusColors = {
  menunggu_pembayaran: "text-yellow-600 bg-yellow-50",
  diproses: "text-blue-600 bg-blue-50",
  produksi: "text-purple-600 bg-purple-50",
  selesai: "text-green-600 bg-green-50",
};

const statusLabels = {
  menunggu_pembayaran: "Pending Payment",
  diproses: "Processing",
  produksi: "In Production",
  selesai: "Completed",
};

export function OrdersTable({
  orders,
  isLoading,
  isAdmin,
  onStatusChange,
}: OrdersTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    {isAdmin && <TableHead>Customer</TableHead>}
                    <TableHead>Date</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={isAdmin ? 7 : 6}>
                        <div className="h-16 bg-muted animate-pulse rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Order ID</TableHead>
                  {isAdmin && <TableHead className="whitespace-nowrap">Customer</TableHead>}
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead className="whitespace-nowrap">Details</TableHead>
                  <TableHead className="whitespace-nowrap">Total Amount</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  {isAdmin && <TableHead className="whitespace-nowrap">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!orders || orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 7 : 6}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-lg font-medium">No orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.id.slice(0, 8)}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="min-w-[200px]">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {order.profiles?.display_name ||
                                order.customer?.display_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.profiles?.email || order.customer?.email}
                            </p>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="min-w-[200px]">
                        <div className="space-y-1">
                          <p className="font-medium">{order.material}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.quantity} pcs
                          </p>
                          {order.design_url && (
                            <div className="relative w-12 h-12 rounded overflow-hidden">
                              <Image
                                src={order.design_url}
                                alt={`Design for order ${order.id}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="space-y-1">
                          <p>{formatCurrency(order.total_amount)}</p>
                          {order.unique_code && (
                            <p className="text-xs text-muted-foreground">
                              Code: {order.unique_code}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                              statusColors[order.status]
                            }`}
                          >
                            {statusLabels[order.status]}
                          </span>
                          {order.estimated_completion_days && (
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                              Est. {order.estimated_completion_days} days
                            </p>
                          )}
                        </div>
                      </TableCell>
                      {isAdmin && onStatusChange && (
                        <TableCell className="min-w-[140px]">
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              onStatusChange(order.id, value)
                            }
                            disabled={order.status === "selesai"}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="menunggu_pembayaran">
                                Pending Payment
                              </SelectItem>
                              <SelectItem value="diproses">Processing</SelectItem>
                              <SelectItem value="produksi">
                                In Production
                              </SelectItem>
                              <SelectItem value="selesai">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
