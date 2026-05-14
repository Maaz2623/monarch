import { CategoryOne } from "@/components/commercn/categories/category-01";
import Navbar from "@/components/navbar";
import { HydrateClient } from "@/trpc/server";
import React from "react";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="p-10 flex flex-col gap-y-20">
        {/* <CategoryOne /> */}
        <div className="flex flex-wrap justify-center items-start space-x-[5%] space-y-[5%]">
          {children}
        </div>
      </div>
    </>
    
  );
};
