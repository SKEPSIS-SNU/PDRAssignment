import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Sidebar } from "lucide-react";
import { getTracks } from "@/lib/actions/track.actions";
import ErrorDiv from "./ErrorDiv";
import CreateTrack from "./CreateTrack";
import TrackListClient from "./TrackListClient";
import { Suspense } from "react";
import JoinTrack from "./JoinTrack";

const TrackListMobile = async () => {
  const { success, isAdmin, tracks } = await getTracks();
  // console.log(isAdmin, tracks);
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden fixed z-20 left-4 bottom-4">
        <Button size="icon">
          <Sidebar className="scale-125" />
        </Button>
      </SheetTrigger>
      <SheetContent className="md:hidden">
        <SheetHeader>
          <p className="font-bold text-3xl">LOGO</p>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100vh-6rem)] w-full overflow-y-auto">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex flex-row items-center justify-between gap-2 flex-wrap py-4">
              {success && (
                <p className="text-primary font-semibold">
                  {isAdmin ? "All tracks" : "Your tracks"}
                </p>
              )}
              {success && <>{isAdmin ? <CreateTrack /> : <JoinTrack />}</>}
            </div>

            {success ? (
              <TrackListClient tracks={tracks} isMobile={true} />
            ) : (
              <ErrorDiv errorMessage="Failed to get tracks" />
            )}
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TrackListMobile;
