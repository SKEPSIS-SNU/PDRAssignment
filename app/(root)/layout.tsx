import Sidebar from "@/components/shared/Sidebar";
import TrackListMobile from "@/components/shared/TrackListMobile";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-4 md:px-6 lg:px-10 max-w-7xl mx-auto">{children}</div>
  );
}
