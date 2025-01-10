"use client";
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
import { submitTask } from "@/lib/actions/task.actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  gitHubLink: z.string().min(2).max(200),
  kglLink: z.string().max(200),
  webLink: z.string().max(200),
});

const TaskSubmitionForm = ({
  trackId,
  taskId,
}: {
  trackId: string;
  taskId: string;
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gitHubLink: "",
      kglLink: "",
      webLink: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    try {
      const { success, message } = await submitTask({
        trackId,
        taskId,
        gitHubLink: values.gitHubLink,
        kglLink: values.kglLink,
        webLink: values.webLink,
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
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="gitHubLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github repo link</FormLabel>
                <FormControl>
                  <Input
                    required
                    type="url"
                    placeholder="https://github.com/example/repo"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kglLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kaggle link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://www.kaggle.com/username/dataset"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="webLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website link (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://www.example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskSubmitionForm;
