import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import { getTracks } from "@/lib/actions/track.actions";
import ErrorDiv from "./ErrorDiv";
import CreateTrack from "./CreateTrack";
import TrackListClient from "./TrackListClient";
import { Suspense } from "react";
import JoinTrack from "./JoinTrack";

const Sidebar = async () => {
  const { success, isAdmin, tracks } = await getTracks();
  // console.log(isAdmin, tracks);

  return (
    <aside className="hidden md:block w-64 lg:w-72 h-screen fixed top-0 left-0 border-r z-10 px-2 lg:px-3">
      <p className="text-2xl font-semibold pt-6">LOGO</p>
      <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto">
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
            <TrackListClient tracks={tracks} />
          ) : (
            <ErrorDiv errorMessage="Failed to get tracks" />
          )}
        </Suspense>
      </div>
    </aside>
  );
};

export default Sidebar;
