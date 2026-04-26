"use client";

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CartItemProps {
  id: string;
  name: string;
  category: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
}

export function ShoppingCartOne(cartItem: CartItemProps) {
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const incrementQuantity = useMutation(trpc.cart.increment.mutationOptions());
  const decrementQuantity = useMutation(trpc.cart.decrement.mutationOptions());

  const deleteItem = useMutation(trpc.cart.deleteItem.mutationOptions());

  const isPending =
    incrementQuantity.isPending ||
    decrementQuantity.isPending ||
    deleteItem.isPending;

  return (
    <fieldset disabled={isPending}>
      <Card className="w-full max-w-[480px] bg-muted border-0 shadow-none rounded-xl not-prose p-4 flex-row gap-4">
        <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={cartItem.imageUrl || ""}
            alt={cartItem.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <CardDescription>{cartItem.category}</CardDescription>
              <CardTitle>{cartItem.name}</CardTitle>
            </div>

            <Button
              onClick={() =>
                deleteItem.mutate(
                  {
                    cartItemId: cartItem.id,
                  },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries(
                        trpc.cart.getItems.queryOptions(),
                      );
                      queryClient.invalidateQueries(
                        trpc.cart.getSummary.queryOptions(),
                      );
                      toast.success(`Removed ${cartItem.name}`);
                    },
                  },
                )
              }
              size="icon"
              variant="ghost"
              className="text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center bg-background text-foreground rounded-lg border border-gray-200">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-muted"
                onClick={() =>
                  decrementQuantity.mutate(
                    {
                      cartItemId: cartItem.id,
                    },
                    {
                      onSuccess: () => {
                        if (quantity > 1) {
                          setQuantity((prev) => prev - 1);
                          queryClient.invalidateQueries(
                            trpc.cart.getSummary.queryOptions(),
                          );
                        } else {
                          queryClient.invalidateQueries(
                            trpc.cart.getItems.queryOptions(),
                          );
                          queryClient.invalidateQueries(
                            trpc.cart.getSummary.queryOptions(),
                          );
                        }
                      },
                    },
                  )
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">
                {quantity}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-muted"
                onClick={() =>
                  incrementQuantity.mutate(
                    {
                      cartItemId: cartItem.id,
                    },
                    {
                      onSuccess: () => {
                        setQuantity((prev) => prev + 1);
                        queryClient.invalidateQueries(
                          trpc.cart.getSummary.queryOptions(),
                        );
                      },
                    },
                  )
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-xl font-semibold">
              ${(cartItem.price * quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </fieldset>
  );
}
