import ErrorDiv from "@/components/shared/ErrorDiv";
import Header from "@/components/shared/Header";
import { checkAccToSubmissionsAndReturnSubmissions } from "@/lib/actions/task.actions";
import React, { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import AccRejSub from "@/components/shared/AccRejSub";
import { Loader2 } from "lucide-react";
import TaskLink from "@/components/shared/TaskLink";

async function CheckAccessAndRenderSubmissions({
  trackId,
  taskId,
}: {
  trackId: string;
  taskId: string;
}) {
  const {
    success,
    message,
    trackName,
    trackDescription,
    taskName,
    taskDescription,
    submissions,
  } = await checkAccToSubmissionsAndReturnSubmissions(trackId, taskId);

  if (!success) {
    return <ErrorDiv errorMessage={message} />;
  } else {
    return (
      <>
        <Header heading={trackName} description={trackDescription} />
        <main>
          <section className="text-center py-4 border-b">
            <h2 className="text-2xl font-semibold">{taskName}</h2>
            <p className="text-muted-foreground">{taskDescription}</p>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {submissions?.length === 0 && (
              <p className="text-center text-muted-foreground">
                There are no submissions yet
              </p>
            )}
            {submissions?.map((submission) => (
              <div
                key={submission.taskId}
                className="p-6 flex flex-col gap-6 bg-accent/50 transition-colors border border-transparent hover:border-border rounded-lg"
              >
                <div className="flex gap-4 items-start flex-row flex-wrap">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={submission.photo} />
                    <AvatarFallback>
                      <Skeleton className="h-full w-full rounded-full bg-primary/50 animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {submission.first_name} {submission.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {submission.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {submission.taskGitHubUrl && (
                    <TaskLink
                      linkType="Github"
                      link={submission.taskGitHubUrl}
                    />
                  )}

                  {submission.taskKglUrl && (
                    <TaskLink linkType="Kaggel" link={submission.taskKglUrl} />
                  )}

                  {submission.taskWebUrl && (
                    <TaskLink linkType="Website" link={submission.taskWebUrl} />
                  )}
                </div>
                <div className="flex flex-row flex-wrap gap-2 justify-end">
                  <AccRejSub submissionId={submission.submissionId} />
                </div>
              </div>
            ))}
          </section>
        </main>
      </>
    );
  }
}

const TrackTaskSubmissions = ({
  params,
}: {
  params: { trackId: string; taskId: string };
}) => {
  return (
    <Suspense
      fallback={
        <main className="w-full min-h-screen fl_center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </main>
      }
    >
      <CheckAccessAndRenderSubmissions
        trackId={params.trackId}
        taskId={params.taskId}
      />
    </Suspense>
  );
};

export default TrackTaskSubmissions;
