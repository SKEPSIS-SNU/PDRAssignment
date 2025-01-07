"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { handleSubmissionAcceptOrReject } from "@/lib/actions/task.actions";
import { useToast } from "@/hooks/use-toast";

const AccRejSub = ({ submissionId }: { submissionId: string }) => {
  const { toast } = useToast();
  async function handler(type: "accept" | "reject") {
    try {
      setProcessing(true);
      const { success, message } = await handleSubmissionAcceptOrReject(
        submissionId,
        type
      );

      toast({ title: success ? "Success" : "Error", description: message });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
      });
    } finally {
      setProcessing(false);
    }
  }
  const [processing, setProcessing] = useState(false);
  return (
    <div className="flex gap-2 flex-row flex-wrap">
      <Button
        onClick={() => handler("reject")}
        disabled={processing}
        variant={"outline"}
      >
        {processing ? "Processing..." : "Reject"}
      </Button>
      <Button onClick={() => handler("accept")} disabled={processing}>
        {processing ? "Processing..." : "Accept"}
      </Button>
    </div>
  );
};

export default AccRejSub;
