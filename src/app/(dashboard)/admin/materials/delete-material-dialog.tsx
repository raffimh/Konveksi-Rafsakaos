"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Material {
  id: string;
  name: string;
  description: string;
  price_per_piece: number;
  image_url: string;
}

interface DeleteMaterialDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialDeleted: () => void;
}

export function DeleteMaterialDialog({ 
  material, 
  open, 
  onOpenChange, 
  onMaterialDeleted 
}: DeleteMaterialDialogProps) {
  async function handleDelete() {
    if (!material) return;

    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("materials")
        .delete()
        .eq("id", material.id);

      if (error) throw error;

      toast.success("Material deleted successfully");
      onOpenChange(false);
      onMaterialDeleted();
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Failed to delete material");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Material</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{material?.name}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}