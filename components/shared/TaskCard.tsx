import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import Timer from "./Timer";

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
      className="flex flex-col gap-2 border rounded-xl hover:bg-accent/30 transition-all card_hover p-4 break-inside-avoid"
    >
      <div className="w-full aspect-video overflow-hidden rounded-lg relative">
        <Skeleton className="w-full h-full absolute z-[-1] bg-accent/50" />
        {task.image ? (
          <Image
            src={task.image}
            width={300}
            height={300}
            alt="task_image"
            quality={60}
            className="w-full select-none rounded-lg transition-transform duration-300 img"
            priority={true}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full fl_center bg-accent">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        {!task.expired && (
          <Timer dead_line={task.dead_line} currentDate={task.currentDate} />
        )}
      </div>
      <div className="flex flex-col gap-4 mt-3">
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
            {task.note && (
              <div className="p-4 rounded-xl border border-primary text-primary bg-primary/20">
                {task.note}
              </div>
            )}
            {task.error_note && (
              <div className="text-red-500 rounded-xl border border-red-500 bg-destructive/30 dark:bg-destructive/50 p-4">
                {task.error_note}
              </div>
            )}
            {task.status === "in-progress" && <Button>View task</Button>}
            {task.status === "review" && (
              <Button disabled variant={"secondary"}>
                Under Review
              </Button>
            )}
            {task.status === "completed" && (
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Completed
              </Button>
            )}
            {task.expired && task.status === "in-progress" && (
              <Button variant={"destructive"}>Expired</Button>
            )}
          </>
        )}
      </div>
    </Link>
  );
};

export default TaskCard;
