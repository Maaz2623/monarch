import { CheckoutOne } from "@/components/commercn/checkouts/checkout-01";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {

  return (
    <div className="h-full flex justify-center items-start py-6">
      <CheckoutOne />
    </div>
  );
}
