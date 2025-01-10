import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { Chart } from "./Chart";

const Intro = ({
  banner,
  heading,
  description,
  className,
  isAdmin,
}: {
  isAdmin: boolean;
  banner?: string;
  heading: string;
  description?: string;
  className?: string;
}) => {
  return (
    <section
      className={cn("flex flex-col gap-6 md:flex-row items-start", className)}
    >
      {banner && (
        <div className="w-full md:w-1/2 aspect-video overflow-hidden rounded-lg relative">
          <Image
            src={banner}
            width={400}
            height={400}
            alt="banner"
            className="w-full h-full object-cover relative z-10"
            priority={true}
          />

          <Skeleton className="w-full h-full absolute bg-primary/50" />
        </div>
      )}
      <div className="relative w-full md:w-1/2">
        {!isAdmin && (
          <div className="w-[45vw] max-w-[200px] aspect-square bg-background rounded-tl-3xl absolute top-0 right-0 -translate-y-[90%] md:static md:rounded-xl md:translate-y-0 md:border z-10">
            <Chart total={5} completed={3} />
          </div>
        )}

        <h1 className="text-4xl mt-4 font-semibold">{heading}</h1>
        {description && (
          <p className="text-muted-foreground text-lg mt-2 tracking-wide">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default Intro;
