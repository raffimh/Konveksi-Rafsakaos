"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { AddMaterialDialog } from "./add-material-dialog";
import { EditMaterialDialog } from "./edit-material-dialog";
import { DeleteMaterialDialog } from "./delete-material-dialog";

interface Material {
  id: string;
  name: string;
  description: string;
  price_per_piece: number;
  image_url: string;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const supabase = createClient();

  const loadMaterials = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: materials, error } = await supabase
        .from("materials")
        .select("*")
        .order("name");

      if (error) throw error;
      setMaterials(materials);
    } catch (error) {
      console.error("Error loading materials:", error);
      toast.error("Failed to load materials");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const filteredMaterials = materials?.filter(material =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (material: Material) => {
    setEditingMaterial(material);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (material: Material) => {
    setDeletingMaterial(material);
    setShowDeleteDialog(true);
  };

  const handleEditDialogClose = () => {
    setShowEditDialog(false);
    setEditingMaterial(null);
  };

  const handleDeleteDialogClose = () => {
    setShowDeleteDialog(false);
    setDeletingMaterial(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Materials</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          <AddMaterialDialog onMaterialAdded={loadMaterials} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMaterials?.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src={material.image_url || "https://via.placeholder.com/400x300"}
                  alt={material.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{material.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {material.description}
                    </p>
                    <p className="font-medium text-primary">
                      {formatCurrency(material.price_per_piece)}/pc
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEditClick(material)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteClick(material)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No materials found.</p>
        </div>
      )}

      {/* Edit Material Dialog */}
      <EditMaterialDialog
        material={editingMaterial}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onMaterialUpdated={() => {
          loadMaterials();
          handleEditDialogClose();
        }}
      />

      {/* Delete Material Dialog */}
      <DeleteMaterialDialog
        material={deletingMaterial}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onMaterialDeleted={() => {
          loadMaterials();
          handleDeleteDialogClose();
        }}
      />
    </div>
  );
}
