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
import { File_uploader } from "./File_uploader";
import { ReactNode, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

const formSchema = z.object({
  trackName: z.string().min(2).max(50),
  trackDescription: z.string().min(2).max(300),
  trackBanner: z.string(),
});

const CreateTrack = ({ trigger }: { trigger: ReactNode }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [proceessing, setProceessing] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackName: "",
      trackDescription: "",
      trackBanner: "",
    },
  });

  // 2. Define a submit handler.
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

        values.trackBanner = uploadedImages[0].url;
        setIsUploading(false);
      }

      const { success, message } = await createTrack({
        trackBanner: values.trackBanner,
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
      setProceessing(false);
      form.reset();
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create track</DialogTitle>
          <DialogDescription>
            Give a track name, label, description and save.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <FormField
                control={form.control}
                name="trackBanner"
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
              <div className="flex flex-col h-full justify-between gap-4 lg:gap-6">
                <FormField
                  control={form.control}
                  name="trackName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Track name</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="Enter track name"
                          {...field}
                        />
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
                        <Input
                          required
                          placeholder="Enter track description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <DialogClose asChild> */}
                <Button
                  className="w-full rounded-full lg:mt-4"
                  type="submit"
                  disabled={proceessing || !form.formState.isDirty}
                >
                  {isUploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <span>{proceessing ? "Creating..." : "Create track"}</span>
                  )}
                </Button>
                {/* </DialogClose> */}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrack;
