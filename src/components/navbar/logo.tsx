import Image from "next/image";

export const Logo = () => (
  <div className="flex items-center gap-x-3 justify-center">
    <Image src={`/logo.svg`} width={40} height={40} alt="logo" />
    <h4 className="font-semibold text-2xl">Monarch</h4>
  </div>
);
