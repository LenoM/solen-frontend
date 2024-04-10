import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import { features } from "../../features";
import SidebarItem from "./sidebar-item";

export default function Sidebar() {
  return (
    <div className="fixed">
      <Sheet key="left">
        <SheetTrigger asChild>
          <Button variant="outline" className="w-14 m-2">
            <span className="sr-only">Open sidebar</span>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className={"md:w-1/4 xl:w-auto"} side={"left"}>
          <SheetHeader>
            <SheetTitle className="mb-4 mt-4 font-bold text-2xl">Solen</SheetTitle>
          </SheetHeader>

          <SheetClose asChild>
            <ul className="space-y-2 font-medium">
              {features
                .filter((feat) => feat.isMenuItem === true)
                .map((menu, key) => {
                  return (
                    <SidebarItem
                      label={menu.label}
                      path={menu.path}
                      key={key}
                      icon={menu.icon}
                    />
                  );
                })}
            </ul>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );
}
