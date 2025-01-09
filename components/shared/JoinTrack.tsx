"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  getRemainingTracks,
  makeTrackApplicationAndReturnNewData,
} from "@/lib/actions/track.actions";
import { useToast } from "@/hooks/use-toast";

interface Track {
  _id: string;
  track_name: string;
  track_description: string;
  banner: string;
}

const JoinTrack = ({ trigger }: { trigger: ReactNode }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // For general loading
  const [applyingTrackId, setApplyingTrackId] = useState<string | null>(null); // For individual track loading
  const { toast } = useToast();

  async function handleTrackLoad() {
    try {
      setLoading(true);
      const { success, remainingTracks } = await getRemainingTracks();
      if (success) {
        setTracks(remainingTracks);
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to load other tracks",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(trackId: string) {
    try {
      setApplyingTrackId(trackId); // Set loading state for this specific track
      const { success, message, remainingTracks } =
        await makeTrackApplicationAndReturnNewData(trackId);

      if (success) {
        toast({
          title: "Success",
          variant: "default",
          description: "You have successfully applied to the track!",
        });
        setTracks(remainingTracks);
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: message || "Something went wrong",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      setApplyingTrackId(null);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild onClick={handleTrackLoad}>
        {trigger}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Track</DialogTitle>
          <DialogDescription>
            Please choose a track to join from the available options.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-4 w-full fl_center">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          <div>
            {tracks.length > 0 ? (
              <ul>
                {tracks.map((track, index) => (
                  <li
                    key={track._id}
                    // className="flex w-full items-center justify-between p-2 gap-2 py-2"
                    className={`${
                      index === tracks.length - 1 && "border-none"
                    } flex w-full items-center justify-between p-2 gap-2 py-4 border-b`}
                  >
                    <p>{track.track_name}</p>
                    <Button
                      className="rounded-full"
                      onClick={() => handleApply(track._id)}
                      disabled={applyingTrackId === track._id} // Disable button while applying
                    >
                      {applyingTrackId === track._id ? (
                        <Loader2 className="animate-spin text-foreground" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-muted-foreground">
                No remaining tracks available
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JoinTrack;
