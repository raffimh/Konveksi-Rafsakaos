"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  estimateProductionTime,
  getActiveOrdersCount,
} from "@/lib/ai/production-estimate";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  material: z.string({
    required_error: "Please select a material",
  }),
  quantity: z
    .number({
      required_error: "Please enter quantity",
    })
    .min(24, "Minimum order is 24 pieces")
    .max(1000, "Maximum order is 1000 pieces"),
  design_description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface Material {
  id: string;
  name: string;
  description: string;
  price_per_piece: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [estimatedDays, setEstimatedDays] = useState<number | null>(null);
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 24,
      design_description: "",
    },
  });

  // Watch values for price calculation
  const selectedMaterial = materials.find(
    m => m.name === form.watch("material")
  );
  const quantity = form.watch("quantity") || 0;
  const totalAmount = selectedMaterial
    ? selectedMaterial.price_per_piece * quantity
    : 0;

  // Load materials and calculate initial estimation
  useEffect(() => {
    async function initialize() {
      try {
        // Load materials
        const { data: materialsData, error: materialsError } = await supabase
          .from("materials")
          .select("*")
          .order("name");

        if (materialsError) throw materialsError;
        setMaterials(materialsData || []);

        // Get user and active orders for estimation
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const activeOrders = await getActiveOrdersCount(supabase, user.id);
        const estimate = estimateProductionTime({
          newOrderQuantity: quantity,
          activeOrdersCount: activeOrders,
        });
        setEstimatedDays(estimate);
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to load materials");
      }
    }

    initialize();
  }, [supabase, quantity]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("File must be an image (JPEG, PNG, or WebP)");
        return;
      }

      setSelectedFile(file);
    }
  };

  async function onSubmit(values: FormValues) {
    if (!selectedFile) {
      toast.error("Please upload a design file");
      return;
    }

    try {
      setIsLoading(true);
      const toastId = toast.loading("Creating your order...");

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication error", { id: toastId });
        return;
      }

      // Generate unique code
      const uniqueCode = Math.floor(Math.random() * 900) + 100; // 100-999

      // Upload design file
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("designs")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload design", { id: toastId });
        return;
      }

      // Get file URL
      const { data: urlData } = supabase.storage
        .from("designs")
        .getPublicUrl(uploadData.path);

      if (!urlData.publicUrl) {
        toast.error("Failed to get design URL", { id: toastId });
        return;
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          material: values.material,
          quantity: values.quantity,
          design_url: urlData.publicUrl,
          design_description: values.design_description,
          total_amount: totalAmount,
          unique_code: uniqueCode,
          estimated_completion_days: estimatedDays,
          status: "menunggu_pembayaran",
          is_paid: false,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        // Try to clean up uploaded file
        await supabase.storage.from("designs").remove([fileName]);

        toast.error("Failed to create order", { id: toastId });
        return;
      }

      toast.success("Order created successfully! Redirecting to payment...", { id: toastId });
      
      // Redirect to payment page
      router.push(`/customer/orders/${orderData.id}/payment`);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {materials.map(material => (
                          <SelectItem key={material.id} value={material.name}>
                            {material.name} -{" "}
                            {formatCurrency(material.price_per_piece)}/pc
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (minimum 24 pcs)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={24}
                        placeholder="Enter quantity"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Design File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Maximum file size: 5MB. Supported formats: JPEG, PNG, WebP
                </p>
              </FormItem>

              <FormField
                control={form.control}
                name="design_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Description & Placement</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe where and how you want the design to be placed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Price per piece:</span>
                      <span>
                        {selectedMaterial
                          ? formatCurrency(selectedMaterial.price_per_piece)
                          : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quantity:</span>
                      <span>{quantity} pcs</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Payment Code:</span>
                      <span>Will be generated after order creation</span>
                    </div>
                    {estimatedDays && (
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span>Estimated Completion:</span>
                        <span>{estimatedDays} days</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Order..." : "Create Order"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
