"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type MapReturnButtonProps = {
  title?: string;
};

const MapReturnButton = ({ title = "Cancel" }: MapReturnButtonProps) => {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.push("/map")}>
      {title}
    </Button>
  );
};

export default MapReturnButton;
