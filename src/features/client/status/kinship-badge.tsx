import { Badge } from "@/components/ui/badge";

function KinshipBadge({ kinship = ''}) {
  const isHolder = kinship === "Titular";

  return (
    <span tabIndex={0}>
      <Badge variant={isHolder ? "active" : "alert"} className="rounded-xl">
        {kinship}
      </Badge>
    </span>
  );
}

export { KinshipBadge };
