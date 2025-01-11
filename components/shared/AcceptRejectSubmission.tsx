"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { handleSubmissionAcceptOrReject } from "@/lib/actions/task.actions";
import { useToast } from "@/hooks/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";

const formSchema = z.object({
  additinoalNote: z.string().max(200),
});

const AcceptRejectSubmission = ({
  submissionId,
  type,
  globalLoading,
  setGlobalLoading,
}: {
  submissionId: string;
  type: "accept" | "reject";
  globalLoading: boolean;
  setGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      additinoalNote: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setGlobalLoading(true);
      const { success, message } = await handleSubmissionAcceptOrReject({
        submissionId,
        type,
        extraNote: values.additinoalNote,
      });

      toast({
        title: success ? "Success" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
      });
    } finally {
      setGlobalLoading(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "accept" ? (
          <Button>Accept</Button>
        ) : (
          <Button variant={"outline"}>Reject</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "accept" ? "Accept" : "Reject"} submission
          </DialogTitle>
          <DialogDescription>
            {type === "accept"
              ? "Add an optinal note"
              : "Add a reason for rejection so that the user can be notified."}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="additinoalNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {type === "accept"
                        ? "Additional note"
                        : "Rejecttion reason"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          type === "accept"
                            ? "Enter additinal note (Optional)"
                            : "Enter rejectoin reason"
                        }
                        required={type === "reject"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant={"outline"}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  disabled={
                    globalLoading ||
                    (type === "reject" && !form.formState.isDirty)
                  }
                  type="submit"
                >
                  {type === "accept" ? (
                    <span>{globalLoading ? "Accepting..." : "Accept"}</span>
                  ) : (
                    <span>{globalLoading ? "Rejecting..." : "Reject"}</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptRejectSubmission;
