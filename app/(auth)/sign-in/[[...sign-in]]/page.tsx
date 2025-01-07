import { SignIn, SignUpButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <>
      <div className="w-full min-h-20 relative flex justify-center items-center">
        <SignIn />
        <Loader2 className="animate-spin text-primary absolute" />
      </div>

      <div className="flex flex-row gap-2 justify-center flex-wrap text-center items-center pb-8 px-4">
        <p className="text-muted-foreground text-sm">
          {" "}
          Don&apos;t have an account?
        </p>
        <SignUpButton>
          <span className="text-primary font-medium cursor-pointer">
            Sign up
          </span>
        </SignUpButton>
      </div>
    </>
  );
}
