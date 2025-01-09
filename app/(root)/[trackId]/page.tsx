import CreateTask from "@/components/shared/CreateTask";
import ErrorDiv from "@/components/shared/ErrorDiv";
import Intro from "@/components/shared/Intro";
import TaskSubmitionForm from "@/components/shared/TaskSubmitionForm";
import { Button } from "@/components/ui/button";
import { checkAndGetTrack } from "@/lib/actions/track.actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function CheckUserAccessAndRenderTrack({ trackId }: { trackId: string }) {
  const { success, message, isAdmin, tasks, track } = await checkAndGetTrack(
    trackId
  );
  return (
    <>
      {success ? (
        <>
          {track ? (
            <>
              <main className="min-h-screen w-full">
                <Intro
                  banner={track.banner}
                  heading={track.track_name}
                  description={track.track_description}
                  isAdmin={!!isAdmin}
                />
                <div className="py-6 w-full flex flex-col md:flex-row justify-between gap-4 md:items-center border-b">
                  <h2 className="text-xl font-semibold">
                    {isAdmin ? `All tasks` : "Your tasks"}
                  </h2>

                  {isAdmin && (
                    <div className="flex flex-col gap-4 md:flex-row">
                      <Button asChild variant={"outline"}>
                        <Link href={`/${track._id}/applications`}>
                          Applications
                        </Link>
                      </Button>

                      <CreateTask trackId={track._id} />
                    </div>
                  )}
                </div>

                {tasks && (
                  <section className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.length > 0 ? (
                      tasks.map((task: any) => (
                        <div
                          key={task._id}
                          className="bg-accent/50 hover:bg-accent/80 transition-colors border border-transparent hover:border-border p-6 rounded-xl min-h-48 flex flex-col justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-lg font-semibold text-primary">
                              {task.task_name}
                            </p>
                            <p className="text-muted-foreground">
                              {task.task_description}
                            </p>
                          </div>
                          <div className="w-full flex flex-col">
                            {isAdmin ? (
                              <>
                                <Button asChild variant={"secondary"}>
                                  <Link
                                    href={`/${track._id}/${task._id}/submissions`}
                                  >
                                    Submissions
                                  </Link>
                                </Button>
                              </>
                            ) : (
                              <>
                                {task.note && <p>{task.note}</p>}
                                {task.error_note && (
                                  <p className="text-destructive">
                                    {task.error_note}
                                  </p>
                                )}
                                {task.status === "in-progress" && (
                                  <TaskSubmitionForm
                                    trackId={track._id}
                                    taskId={task._id}
                                  />
                                )}
                                {task.status === "review" && (
                                  <Button disabled variant={"secondary"}>
                                    Under Review
                                  </Button>
                                )}
                                {task.status === "completed" && (
                                  <Button disabled>Completed</Button>
                                )}
                                {task.status === "expired" && (
                                  <Button disabled variant={"destructive"}>
                                    Expired
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        {isAdmin
                          ? "No tasks for this track"
                          : "You dont have any task"}
                      </p>
                    )}
                  </section>
                )}
              </main>
            </>
          ) : (
            <main className="min-h-screen w-full fl_center">
              <p className="text-muted-foreground">You dont have any track</p>
            </main>
          )}
        </>
      ) : (
        <ErrorDiv errorMessage={message} />
      )}
    </>
  );
}

const TrackPage = ({ params }: { params: { trackId: string } }) => {
  return (
    <Suspense
      fallback={
        <main className="w-full min-h-[50vh] fl_center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </main>
      }
    >
      <CheckUserAccessAndRenderTrack trackId={params.trackId} />
    </Suspense>
  );
};

export default TrackPage;
