"use client";

import { useState } from "react";
import AcceptRejectSubmission from "./AcceptRejectSubmission";

const AccRejSubRenderer = ({ submissionId }: { submissionId: string }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  return (
    <div className="flex flex-row flex-wrap gap-2 justify-end">
      <AcceptRejectSubmission
        submissionId={submissionId}
        type="reject"
        globalLoading={globalLoading}
        setGlobalLoading={setGlobalLoading}
      />
      <AcceptRejectSubmission
        submissionId={submissionId}
        type="accept"
        globalLoading={globalLoading}
        setGlobalLoading={setGlobalLoading}
      />
    </div>
  );
};

export default AccRejSubRenderer;
