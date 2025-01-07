"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { SheetClose } from "../ui/sheet";
import { usePathname } from "next/navigation";

const TrackListClient = ({
  tracks,
  isMobile = false,
}: {
  tracks: {
    name: string;
    path: string;
  }[];
  isMobile?: boolean;
}) => {
  const pathName = usePathname();
  if (tracks.length > 0) {
    return (
      <ul className="flex flex-col gap-1">
        {tracks.map((track) => (
          <li key={track.name}>
            {isMobile ? (
              <SheetClose asChild>
                <Link
                  href={track.path}
                  className={`px-4 py-5 hover:bg-primary/90 transition-all hover:text-white block w-full rounded-xl ${
                    pathName === track.path
                      ? "bg-primary text-white"
                      : "bg-background"
                  }`}
                >
                  {track.name}
                </Link>
              </SheetClose>
            ) : (
              <Button
                asChild
                className="py-7 text-base justify-start w-full"
                variant={pathName === track.path ? "default" : "ghost"}
              >
                <Link href={track.path}>{track.name}</Link>
              </Button>
            )}
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <div>
        <p className="text-muted-foreground">No tracks to show</p>
      </div>
    );
  }
};

export default TrackListClient;
