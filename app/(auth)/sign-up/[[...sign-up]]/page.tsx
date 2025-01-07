import { SignInButton, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <>
      <div className="w-full min-h-20 relative flex justify-center items-center">
        <SignUp />
        <Loader2 className="animate-spin text-primary absolute" />
      </div>

      <div className="flex flex-row gap-2 justify-center flex-wrap text-center items-center pb-8 px-4">
        <p className="text-muted-foreground text-sm">
          Already have an account?
        </p>
        <SignInButton>
          <span className="text-primary font-medium cursor-pointer">
            Sign in
          </span>
        </SignInButton>
      </div>
    </>
  );
}
