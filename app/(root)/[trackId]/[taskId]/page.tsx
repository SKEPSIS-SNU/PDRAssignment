import ErrorDiv from "@/components/shared/ErrorDiv";
import TaskSubmitionForm from "@/components/shared/TaskSubmitionForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { checkAndGetTrackAndTask } from "@/lib/actions/task.actions";
import { CircleX, Loader2 } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import TaskLink from "@/components/shared/TaskLink";
import EditTask from "@/components/shared/EditTask";
import DeleteTask from "@/components/shared/DeleteTask";
import AccRejSubRenderer from "@/components/shared/AccRejSubRenderer";
import Timer from "@/components/shared/Timer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskUserRef from "@/components/shared/TaskUserRef";

async function CheckAccessAndRenderTask({
  trackId,
  taskId,
}: {
  trackId: string;
  taskId: string;
}) {
  const {
    success,
    message,
    isAdmin,
    track,
    task,
    submissions,
    assignment,
    completed,
    pending,
  } = await checkAndGetTrackAndTask(trackId, taskId);

  // console.log(submissions);

  if (!success) {
    return <ErrorDiv errorMessage={message} />;
  } else {
    return (
      <main>
        <section className="flex flex-col gap-4 md:gap-6 md:flex-row items-start mb-6">
          {task.image && (
            <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-lg relative">
              <Skeleton className="w-full z-[-1] h-full absolute bg-primary/50" />
              <Image
                src={task.image}
                width={300}
                height={300}
                quality={80}
                alt="banner"
                className="w-full h-full object-cover"
                priority={true}
              />
              {!task.expired && (
                <Timer
                  dead_line={task.dead_line}
                  currentDate={task.currentDate}
                />
              )}
            </div>
          )}
          <div className="relative w-full md:w-1/2">
            <div>
              <Badge>{track.track_name}</Badge>
              <h1 className="text-4xl font-semibold mt-2">{task.task_name}</h1>
            </div>

            <p className="text-muted-foreground text-lg mt-2 tracking-wide">
              {task.task_description}
            </p>

            <div className="p-4 border rounded-lg bg-accent/50 mt-3 text-muted-foreground overflow-x-auto">
              <pre>{task.read_more}</pre>
            </div>

            {!isAdmin && (
              <>
                {assignment.note && (
                  <div className="p-4 rounded-lg bg-primary/20 text-primary mt-4 border border-primary">
                    <p className="font-semibold text-lg">Note</p>
                    <p>{assignment.note}</p>
                  </div>
                )}
                {assignment.error_note && (
                  <div className="p-4 border rounded-lg mt-4 border-red-500 text-red-500 bg-destructive/30 dark:bg-destructive/50">
                    <p className="font-semibold text-lg">Submission rejected</p>
                    <p>{assignment.error_note}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        {isAdmin ? (
          <>
            <section className="flex gap-2 flex-row flex-wrap justify-end">
              <DeleteTask taskId={task._id} trackId={trackId} />
              <EditTask task={task} trackId={trackId} />
            </section>

            <Tabs defaultValue="submissions" className="mt-6">
              <div className="flex justify-center">
                <TabsList className="rounded-full">
                  <TabsTrigger
                    className="py-3 px-4 rounded-full"
                    value="submissions"
                  >
                    Submissions
                  </TabsTrigger>
                  <TabsTrigger
                    className="py-3 px-4 rounded-full"
                    value="pending"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    className="py-3 px-4 rounded-full"
                    value="completed"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="submissions">
                <section className="pb-6 mt-3 min-h-screen">
                  <h2 className="text-lg tracking-wider font-semibold mb-4">
                    Submissions
                  </h2>
                  <TaskUserRef users={submissions} type="submissions" />
                </section>
              </TabsContent>
              <TabsContent value="pending">
                <section className="pb-6 mt-3 min-h-screen">
                  <h2 className="text-lg tracking-wider font-semibold mb-4">
                    Pending
                  </h2>
                  <TaskUserRef users={pending} type="pending" />
                </section>
              </TabsContent>
              <TabsContent value="completed">
                <section className="pb-6 mt-3 min-h-screen">
                  <h2 className="text-lg tracking-wider font-semibold mb-4">
                    Completed
                  </h2>
                  <TaskUserRef users={completed} type="completed" />
                </section>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <section className="pb-6">
            {assignment.status === "in-progress" && (
              <TaskSubmitionForm trackId={track._id} taskId={task._id} />
            )}
            {assignment.status === "review" && (
              <div className="p-6 rounded-xl bg-accent">
                <p className="font-semibold text-lg">Under review</p>
                <p className="mt-1 text-muted-foreground">
                  Your submission is under review
                </p>
              </div>
            )}

            {assignment.status === "completed" && (
              <div className="p-6 rounded-xl bg-green-600 text-white">
                <p className="font-semibold text-lg">Wohoo!</p>
                <p className="mt-1">Your submission got accepted</p>
              </div>
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
