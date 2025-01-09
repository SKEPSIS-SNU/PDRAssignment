import { UserButton } from "@clerk/nextjs";
import React from "react";
import { ModeToggle } from "../theme/ModeToggle";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center gap-4 flex-row flex-wrap py-6">
      <p className="text-4xl font-semibold">LOGO</p>

      <ModeToggle />
    </header>
  );
};

export default Navbar;
