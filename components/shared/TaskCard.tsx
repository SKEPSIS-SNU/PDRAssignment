import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

const TaskCard = ({
  track_id,
  task,
  isAdmin,
}: {
  track_id: string;
  task: any;
  isAdmin: boolean;
}) => {
  return (
    <Link
      href={`/${track_id}/${task._id}`}
      className="flex flex-col gap-2 border rounded-xl hover:bg-accent/30 transition-all card_hover p-4"
    >
      <div className="w-full aspect-video overflow-hidden rounded-lg relative">
        <Skeleton className="w-full h-full absolute z-[-1] bg-accent/50" />
        {task.image ? (
          <Image
            src={task.image}
            width={300}
            height={300}
            alt="task_image"
            className="w-full select-none rounded-lg transition-transform duration-300 img"
            priority={true}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full fl_center bg-accent">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6 mt-4">
        <div>
          <h3 className="text-2xl font-semibold">{task.task_name}</h3>
          <p className="text-muted-foreground text-lg tracking-wide mt-1">
            {task.task_description}
          </p>
        </div>
        {isAdmin ? (
          <Button>View task</Button>
        ) : (
          <>
            {task.note && <p>{task.note}</p>}
            {task.error_note && (
              <p className="text-destructive">{task.error_note}</p>
            )}
            {task.status === "in-progress" && (
              //   <TaskSubmitionForm trackId={track_id} taskId={task._id} />
              <Button>View task</Button>
            )}
            {task.status === "review" && (
              <Button disabled variant={"secondary"}>
                Under Review
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
          </>
        )}
      </div>
    </Link>
  );
};

export default TaskCard;
