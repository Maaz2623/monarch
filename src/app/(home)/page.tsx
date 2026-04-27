import { CategoryOne } from "@/components/commercn/categories/category-01";
import { ProductCardOne } from "@/components/commercn/product-cards/product-card-01";
import Navbar from "@/components/navbar";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";
import { getQueryClient, HydrateClient, prefetch, trpc } from "@/trpc/server";

const HomePage = async () => {

  await requireAuth()


  const data = await db.select().from(products);

  prefetch(trpc.cart.getItems.queryOptions());

  return (
    <HydrateClient>
      <Navbar />
      <div className="p-10 flex flex-col gap-y-20">
        <CategoryOne />
        <div className="flex flex-wrap justify-center items-start space-x-[5%] space-y-[5%]">
          {data.map((product) => (
            <ProductCardOne
              id={product.id}
              key={product.id}
              name={product.title}
              description={product.description}
              price={Number(product.price)}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </div>
    </HydrateClient>
  );
};

export default HomePage;
