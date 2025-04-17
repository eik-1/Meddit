"use client";

import { useState } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Pen } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/Button";

function NavbarUserDropdown() {
  return (
    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <Link
        href="/app/settings"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Settings
      </Link>
      <SignOutButton>
        <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}

type NavbarUserMenuProps = {
  dbImageUrl: string | null;
};

export default function NavbarUserMenu({ dbImageUrl }: NavbarUserMenuProps) {
  const { user, isLoaded } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fallbackImageUrl =
    user?.imageUrl ??
    "https://res.cloudinary.com/doac8yyie/image/upload/f_auto,q_auto/default";

  const profileImageToShow = dbImageUrl ?? fallbackImageUrl;

  return (
    <div className="flex items-center gap-4">
      <Link href="/app/create-post">
        <Button variant={"outline"}>
          <Pen className="w-4 h-4" />
          Create Post
        </Button>
      </Link>
      {/* Check if Clerk is loaded before rendering user section */}
      {isLoaded ? (
        // If Clerk loaded, check if we have an image to show
        profileImageToShow ? (
          <div className="relative ml-3">
            <div>
              <button
                type="button"
                className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                id="user-menu-button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <Image
                  className="h-8 w-8 rounded-full object-cover"
                  src={profileImageToShow}
                  alt={`${user?.username ?? "User"}'s profile picture`}
                  width={32}
                  height={32}
                  unoptimized
                />
              </button>
            </div>
            {/* Dropdown */}
            {isDropdownOpen && <NavbarUserDropdown />}
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        )
      ) : (
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
      )}
      <ModeToggle />
    </div>
  );
}
