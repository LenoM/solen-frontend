import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { formatCPF } from "@/utils/format-utils";

function KinshipBadge(data: any) {
  const { holderId, holder } = data;

  const newPath = `${window.origin}/client/${holder?.id}`;

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <span tabIndex={0}>
            <Badge
              variant={holderId ? "destructive" : "active"}
              className="rounded-xl"
            >
              {holderId ? "Dependente" : "Titular"}
              <InfoIcon className="h-3 w-3 ml-2" />
            </Badge>
          </span>
        </HoverCardTrigger>
        {holderId && (
          <HoverCardContent className="w-50">
            <div className="flex">
              <div className="space-y-1">
                <h4 className="text-sm text-left font-semibold">Titular</h4>

                <p className="text-xs text-muted-foreground">
                  {holder.socialName}
                </p>
                <p className="text-xs text-muted-foreground">
                  CPF: {formatCPF(holder.cpf)}
                </p>

                <Link to={newPath}>
                  <Button variant="outline" className="h-8 p-0 mt-4 w-full">
                    <span>Abrir</span>
                  </Button>
                </Link>
              </div>
            </div>
          </HoverCardContent>
        )}
      </HoverCard>
    </>
  );
}

export { KinshipBadge };
