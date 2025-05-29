"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Copy, RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface PaymentDetailsProps {
  orderId: string
  amount: number
  uniqueCode: number
  onPaymentComplete?: () => void
}

export function PaymentDetails({ 
  orderId, 
  amount, 
  uniqueCode,
  onPaymentComplete 
}: PaymentDetailsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const totalAmount = amount + uniqueCode

  async function simulatePayment() {
    try {
      setIsLoading(true)
      const toastId = toast.loading("Processing payment...")

      // Update order status to diproses
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: "diproses",
          is_paid: true 
        })
        .eq("id", orderId)

      if (error) throw error

      toast.success("Payment successful", { id: toastId })
      
      // Call onPaymentComplete callback if provided
      if (onPaymentComplete) {
        onPaymentComplete()
      }

      // Refresh the page data
      router.refresh()
    } catch {
      toast.error("Failed to process payment")
    } finally {
      setIsLoading(false)
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Failed to copy")
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Bank Transfer BCA</h4>
            <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
              <span>1234567890</span>
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
            <div className="flex justify-between items-center">
              <span className="text-sm">Order Amount:</span>
              <span>{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Unique Code:</span>
              <span className="text-yellow-600">+{uniqueCode}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t font-medium">
              <span>Total Payment:</span>
              <div className="flex items-center gap-2">
                <span>{formatCurrency(totalAmount)}</span>
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
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Please transfer the exact amount including the unique code for automatic verification.
          </p>
          
          {/* Simulation button - Only for demo purposes */}
          <Button 
            className="w-full"
            onClick={simulatePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Simulate Payment"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}