"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface Material {
  id: string;
  name: string;
  description: string;
  price_per_piece: number;
  image_url: string;
}

export default function CustomerMaterialsPage() {
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [quantityInput, setQuantityInput] = useState("24");
  const supabase = createClient();

  useEffect(() => {
    async function loadMaterials() {
      try {
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
    }

    loadMaterials();
  }, [supabase]);

  const filteredMaterials = materials?.filter(material =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuantityChange = (value: string) => {
    // Allow empty input
    if (value === "") {
      setQuantityInput("");
      return;
    }

    // Only allow numbers
    const numberValue = value.replace(/[^0-9]/g, "");
    setQuantityInput(numberValue);
  };

  const getValidQuantity = () => {
    const num = parseInt(quantityInput);
    if (isNaN(num) || num < 24) return 0;
    return num;
  };

  const calculateTotal = () => {
    if (!selectedMaterial) return 0;
    const quantity = getValidQuantity();
    return selectedMaterial.price_per_piece * quantity;
  };

  const isQuantityValid = getValidQuantity() >= 24;

  const handleCreateOrder = () => {
    if (!selectedMaterial || !isQuantityValid) {
      toast.error("Please select a material and enter valid quantity");
      return;
    }

    router.push(`/customer/orders/new?material=${selectedMaterial.name}&quantity=${getValidQuantity()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Available Materials</h2>
        <Input
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-[300px]"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredMaterials?.length ? (
              filteredMaterials.map((material) => (
                <Card 
                  key={material.id} 
                  className={`overflow-hidden group cursor-pointer transition-colors ${
                    selectedMaterial?.id === material.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedMaterial(material)}
                >
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
                    <div className="space-y-2">
                      <h3 className="font-semibold">{material.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {material.description}
                      </p>
                      <p className="font-medium text-primary">
                        {formatCurrency(material.price_per_piece)}/pc
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No materials found.</p>
              </div>
            )}
          </div>
        </div>

        <Card className="h-fit lg:sticky lg:top-4">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-4 w-4" />
              <h3 className="font-semibold">Price Calculator</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">
                  Selected Material
                </label>
                <p className="font-medium">
                  {selectedMaterial?.name || "None selected"}
                </p>
              </div>
              <div>
                <label htmlFor="quantity" className="text-sm text-muted-foreground">
                  Quantity (min. 24 pcs)
                </label>
                <Input
                  id="quantity"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantityInput}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className={!isQuantityValid && quantityInput !== "" ? "border-red-500" : ""}
                />
                {!isQuantityValid && quantityInput !== "" && (
                  <p className="text-xs text-red-500 mt-1">
                    Quantity must be at least 24 pieces
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground">
                  Total Price
                </label>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
                disabled={!selectedMaterial || !isQuantityValid}
                onClick={handleCreateOrder}
              >
                Create Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
