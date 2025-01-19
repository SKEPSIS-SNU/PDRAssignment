import { SignedIn } from "@clerk/nextjs";
import React from "react";
import { ModeToggle } from "../theme/ModeToggle";
import SignOut from "./SignOut";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center gap-4 flex-row flex-wrap py-6">
      <Image src="/logo.png" width={100} height={100} alt="logo" className="invert dark:invert-0" />

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
