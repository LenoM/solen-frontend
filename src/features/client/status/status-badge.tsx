import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, InfoIcon } from "lucide-react";

import { toDateValue } from "@/utils/format-utils";

function StatusBadge(data: any) {
  const { reason, cancelDate, registrationDate, isActive } = data;

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <span tabIndex={0}>
            <Badge
              variant={isActive ? "active" : "destructive"}
              className="rounded-xl"
            >
              {isActive ? "Ativo" : "Cancelado"}
              <InfoIcon className="h-3 w-3 ml-2" />
            </Badge>
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="w-50">
          <div className="flex">
            <div className="space-y-1">
              <h4 className="text-sm text-left font-semibold">
                {isActive ? "Inclusão" : `Motivo: ${reason}`}
              </h4>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  {isActive
                    ? toDateValue(registrationDate)
                    : toDateValue(cancelDate)}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </>
  );
}

export { StatusBadge };
