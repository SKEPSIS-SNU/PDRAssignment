import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";

const TrackCard = ({ track }: { track: any }) => {
  return (
    <Link
      href={`/${track._id}`}
      className="flex flex-col gap-2 border rounded-xl hover:bg-accent/30 transition-all card_hover p-4"
    >
      <div className="w-full aspect-video overflow-hidden rounded-lg relative">
        <Skeleton className="w-full h-full absolute z-[-1] bg-accent/50" />
        {track.banner ? (
          <Image
            src={track.banner}
            width={300}
            height={300}
            alt="track_banner"
            className="w-full select-none rounded-lg transition-transform duration-300 img"
            priority={true}
            quality={60}
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
          <h3 className="text-2xl font-semibold">{track.track_name}</h3>
          <p className="text-muted-foreground text-lg tracking-wide mt-1">
            {track.track_description}
          </p>
        </div>
        <Button className="w-full">Visit track</Button>
      </div>
    </Link>
  );
};

export default TrackCard;
