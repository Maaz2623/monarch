import { HomeLayout } from "@/features/home/components/home-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeLayout>{children}</HomeLayout>;
}
