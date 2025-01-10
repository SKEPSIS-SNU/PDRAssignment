import ErrorDiv from "@/components/shared/ErrorDiv";
import { checkAccesstoTrackAndReturnApplications } from "@/lib/actions/track.actions";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Applications from "@/components/shared/Applications";
import Intro from "@/components/shared/Intro";

async function CheckUserAccessAndRender({ trackId }: { trackId: string }) {
  const { success, message, track, applicants } =
    await checkAccesstoTrackAndReturnApplications(trackId);
  if (success) {
    return (
      <main>
        <Intro
          heading={track.track_name}
          description={track.track_description}
          isAdmin={true}
          banner={track.banner}
        />
        <h2 className="text-xl mt-6 font-bold">Applications</h2>
        {applicants.length > 0 ? (
          <Applications applicants={applicants} trackId={trackId} />
        ) : (
          <p className="mt-6 text-muted-foreground">No applications yet</p>
        )}
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

const TrackApplicationsPage = ({ params }: { params: { trackId: string } }) => {
  return (
    <Suspense
      fallback={
        <main className="w-full min-h-[50vh] fl_center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </main>
      }
    >
      <CheckUserAccessAndRender trackId={params.trackId} />
    </Suspense>
  );
};

export default TrackApplicationsPage;
