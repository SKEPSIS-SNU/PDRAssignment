"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { createTrack } from "@/lib/actions/track.actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  trackName: z.string().min(2).max(50),
  trackDescription: z.string().min(2).max(300),
  label: z.string().min(2).max(50),
});

const CreateTrack = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      trackName: "",
      trackDescription: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { success, message } = await createTrack({
        label: values.label,
        trackName: values.trackName,
        trackDescription: values.trackDescription,
      });

      toast({
        title: success ? "Success" : "Error",
        variant: success ? "default" : "destructive",
        description: message,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message || "Something went wrong",
      });
    } finally {
      form.reset();
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create track</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create track</DialogTitle>
          <DialogDescription>
            Give a track name, label, description and save.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="trackName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter track name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trackDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter track description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track label</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: webDev" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the track label which will be used in routes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrack;
