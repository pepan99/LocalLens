"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

type MapReturnButtonProps = {
  title?: string;
  className?: string;
};

const MapReturnButton = ({
  title = "Cancel",
  className = "",
}: MapReturnButtonProps) => {
  const router = useRouter();
  const path = usePathname();
  const isMapPage = path === "/map";
  console.log(`path: [${path}] ${isMapPage}`);

  return (
    !isMapPage && (
      <Button
        variant="outline"
        onClick={() => router.push("/map")}
        className={className}
      >
        {title}
      </Button>
    )
  );
};

export default MapReturnButton;
