"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

const TaskLink = ({ linkType, link }: { linkType: string; link: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy the link: ", error);
    }
  };

  return (
    <div className="bg-background p-4 rounded-xl flex items-center justify-between">
      <div>
        <p>{linkType}</p>
        <p className="text-muted-foreground">{link}</p>
      </div>
      <Button
        onClick={handleCopy}
        size="icon"
        variant="secondary"
        disabled={copied}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default TaskLink;
