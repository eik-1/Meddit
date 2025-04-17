import React from "react";
import Link from "next/link";
import Image from "next/image";
import { amiri } from "@/fonts/fonts";
import heroIllustration from "../../public/homepage.png";
import { Button } from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-sky-50 dark:bg-slate-900 pt-24 pb-24 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40">
      <Image
        src={heroIllustration}
        alt="Background illustration of friendly capybaras in a field"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        quality={90}
        priority
        className="absolute inset-0 z-0 opacity-90 dark:opacity-70"
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-black/5 to-transparent dark:from-black/50 dark:via-black/20 dark:to-transparent"></div>

      <div className="container relative z-20 mx-auto px-6 max-w-4xl text-center">
        <h1
          className={`text-4xl md:text-5xl lg:text-[3.8rem] font-medium text-white dark:text-white leading-tight tracking-tight text-shadow-md ${amiri.className}`}
        >
          A Friendly Space for Your Medical Discussions
        </h1>
        <p className="mt-6 text-lg md:text-xl text-stone-100 dark:text-stone-200 max-w-2xl mx-auto text-shadow">
          Discover, Share, and Validate Medical Remedies with a Community of
          Experts and Peers. Like capybaras, we're better together!
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="px-8 py-3 text-base rounded-full shadow-lg bg-amber-600 hover:bg-amber-700 text-white border border-amber-700/50 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            <Link href="/sign-up">Join the Community</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-3 text-base rounded-full shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white border-stone-300 text-stone-800 dark:bg-stone-900/70 dark:hover:bg-stone-900 dark:border-stone-600 dark:text-stone-100"
          >
            <Link href="/app">Explore Issues</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
