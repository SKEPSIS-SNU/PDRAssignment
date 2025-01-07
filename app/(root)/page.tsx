import CreateTrack from "@/components/shared/CreateTrack";
import ErrorDiv from "@/components/shared/ErrorDiv";
import JoinTrack from "@/components/shared/JoinTrack";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createAdmin,
  handleCreateUserAndReturnData,
} from "@/lib/actions/user.actions";
import { userInfo } from "@/lib/actions/userInfo.action";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

async function HandleUser() {
  const { userId, userName, userMail, firstName, lastName, userImage } =
    await userInfo();

  if (!userId || !userName || !userMail) {
    return <ErrorDiv errorMessage="Recived incomplete user info" />;
  }

  const { success, message, isAdmin, tracks } =
    await handleCreateUserAndReturnData({
      userId,
      userName,
      userMail,
      firstName,
      lastName,
      userImage,
    });

  // await createAdmin({
  //   clerk_id: userId,
  //   email: userMail,
  //   username: userName,
  // });
  // console.log(tracks);
  return (
    <>
      {success ? (
        <>
          <header className="w-full py-4 flex justify-between items-center">
            <Logo />
            {isAdmin ? <CreateTrack /> : <JoinTrack />}
          </header>
          <main>
            <section className="w-full aspect-video rounded-xl max-h-96 bg-accent min-h-64"></section>
            {tracks.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold text-muted-foreground my-4">
                  {isAdmin ? "All tracks" : "Your tracks"}
                </h2>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {tracks.map((track: any) => (
                    <div
                      key={track._id}
                      className="bg-accent/50 hover:bg-accent/80 transition-colors border border-transparent hover:border-border p-6 rounded-xl min-h-48 flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="text-lg font-semibold">
                          {track.trackName}
                        </h2>
                        <p className="text-muted-foreground">
                          {track.trackDescription}
                        </p>
                      </div>

                      <div className="w-full flex justify-end">
                        <Button asChild>
                          <Link href={`/${track._id}`}>Visit track</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            ) : (
              <div>
                <p className="text-muted-foreground mt-4">No tracks to show</p>
              </div>
            )}
          </main>
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
        <Suspense
          fallback={
            <>
              <Skeleton className="w-full h-10 my-4" />
              <Skeleton className="w-full aspect-video rounded-xl max-h-96 min-h-64"></Skeleton>
              <Skeleton className="w-72 h-8 my-4"></Skeleton>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="w-full h-48 rounded-xl" />
              </div>
            </>
          }
        >
          <HandleUser />
        </Suspense>
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
