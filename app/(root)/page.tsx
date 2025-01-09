import CreateTrack from "@/components/shared/CreateTrack";
import ErrorDiv from "@/components/shared/ErrorDiv";
import JoinTrack from "@/components/shared/JoinTrack";
import MotionDiv from "@/components/shared/Motion_div";
import WaveAnimation from "@/components/shared/Wave";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { handleCreateUserAndReturnData } from "@/lib/actions/user.actions";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

async function HandleUser() {
  const { success, message, isAdmin, tracks } =
    await handleCreateUserAndReturnData();
  return (
    <>
      {success ? (
        <>
          <div className="flex w-full justify-between gap-8 flex-wrap my-4 items-center">
            <h2 className="text-xl font-semibold text-muted-foreground my-4">
              {isAdmin ? "All tracks" : "Your tracks"}
            </h2>
            {isAdmin ? (
              <CreateTrack
                trigger={<Button className="rounded-full">Create track</Button>}
              />
            ) : (
              <JoinTrack
                trigger={<Button className="rounded-full">Join track</Button>}
              />
            )}
          </div>
          {tracks.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 min-h-screen items-start">
              {tracks.map((track: any) => (
                <Link
                  href={`/${track._id}`}
                  key={track._id}
                  className="flex flex-col gap-2 border rounded-xl hover:bg-accent/30 transition-all card_hover p-4"
                >
                  <div className="w-full aspect-video overflow-hidden rounded-lg relative">
                    <Skeleton className="w-full h-full absolute z-[-1] bg-accent/50" />
                    <Image
                      src={track.banner}
                      width={300}
                      height={300}
                      alt="track_banner"
                      className="w-full select-none rounded-lg transition-transform duration-300 img"
                      priority={true}
                      draggable={false}
                    />
                  </div>
                  <div className="flex flex-col gap-6 mt-4">
                    <div>
                      <h3 className="text-2xl font-semibold">
                        {track.track_name}
                      </h3>
                      <p className="text-muted-foreground text-lg tracking-wide mt-1">
                        {track.track_description}
                      </p>
                    </div>
                    <Button className="w-full py-5 rounded-full">
                      Visit track
                    </Button>
                  </div>
                </Link>
              ))}
            </section>
          ) : (
            <div className="py-4 mb-10">
              <p className="text-muted-foreground mt-4">No tracks to show</p>
            </div>
          )}
        </>
      ) : (
        <ErrorDiv errorMessage={message} />
      )}
    </>
  );
}

export default function Home() {
  return (
    <>
      <SignedIn>
        <main>
          <section className="w-full min-h-[60vh] flex flex-col gap-10 justify-between items-center md:flex-row lg:gap-16 py-8 md:py-0">
            <div className="flex flex-col items-center text-center md:items-start md:text-left md:-translate-y-[15%]">
              <p className="text-primary text-5xl font-semibold">Learn with</p>
              <div className="relative w-fit">
                <p className="text-7xl font-bold mt-2">SKEPSIS</p>
                <WaveAnimation className="absolute bottom-0 translate-y-[45%]" />
              </div>

              <p className="text-lg text-muted-foreground tracking-wide mt-5 px-10 md:px-0 md:max-w-[600px]">
                Discover tracks tailored to your interests, offering insights
                into real-world projects, practical skills, and valuable
                experiences to help you grow and succeed.
              </p>
            </div>

            <div className="w-[60%] md:w-[40%] max-w-[450px] aspect-square bg-accent dark:bg-accent/50 rounded-2xl flex-shrink-0"></div>
          </section>
          <Suspense
            fallback={
              <>
                <Skeleton className="w-full h-10 my-7" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Skeleton className="w-full h-72 rounded-xl" />
                  <Skeleton className="w-full h-72 rounded-xl" />
                  <Skeleton className="w-full h-72 rounded-xl" />
                </div>
              </>
            }
          >
            <HandleUser />
          </Suspense>
        </main>
      </SignedIn>

      <SignedOut>
        <main className="w-full h-screen fl_center flex-col gap-6">
          <h1 className="text-2xl text-muted-foreground font-semibold">
            You are missing out
          </h1>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </main>
      </SignedOut>
    </>
  );
}
