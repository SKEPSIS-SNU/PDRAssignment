import ErrorDiv from "@/components/shared/ErrorDiv";
import Intro from "@/components/shared/Intro";
import Users from "@/components/shared/Users";
import { checkAccesstoTrackAndReturnUsers } from "@/lib/actions/track.actions";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

async function CheckAccessAndRenderUsers({ trackId }: { trackId: string }) {
  const { success, message, trackUsers, track } =
    await checkAccesstoTrackAndReturnUsers(trackId);

  if (success) {
    return (
      <main>
        <Intro
          heading={track.track_name}
          description={track.track_description}
          isAdmin={true}
          banner={track.banner}
        />
        <h2 className="text-xl mt-6 font-bold">Users</h2>
        <Users users={trackUsers} trackId={trackId} />
      </main>
    );
  } else {
    return (
      <main className="min-h-screen">
        <ErrorDiv errorMessage={message} />
      </main>
    );
  }
}

export default function TrackUsersPage({
  params,
}: {
  params: { trackId: string };
}) {
  return (
    <Suspense
      fallback={
        <main className="w-full min-h-[50vh] fl_center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </main>
      }
    >
      <CheckAccessAndRenderUsers trackId={params.trackId} />
    </Suspense>
  );
}
