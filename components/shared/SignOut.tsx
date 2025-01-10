import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { SignOutButton } from "@clerk/nextjs";

const SignOut = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <LogOut />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action will log you out</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <SignOutButton>
            <DialogClose asChild>
              <Button variant="secondary">Sign out</Button>
            </DialogClose>
          </SignOutButton>

          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOut;
