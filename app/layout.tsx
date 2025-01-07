import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Learn with SKEPSIS",
  description: "Know how things work through tasks and projects",
};

export default function TopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/"}
      appearance={{
        elements: {
          cardBox: "shadow-none border-none rounded-none z-10",

          card: "bg-background border-none rounded-none",
          headerTitle: "text-primary",
          headerSubtitle: "text-muted-foreground",

          button: "shadow-none",
          socialButtonsBlockButton:
            "bg-foreground/5 hover:bg-foreground/10 py-3",
          socialButtonsBlockButtonText: "text-muted-foreground",

          dividerLine: "bg-foreground/10",
          dividerText: "text-muted-foreground",

          formFieldLabel: "text-muted-foreground",
          formFieldInput: "bg-accent text-foreground outline-none",

          formButtonPrimary:
            "bg-primary text-white shadow-none hover:bg-primary/90",

          footer: "hidden",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
