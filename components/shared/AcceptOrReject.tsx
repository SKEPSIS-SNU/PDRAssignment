"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { handleRequest } from "@/lib/actions/user.actions";
import { useToast } from "@/hooks/use-toast";

const AcceptOrReject = ({
  applicantId,
  trackId,
}: {
  applicantId: string;
  trackId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const handler = async (type: "accept" | "reject") => {
    try {
      setLoading(true);
      const { success, message } = await handleRequest({
        type,
        trackId,
        applicantId,
      });
      toast({
        title: success ? "Success" : "Error",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-6 flex justify-end gap-2 w-full">
      <Button
        onClick={() => handler("reject")}
        disabled={loading}
        variant={"outline"}
      >
        <span>{loading ? "Processing" : "Reject"}</span>
      </Button>
      <Button onClick={() => handler("accept")} disabled={loading}>
        <span>{loading ? "Processing" : "Accept"}</span>
      </Button>
    </div>
  );
};

export default AcceptOrReject;
