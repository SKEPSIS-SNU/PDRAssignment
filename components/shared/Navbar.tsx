import { SignedIn } from "@clerk/nextjs";
import React from "react";
import { ModeToggle } from "../theme/ModeToggle";
import SignOut from "./SignOut";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center gap-4 flex-row flex-wrap py-6">
      <div>
        <Image
          priority={true}
          src="/logo_light.png"
          width={100}
          height={100}
          alt="logo"
          className="dark:hidden"
        />
        <Image
          priority={true}
          src="/logo_dark.png"
          width={100}
          height={100}
          alt="logo"
          className="hidden dark:inline-block"
        />
      </div>

      <div className="flex flex-row flex-wrap items-center gap-2">
        <ModeToggle />
        <SignedIn>
          <SignOut />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
