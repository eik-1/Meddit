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
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 dark:border-stone-700/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between gap-6 px-4 md:px-6">
        <div className="flex-shrink-0">
          <Logo />
        </div>

        <div className="hidden md:flex flex-grow justify-center px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
            <Input
              placeholder="Search Meddit..."
              className="h-10 w-full rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-800/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-600 focus:border-transparent dark:focus:border-transparent placeholder:text-stone-400 dark:placeholder:text-stone-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <SignedOut>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="cursor-pointer rounded-full border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
            >
              <Link href="/sign-in">Log In</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="cursor-pointer rounded-full bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-700 shadow-sm"
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <NavbarUserMenu dbImageUrl={dbImageUrl} />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
