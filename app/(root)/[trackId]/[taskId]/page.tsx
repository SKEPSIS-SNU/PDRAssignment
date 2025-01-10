import ErrorDiv from "@/components/shared/ErrorDiv";
import TaskSubmitionForm from "@/components/shared/TaskSubmitionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { checkAndGetTrackAndTask } from "@/lib/actions/task.actions";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskLink from "@/components/shared/TaskLink";
import AccRejSub from "@/components/shared/AccRejSub";

async function CheckAccessAndRenderTask({
  trackId,
  taskId,
}: {
  trackId: string;
  taskId: string;
}) {
  const { success, message, isAdmin, track, task, submissions, assignment } =
    await checkAndGetTrackAndTask(trackId, taskId);

  console.log(submissions);

  if (!success) {
    return <ErrorDiv errorMessage={message} />;
  } else {
    return (
      <main>
        <section className="flex flex-col gap-4 md:gap-6 md:flex-row items-start mb-6">
          {task.image && (
            <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-lg relative">
              <Image
                src={task.image}
                width={400}
                height={400}
                alt="banner"
                className="w-full h-full object-cover relative z-10"
                priority={true}
              />

              <Skeleton className="w-full h-full absolute bg-primary/50" />
            </div>
          )}
          <div className="relative w-full md:w-1/2">
            <div>
              <Badge>{track.track_name}</Badge>
              <h1 className="text-4xl font-semibold mt-1">{task.task_name}</h1>
            </div>

            <p className="text-muted-foreground text-lg mt-2 tracking-wide">
              {task.task_description}
            </p>

            <div className="p-4 border rounded-lg bg-accent/50 mt-3 text-muted-foreground">
              <p>{task.read_more}</p>
            </div>
          </div>
        </section>
        {isAdmin ? (
          <section className="pb-6">
            <h2 className="text-lg tracking-wider mb-4">Submissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {submissions.length > 0 ? (
                <>
                  {submissions.map((submission: any) => (
                    <div
                      key={submission.taskId}
                      className="p-6 flex flex-col gap-6 border rounded-2xl "
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
                          <TaskLink
                            linkType="Github"
                            link={submission.github_link}
                          />
                        )}

                        {submission.kaggle_link && (
                          <TaskLink
                            linkType="Kaggel"
                            link={submission.kaggle_link}
                          />
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
                </>
              ) : (
                <p className="text-muted-foreground">No submissions yet</p>
              )}
            </div>
          </section>
        ) : (
          <section className="pb-6">
            {assignment.status === "review" && (
              <Button variant={"secondary"} disabled>
                Submission under review
              </Button>
            )}
            {assignment.status === "in-progress" && (
              <TaskSubmitionForm trackId={track._id} taskId={task._id} />
            )}
            {assignment.status === "completed" && (
              <Button variant={"secondary"} disabled>
                Submission under review
              </Button>
            )}
            {task.status === "completed" && (
              <Button className="bg-green-600 hover:bg-green-700" disabled>
                Completed
              </Button>
            )}
            {task.status === "expired" && (
              <Button disabled variant={"destructive"}>
                Expired
              </Button>
            )}
          </section>
        )}
      </main>
    );
  }
  //   return <TaskSubmitionForm trackId={trackId} taskId={taskId} />;
}

export default function TrackTaskPage({
  params,
}: {
  params: { trackId: string; taskId: string };
}) {
  return (
    <Suspense
      fallback={
        <main className="w-full min-h-[50vh] fl_center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </main>
      }
    >
      <CheckAccessAndRenderTask
        trackId={params.trackId}
        taskId={params.taskId}
      />
    </Suspense>
  );
}
