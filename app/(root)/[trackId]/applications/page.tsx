import ErrorDiv from "@/components/shared/ErrorDiv";
import Header from "@/components/shared/Header";
import { checkAccesstoTrackAndReturnApplications } from "@/lib/actions/track.actions";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Applications from "@/components/shared/Applications";

async function CheckUserAccessAndRender({ trackId }: { trackId: string }) {
  const { success, message, track, applicants } =
    await checkAccesstoTrackAndReturnApplications(trackId);

  // console.dir(applicants);

  if (success) {
    return (
      <>
        <Header
          heading={track.trackName}
          description={track.trackDescription}
        />
        <main>
          <h2 className="text-xl font-bold text-muted-foreground">
            Applications
          </h2>
          <Applications applicants={applicants} trackId={trackId} />
        </main>
      </>
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
        <main className="w-full min-h-screen fl_center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </main>
      }
    >
      <CheckUserAccessAndRender trackId={params.trackId} />
    </Suspense>
  );
};

export default TrackApplicationsPage;
