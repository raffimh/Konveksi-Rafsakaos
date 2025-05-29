"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price_per_piece: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  image_url: z.string().url("Must be a valid URL"),
});

interface Material {
  id: string;
  name: string;
  description: string;
  price_per_piece: number;
  image_url: string;
}

interface EditMaterialDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialUpdated: () => void;
}

export function EditMaterialDialog({ 
  material, 
  open, 
  onOpenChange, 
  onMaterialUpdated 
}: EditMaterialDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price_per_piece: "",
      image_url: "",
    },
  });

  // Update form values when material changes
  useEffect(() => {
    if (material) {
      form.reset({
        name: material.name,
        description: material.description,
        price_per_piece: material.price_per_piece.toString(),
        image_url: material.image_url,
      });
    }
  }, [material, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!material) return;

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("materials")
        .update({
          name: values.name,
          description: values.description,
          price_per_piece: Number(values.price_per_piece),
          image_url: values.image_url,
        })
        .eq("id", material.id);

      if (error) throw error;

      toast.success("Material updated successfully");
      onOpenChange(false);
      onMaterialUpdated();
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Failed to update material");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Material</DialogTitle>
              <DialogDescription>
                Update the material information. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Cotton Combed 30s" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="High quality cotton fabric..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_per_piece"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Piece</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="50000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://images.unsplash.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Material</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}