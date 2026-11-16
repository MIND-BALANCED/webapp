import { Suspense } from "react";
import { Cargando } from "@/components/panel/ui";
import { DetalleSolicitud } from "./DetalleSolicitud";

export default function Page() {
  return (
    <Suspense fallback={<Cargando />}>
      <DetalleSolicitud />
    </Suspense>
  );
}
