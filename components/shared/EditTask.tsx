"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updateTask } from "@/lib/actions/task.actions";
import { File_uploader } from "./File_uploader";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { Task } from "@/lib/database/models/task.model";

const formSchema = z.object({
  taskName: z.string().min(2).max(50),
  taskDescription: z.string().min(2).max(300),
  image: z.string(),
  readMore: z.string().max(1000),
  additionalDays: z.string(),
});

const EditTask = ({ trackId, task }: { trackId: string; task: Task }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [proceessing, setProceessing] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: task.task_name,
      taskDescription: task.task_description,
      image: task.image,
      readMore: task.read_more,
      additionalDays: "0",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (files.length > 0) {
        setIsUploading(true);
        setProceessing(true);
        const uploadedImages = await startUpload(files);

        if (!uploadedImages) {
          setIsUploading(false);
          return;
        }

        values.image = uploadedImages[0].url;
        setIsUploading(false);
      }

      const { success, message } = await updateTask({
        taskId: task._id,
        trackId,
        taskName: values.taskName,
        taskDescription: values.taskDescription,
        image: values.image,
        readMore: values.readMore,
        additionalDays: Number(values.additionalDays),
      });

      if (success) {
        form.reset({
          taskName: values.taskName,
          taskDescription: values.taskDescription,
          image: values.image,
          readMore: values.readMore,
          additionalDays: values.additionalDays.toString(),
        });
      }

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
      setProceessing(false);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="py-5">Edit task</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Make necessary changes and update.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="h-72">
                        <File_uploader
                          onFieldChange={field.onChange}
                          imageUrl={field.value || ""}
                          setFiles={setFiles}
                          disabled={isUploading || form.formState.isSubmitting} // Disable while uploading
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task name</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="Enter task name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 justify-between h-full">
                <FormField
                  control={form.control}
                  name="taskDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task description</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="Enter task description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="readMore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read more</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder="Enter read more"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          // defaultValue={7}
                          placeholder="Enter number of additional days"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full rounded-full lg:mt-4"
                  type="submit"
                  disabled={proceessing || !form.formState.isDirty}
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <span>{proceessing ? "Updating..." : "Update task"}</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
