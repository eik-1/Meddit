import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { amiri } from "@/fonts/fonts";

const CallToAction = () => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-t from-white via-sky-50 to-sky-100 dark:from-slate-950 dark:via-sky-950/50 dark:to-sky-950 text-center">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2
          className={`${amiri.className} text-3xl md:text-4xl lg:text-5xl font-semibold text-stone-800 dark:text-stone-100 mb-6 leading-tight`}
        >
          Ready to Feel Welcome?
        </h2>
        <p className="mb-10 text-lg text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
          Join our friendly Meddit community today. It&apos;s free to explore,
          share, and connect.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="px-8 py-3 text-base rounded-full shadow-sm bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            <Link href="/sign-up"> Sign Up Now</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-3 text-base rounded-full shadow-sm bg-white/70 dark:bg-stone-800/50 border-stone-300 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
          >
            <Link href="/app">Explore Posts</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
