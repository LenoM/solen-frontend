import { Badge } from "@/components/ui/badge";

function StatusBadge({isActive = false}) {
  return (
    <span tabIndex={0}>
      <Badge
        variant={isActive ? "active" : "destructive"}
        className="rounded-xl"
      >
        {isActive ? "Ativo" : "Cancelado"}
      </Badge>
    </span>
  );
}

export { StatusBadge };
