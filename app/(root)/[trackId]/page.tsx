import CreateTask from "@/components/shared/CreateTask";
import ErrorDiv from "@/components/shared/ErrorDiv";
import Header from "@/components/shared/Header";
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
  // console.log(success, message, isAdmin, tasks, track);
  // console.log(track);
  // console.log(tasks);
  return (
    <>
      {success ? (
        <>
          {track ? (
            <>
              <Header
                heading={track.trackName}
                description={track.trackDescription}
              />
              <main className="min-h-screen w-full">
                <h2 className="text-xl text-muted-foreground font-semibold pb-4 border-b">
                  {isAdmin ? `All tasks (${track.trackName})` : "Your tasks"}
                </h2>

                {isAdmin && (
                  <div className="flex gap-2 flex-row mt-4 flex-wrap justify-center items-center md:justify-end">
                    {/* <Button asChild variant={"outline"}>
                      <Link href={`/${track._id}/users`}>Users</Link>
                    </Button> */}
                    <Button asChild variant={"outline"}>
                      <Link href={`/${track._id}/applications`}>
                        Applications
                      </Link>
                    </Button>

                    <CreateTask trackId={track._id} />
                  </div>
                )}
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
                              {task.taskName}
                            </p>
                            <p className="text-muted-foreground">
                              {task.taskDescription}
                            </p>
                          </div>
                          <div className="w-full flex justify-end gap-2">
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
                                {task.taskStatus === "in-progress" && (
                                  <TaskSubmitionForm
                                    trackId={track._id}
                                    taskId={task._id}
                                  />
                                )}
                                {task.taskStatus === "review" && (
                                  <Button disabled variant={"secondary"}>
                                    Under Review
                                  </Button>
                                )}
                                {task.taskStatus === "completed" && (
                                  <Button disabled>Completed</Button>
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
        <main className="w-full min-h-screen fl_center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </main>
      }
    >
      <CheckUserAccessAndRenderTrack trackId={params.trackId} />
    </Suspense>
  );
};

export default TrackPage;
