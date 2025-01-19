"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import Link from "next/link";

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
    <div className="bg-accent dark:bg-accent/50 p-4 rounded-xl flex items-center justify-between relative">
      <div className="overflow-x-hidden">
        <p>{linkType}</p>
        <p className="text-muted-foreground">
          <Link target="_blank" href={link} className="text-primary hover:underline">
            {link}
          </Link>
        </p>
      </div>
      <Button
        onClick={handleCopy}
        size="icon"
        variant="secondary"
        disabled={copied}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
};

export default TaskLink;
