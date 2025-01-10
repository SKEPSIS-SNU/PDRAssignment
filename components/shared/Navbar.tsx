import { SignedIn } from "@clerk/nextjs";
import React from "react";
import { ModeToggle } from "../theme/ModeToggle";
import SignOut from "./SignOut";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center gap-4 flex-row flex-wrap py-6">
      <p className="text-4xl font-semibold">LOGO</p>

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
