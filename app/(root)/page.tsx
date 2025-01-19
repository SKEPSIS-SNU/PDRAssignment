import CreateTrack from "@/components/shared/CreateTrack";
import ErrorDiv from "@/components/shared/ErrorDiv";
import JoinTrack from "@/components/shared/JoinTrack";
import MotionDiv from "@/components/shared/Motion_div";
import TrackCard from "@/components/shared/TrackCard";
import WaveAnimation from "@/components/shared/Wave";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { handleCreateUserAndReturnData } from "@/lib/actions/user.actions";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Instagram, Linkedin, Youtube } from "lucide-react";
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
                trigger={<Button className="py-6">Create track</Button>}
              />
            ) : (
              <JoinTrack
                trigger={<Button className="py-6">Join track</Button>}
              />
            )}
          </div>
          {tracks.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 min-h-screen items-start">
              {tracks.map((track: any) => (
                <TrackCard key={track._id} track={track} />
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
          <section className="w-full py-6 md:py-8">
            <div className="flex flex-col items-center text-center gap-4">
              <p className="text-primary text-4xl sm:text-5xl font-semibold">
                Welcome to
              </p>
              <MotionDiv
                initial_opacity={0}
                final_opacity={1}
                initial_y={40}
                final_y={0}
                transition_duration={0.5}
                once={true}
              >
                <p className="text-6xl sm:text-7xl font-bold text-muted-foreground">
                  Project
                </p>
              </MotionDiv>

              <div className="relative w-fit">
                <p className="text-6xl sm:text-7xl font-bold">DEV-RUSH</p>
                <WaveAnimation className="absolute bottom-0 translate-y-[60%]" />
              </div>

              <p className="text-lg text-muted-foreground mt-3 tracking-wide px-8 md:px-0 md:max-w-[600px]">
                Join the tracks of{" "}
                <span className="text-foreground">your interests</span> and
                learn by <span className="text-foreground">doing projects</span>
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="rounded-full bg-accent/60"
                  asChild
                >
                  <Link
                    href="https://www.instagram.com/skepsis.official"
                    target="_blank"
                  >
                    <Instagram />
                  </Link>
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="rounded-full bg-accent/60"
                  asChild
                >
                  <Link
                    href="https://www.linkedin.com/company/skepsis-snu"
                    target="_blank"
                  >
                    <Linkedin />
                  </Link>
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="rounded-full bg-accent/60"
                  asChild
                >
                  <Link
                    href="https://www.youtube.com/@SKEPSIS-SNU"
                    target="_blank"
                  >
                    <Youtube />
                  </Link>
                </Button>
              </div>
            </div>
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
        <main className="w-full min-h-[80vh] flex flex-col gap-10 justify-between items-center md:flex-row lg:gap-16 py-8 md:py-0">
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4">
            <p className="text-primary text-4xl sm:text-5xl font-semibold">
              Learn with
            </p>
            <div className="relative w-fit">
              <p className="text-6xl sm:text-7xl font-bold md:-ml-1">SKEPSIS</p>
              <WaveAnimation className="absolute bottom-0 translate-y-[60%]" />
            </div>

            <p className="text-lg text-muted-foreground mt-3 tracking-wide px-8 md:px-0 md:max-w-[600px]">
              Discover tracks tailored to{" "}
              <span className="text-foreground"> your interests</span>, offering
              insights into{" "}
              <span className="text-foreground">real-world projects</span>,
              <span className="text-foreground">practical skills</span>, and
              valuable experiences to help you grow and succeed.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 mt-2">
              <Button
                variant={"ghost"}
                size={"icon"}
                className="rounded-full bg-accent/60"
                asChild
              >
                <Link
                  href="https://www.instagram.com/skepsis.official"
                  target="_blank"
                >
                  <Instagram />
                </Link>
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="rounded-full bg-accent/60"
                asChild
              >
                <Link
                  href="https://www.linkedin.com/company/skepsis-snu"
                  target="_blank"
                >
                  <Linkedin />
                </Link>
              </Button>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="rounded-full bg-accent/60"
                asChild
              >
                <Link
                  href="https://www.youtube.com/@SKEPSIS-SNU"
                  target="_blank"
                >
                  <Youtube />
                </Link>
              </Button>
            </div>

            <SignInButton>
              <Button variant={"secondary"} className="w-full mt-2">
                Sign In
              </Button>
            </SignInButton>
          </div>

          <div className="w-[70%] md:w-[40%] max-w-[450px] aspect-square bg-accent dark:bg-accent/50 rounded-2xl flex-shrink-0 overflow-hidden shadow-xl shadow-border">
            <Image
              priority={true}
              src="/hero.png"
              className="w-full"
              alt="logo"
              width={300}
              height={300}
            />
          </div>
        </main>
      </SignedOut>
    </>
  );
}
