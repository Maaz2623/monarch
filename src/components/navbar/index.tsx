"use client";
import { ShoppingCartIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { CartSheet } from "../cart-sheet";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { UserButton } from "../user-button";
const Navbar = () => {
  const trpc = useTRPC();

  const { data: items } = useSuspenseQuery(trpc.cart.getItems.queryOptions());

  return (
    <nav className="h-16 border-b bg-background">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between">
        <div className="flex items-center gap-12">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
        </div>

        <div className="flex items-center gap-x-4">
          <CartSheet>
            <Button size="icon" variant="ghost" className="relative">
              <span className="absolute -top-2 bg-rose-600 px-2 py-0.5 text-white rounded-full -right-2 text-xs">
                {items.length}
              </span>
              <ShoppingCartIcon />
            </Button>
          </CartSheet>
          <UserButton />

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
