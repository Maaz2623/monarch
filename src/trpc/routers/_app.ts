import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { cartProcedure } from "../procedures/cart.procedure";
export const appRouter = createTRPCRouter({
  cart: cartProcedure
});
// export type definition of API
export type AppRouter = typeof appRouter;
