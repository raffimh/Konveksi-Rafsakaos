"use client";

import { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Package,
  User,
  CreditCard,
  FileImage,
  Clock,
  ExternalLink,
  Copy,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Order {
  id: string;
  created_at: string;
  material: string;
  quantity: number;
  design_url: string;
  design_description: string;
  total_amount: number;
  unique_code: number;
  status: 'menunggu_pembayaran' | 'diproses' | 'produksi' | 'selesai';
  estimated_completion_days?: number;
  is_paid: boolean;
  customer?: {
    display_name: string;
    email: string;
  };
  profiles?: {
    display_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
}

const statusColors = {
  menunggu_pembayaran: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  diproses: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  produksi: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  selesai: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
};

const statusLabels = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  diproses: "Diproses",
  produksi: "Dalam Produksi",
  selesai: "Selesai",
};

export function OrderDetailDialog({ 
  order, 
  open, 
  onOpenChange, 
  isAdmin = false 
}: OrderDetailDialogProps) {
  const [imageLoading, setImageLoading] = useState(true);

  if (!order) return null;

  const customerInfo = order.profiles || order.customer;
  const avatarUrl = order.profiles?.avatar_url;
  const totalWithCode = order.total_amount + order.unique_code;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const openDesignInNewTab = () => {
    window.open(order.design_url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] !w-[90vw] max-h-[90vh] overflow-y-auto sm:!max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            Complete information about order #{order.id.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Order Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(order.id, "Order ID")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm">
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Status:</span>
                  <Badge variant={order.is_paid ? "default" : "secondary"}>
                    {order.is_paid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>

                {order.estimated_completion_days && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Days:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">{order.estimated_completion_days} days</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Info (Admin only) */}
            {isAdmin && customerInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={avatarUrl} 
                        alt={customerInfo.display_name} 
                      />
                      <AvatarFallback>
                        {customerInfo.display_name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customerInfo.display_name}</p>
                      <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Material:</span>
                  <span className="text-sm font-medium">{order.material}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Quantity:</span>
                  <span className="text-sm font-medium">{order.quantity} pieces</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <span className="text-sm font-medium">Design Description & Placement:</span>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm leading-relaxed">
                      {order.design_description || "No description provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Order Amount:</span>
                  <span className="text-sm">{formatCurrency(order.total_amount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unique Code:</span>
                  <span className="text-sm text-yellow-600">+{order.unique_code}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Payment:</span>
                  <span className="text-lg font-bold">{formatCurrency(totalWithCode)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Design Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileImage className="h-4 w-4" />
                  Design Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted/30 min-h-[300px]">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    )}
                    <Image
                      src={order.design_url}
                      alt={`Design for order ${order.id}`}
                      fill
                      className="object-contain"
                      onLoadingComplete={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={openDesignInNewTab}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Full Size
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(order.design_url, "Design URL")}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {order.is_paid && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payment Confirmed</p>
                        <p className="text-xs text-muted-foreground">Payment received</p>
                      </div>
                    </div>
                  )}

                  {(order.status === 'diproses' || order.status === 'produksi' || order.status === 'selesai') && (
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${order.status === 'diproses' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Processing Started</p>
                        <p className="text-xs text-muted-foreground">Order is being processed</p>
                      </div>
                    </div>
                  )}

                  {(order.status === 'produksi' || order.status === 'selesai') && (
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${order.status === 'produksi' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">In Production</p>
                        <p className="text-xs text-muted-foreground">Manufacturing in progress</p>
                      </div>
                    </div>
                  )}

                  {order.status === 'selesai' && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-xs text-muted-foreground">Order ready for pickup/delivery</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
