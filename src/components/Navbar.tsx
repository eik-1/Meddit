import Link from "next/link";
import { JSX } from "react";
import { Search } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "./ui/Button";
import Logo from "./Logo";
import { Input } from "./ui/input";
import { ModeToggle } from "./mode-toggle";
import NavbarUserMenu from "./NavbarUserMenu";
import { getCurrentUserProfileImageUrl } from "@/server/queries";

export default async function Navbar(): Promise<JSX.Element> {
  const dbImageUrl = await getCurrentUserProfileImageUrl();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <Logo />

        {/* Search Bar */}
        <div className="hidden md:flex relative max-w-md w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Meddit"
              className="h-10 w-full rounded-full border bg-background pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <SignedOut>
          <div className="flex items-center gap-4">
            <Button className="cursor-pointer" variant={"outline"}>
              <Link href="/sign-in">Log In</Link>
            </Button>

            <Button className="cursor-pointer">
              <Link href="/sign-up">Sign Up</Link>
            </Button>

            <ModeToggle />
          </div>
        </SignedOut>

        {/* User Menu */}
        <SignedIn>
          <NavbarUserMenu dbImageUrl={dbImageUrl} />
        </SignedIn>
      </div>
    </header>
  );
}
