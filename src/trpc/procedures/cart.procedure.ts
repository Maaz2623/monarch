import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { cart, cartItems, products } from "@/db/schema";
import * as z from "zod";
import { eq, sql } from "drizzle-orm";

export const cartProcedure = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    await db.insert(cart).values({
      userId: ctx.auth.user.id,
    });
  }),
  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [userCart] = await db
        .select()
        .from(cart)
        .where(eq(cart.userId, ctx.auth.user.id));

      await db.insert(cartItems).values({
        cartId: userCart.id,
        productId: input.productId,
      });
    }),
  getItems: protectedProcedure.query(async ({ ctx }) => {
    const [userCart] = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, ctx.auth.user.id));

    const items = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        product: {
          id: products.id,
          title: products.title,
          price: products.price,
          imageUrl: products.imageUrl,
        },
        quantity: cartItems.quantity,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, userCart.id));

    return items;
  }),
  increment: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await db
          .update(cartItems)
          .set({
            quantity: sql`${cartItems.quantity} + 1`,
          })
          .where(eq(cartItems.id, input.cartItemId));
      } catch (err) {
        console.error("INCREMENT ERROR:", err);
        throw err;
      }
    }),
  decrement: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const [item] = await db
          .select()
          .from(cartItems)
          .where(eq(cartItems.id, input.cartItemId));

        if (!item) return;

        if (item.quantity <= 1) {
          // 🔥 remove item completely
          await db.delete(cartItems).where(eq(cartItems.id, input.cartItemId));
        } else {
          // ➖ decrement
          await db
            .update(cartItems)
            .set({
              quantity: sql`${cartItems.quantity} - 1`,
            })
            .where(eq(cartItems.id, input.cartItemId));
        }
      } catch (err) {
        console.error("DECREMENT ERROR:", err);
        throw err;
      }
    }),
  deleteItem: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.delete(cartItems).where(eq(cartItems.id, input.cartItemId));
    }),
  getSummary: protectedProcedure.query(async () => {
    const items = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        product: products,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id));

    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0,
    );

    const tax = subtotal * 0.18; // GST example
    const total = subtotal + tax;

    return {
      items,
      subtotal,
      tax,
      total,
    };
  }),
});
