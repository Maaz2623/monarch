"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { ShoppingCartOne } from "./commercn/carts/cart-01";
import { ScrollArea } from "./ui/scroll-area";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface CartSheetProps {
  children: React.ReactNode;
}

export const CartSheet = ({ children }: CartSheetProps) => {
  const trpc = useTRPC();

  const { data: items } = useSuspenseQuery(trpc.cart.getItems.queryOptions());

  const { data: summary } = useQuery(trpc.cart.getSummary.queryOptions());

  const router = useRouter();

  if (!items) {
    return <p>loading...</p>;
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger className="relative" asChild>
        {children}
      </DrawerTrigger>

      <DrawerContent className="flex flex-col h-full w-full sm:max-w-md bg-background">
        {/* Header */}
        <DrawerHeader className="px-6 py-4 border-b">
          <DrawerTitle className="text-lg sm:text-xl flex gap-x-2 font-semibold">
            Your Cart
            <p className="text-muted-foreground">({items.length} items)</p>
          </DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        {/* Scrollable Content */}
        <ScrollArea className="h-[70%] px-6 py-4">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <ShoppingCartOne
                name={item.product.title}
                price={Number(item.product.price)}
                imageUrl={item.product.imageUrl}
                key={item.id}
                quantity={item.quantity}
                category="Default"
                id={item.id}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <DrawerFooter className="px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-semibold">
              {summary ? `$${summary.subtotal}` : "Loading..."}
            </p>
          </div>
          <Button className="w-full" onClick={() => router.push(`/checkout`)}>
            Checkout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
