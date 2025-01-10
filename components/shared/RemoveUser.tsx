"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { removeUserFromTrack } from "@/lib/actions/track.actions";
import { useState } from "react";

const RemoveUser = ({
  userId,
  trackId,
}: {
  userId: string;
  trackId: string;
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  async function onRemove(userId: string, trackId: string) {
    try {
      setLoading(true);
      const { success, message } = await removeUserFromTrack(userId, trackId);

      toast({
        title: success ? "Success" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          {loading ? <span>Removing...</span> : <span>Remove</span>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will remove the user and all his/her record from this
            track.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button onClick={() => onRemove(userId, trackId)} variant="outline">
              Remove
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveUser;
