import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { features } from "../../features";
import SidebarItem from "./sidebar-item";

export default function Sidebar() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet key="left">
        <SheetTrigger asChild>
          <Button variant="outline" className="w-14 m-2">
            <span className="sr-only">Open sidebar</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
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
