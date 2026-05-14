"use client";
import { Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

interface ProductDataProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
}

export function ProductCardOne({
  id,
  name,
  description,
  price,
  imageUrl,
}: ProductDataProps) {
  const trpc = useTRPC();

  const addItem = useMutation(trpc.cart.addItem.mutationOptions());

  const queryClient = useQueryClient();

  const handleAddItemToCart = () => {
    addItem.mutate(
      {
        productId: id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.cart.getItems.queryOptions());
          queryClient.invalidateQueries(trpc.cart.getSummary.queryOptions());
          toast.success(`${name} added to cart`);
        },
      },
    );
  };

  return (
    <fieldset disabled={addItem.isPending}>
      <Card className="w-full max-w-[320px]">
        <CardContent>
          {/* Product Image */}
          <div className="relative mb-6">
            <div className="bg-gray-100 rounded-2xl flex items-center justify-center h-[280px] relative overflow-hidden">
              <img
                src={imageUrl || ""}
                alt={name}
                className="w-full h-full object-fit"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
              >
                <Heart />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="mb-4">
            <CardTitle className="text-xl leading-tight mb-2">{name}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">₹{price.toFixed(2)}</p>

            <Button onClick={handleAddItemToCart}>Add to Cart</Button>
          </div>
        </CardContent>
      </Card>
    </fieldset>
  );
}
