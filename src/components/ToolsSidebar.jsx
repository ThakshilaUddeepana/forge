import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import ToolBar from "./ToolBar";

export function ToolsSidebar({ manualSync, onDownload }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden fixed top-[72px] left-3 h-10 w-10 z-50 bg-orange-600 border-none shadow-xl shadow-orange-600/30 text-white hover:bg-orange-500 rounded-xl active:scale-95 transition-all"
        >
          <Menu className="h-7 w-7" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[340px] bg-[#0a0a0a] border-white/5 text-white p-0">
        <div className="p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-white text-lg font-black uppercase tracking-tighter">Design Tools</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)]">
            <div className="pr-2">
              <ToolBar manualSync={manualSync} onDownload={onDownload} />
            </div>
          </ScrollArea>
        </div>
      </SheetContent>

      {/* Desktop version - always visible */}
      <div className="hidden lg:block shrink-0">
        <div className="w-[240px] h-screen border-r border-white/5 bg-[#0f0f0f] text-white">
          <div className="p-6">
            <h2 className="font-semibold mb-6 text-sm text-gray-400 uppercase tracking-wider">Design Tools</h2>
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="pr-4">
                <ToolBar manualSync={manualSync} onDownload={onDownload} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
