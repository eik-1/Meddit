import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import notFoundIllustration from "../../public/404 error.png";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sky-50 dark:bg-slate-900 py-20">
      {/* Background Image */}
      <Image
        src={notFoundIllustration}
        alt="404 Error Illustration: Sad capybaras holding a 404 sign in a field"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        quality={90}
        priority
        className="absolute inset-0 z-0 opacity-95 dark:opacity-80"
      />

      {/* Optional Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-black/5 to-transparent dark:from-black/40 dark:via-black/15 dark:to-transparent"></div>

      {/* Content Container */}
      <div className="container relative z-20 mx-auto px-6 max-w-3xl text-center">
        {/* Text Content - Centered */}
        <h1
          // Using a prominent but friendly style
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white dark:text-white leading-tight tracking-tight text-shadow-md mb-4"
        >
          404
        </h1>
        <p className="mt-2 text-xl md:text-2xl text-stone-100 dark:text-stone-200 max-w-xl mx-auto text-shadow mb-8">
          Oops! Looks like the capybaras couldn't find this page.
        </p>

        {/* Button back to Home */}
        <Button
          asChild
          size="lg"
          // Using the familiar amber color
          className="px-8 py-3 text-base rounded-full shadow-lg bg-amber-600 hover:bg-amber-700 text-white border border-amber-700/50 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>

      {/* Ensure text-shadow classes are available (from globals.css) */}
    </section>
  );
}
