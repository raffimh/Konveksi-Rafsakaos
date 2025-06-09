"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Copy, CheckCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  material: string;
  quantity: number;
  total_amount: number;
  unique_code: number;
  status: string;
  is_paid: boolean;
  created_at: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadOrder() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("customer_id", user.id)
          .single();

        if (error) {
          console.error("Error loading order:", error);
          toast.error("Order not found");
          router.push("/customer/orders");
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error("Failed to load order:", error);
        toast.error("Failed to load order details");
        router.push("/customer/orders");
      } finally {
        setIsLoading(false);
      }
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId, supabase, router]);

  const totalAmount = order ? order.total_amount + order.unique_code : 0;

  async function handlePayment() {
    if (!order) return;

    try {
      setIsProcessingPayment(true);
      const toastId = toast.loading("Processing payment...");

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get current user to ensure authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication required", { id: toastId });
        router.push("/auth/login");
        return;
      }

      // Update order status and payment in one operation
      const { error } = await supabase
        .from("orders")
        .update({
          status: "diproses",
          is_paid: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", order.id)
        .eq("customer_id", user.id); // Ensure customer can only update their own orders

      if (error) {
        console.error("Payment error:", error);
        toast.error("Failed to process payment", { id: toastId });
        return;
      }

      // Update local state
      setOrder(prev => prev ? { ...prev, status: "diproses", is_paid: true } : null);

      toast.success("Payment successful! Your order is now being processed.", { id: toastId });

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        router.push("/customer/orders");
      }, 2000);

    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessingPayment(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Order not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If already paid, show success message
  if (order.is_paid) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/customer/orders")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Payment Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Your payment has been processed successfully!
              </p>
              <p className="text-green-700 text-sm mt-1">
                Your order is now being processed and you will receive updates on the progress.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order ID:</span>
                <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                  Processing
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/customer/orders")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <p className="text-muted-foreground">
            Please complete your payment to start order processing
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono">{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Material:</span>
                <span>{order.material}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span>{order.quantity} pcs</span>
              </div>
              <div className="flex justify-between">
                <span>Order Amount:</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Unique Code:</span>
                <span className="text-yellow-600">+{order.unique_code}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Payment:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Payment Details</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Bank Transfer BCA</h4>
                <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
                  <span className="font-mono">1234567890</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => copyToClipboard("1234567890")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Account Name: PT Rafsakaos Konveksi
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Total Amount</h4>
                <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
                  <span className="font-mono text-lg font-bold">{formatCurrency(totalAmount)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => copyToClipboard(totalAmount.toString())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Please transfer the exact amount including the unique code</p>
              <p>• Payment will be verified automatically</p>
              <p>• For demo purposes, click the button below to simulate payment</p>
            </div>
          </div>

          {/* Demo Payment Button */}
          <div className="pt-4 border-t">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Pay {formatCurrency(totalAmount)}
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Demo: This will simulate a successful payment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
