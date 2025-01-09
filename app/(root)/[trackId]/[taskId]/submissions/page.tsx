import ErrorDiv from "@/components/shared/ErrorDiv";
import { checkAccToSubmissionsAndReturnSubmissions } from "@/lib/actions/task.actions";
import React, { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import AccRejSub from "@/components/shared/AccRejSub";
import { Loader2 } from "lucide-react";
import TaskLink from "@/components/shared/TaskLink";
import Intro from "@/components/shared/Intro";

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
    trackBanner,
    taskName,
    taskDescription,
    submissions,
  } = await checkAccToSubmissionsAndReturnSubmissions(trackId, taskId);

  console.log(submissions);

  if (!success) {
    return <ErrorDiv errorMessage={message} />;
  } else {
    return (
      <main>
        <Intro
          heading={trackName}
          description={trackDescription}
          isAdmin={true}
          banner={trackBanner}
        />
        <section className="py-4 border-b">
          <h2 className="text-2xl font-semibold">{taskName}</h2>
          <p className="text-muted-foreground text-lg tracking-wide">
            {taskDescription}
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {submissions.length === 0 && (
            <p className="text-center text-muted-foreground">
              There are no submissions yet
            </p>
          )}
          {submissions.length > 0 &&
            submissions.map((submission: any) => (
              <div
                key={submission.taskId}
                className="p-6 flex flex-col gap-6 bg-accent/50 transition-colors border border-transparent hover:border-border rounded-lg"
              >
                <div className="flex gap-4 items-start flex-row flex-wrap">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={submission.user_id.photo} />
                    <AvatarFallback>
                      <Skeleton className="h-full w-full rounded-full bg-primary/50 animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">
                      {submission.user_id.first_name}{" "}
                      {submission.user_id.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {submission.user_id.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {submission.github_link && (
                    <TaskLink linkType="Github" link={submission.github_link} />
                  )}

                  {submission.kaggle_link && (
                    <TaskLink linkType="Kaggel" link={submission.kaggle_link} />
                  )}

                  {submission.website_link && (
                    <TaskLink
                      linkType="Website"
                      link={submission.website_link}
                    />
                  )}
                </div>
                <div className="flex flex-row flex-wrap gap-2 justify-end">
                  <AccRejSub submissionId={submission.submission_id} />
                </div>
              </div>
            ))}
        </section>
      </main>
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
        <main className="w-full min-h-[50vh] fl_center">
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
