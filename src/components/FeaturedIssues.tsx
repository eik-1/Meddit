import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { amiri } from "@/fonts/fonts";

const FeaturedIssues = () => {
  const issues = [
    "Headache",
    "Sleeplessness",
    "Anxiety",
    "Skin Rash",
    "Depression",
    "Diabetes",
    "Chronic Pain",
  ];

  const badgeColors = [
    "bg-sky-100 text-sky-800 hover:bg-sky-200 border-sky-200 dark:bg-sky-900/60 dark:text-sky-200 dark:hover:bg-sky-900 dark:border-sky-800",
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-200 dark:hover:bg-emerald-900 dark:border-emerald-800",
    "bg-stone-100 text-stone-800 hover:bg-stone-200 border-stone-200 dark:bg-stone-800/60 dark:text-stone-200 dark:hover:bg-stone-700 dark:border-stone-700",
    "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/60 dark:text-blue-200 dark:hover:bg-blue-900 dark:border-blue-800",
    "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/60 dark:text-amber-200 dark:hover:bg-amber-900 dark:border-amber-800",
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/50 dark:to-slate-950">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2
          className={`${amiri.className} text-3xl md:text-4xl font-semibold text-stone-800 dark:text-stone-100 mb-4`}
        >
          Explore Popular Issues
        </h2>
        <p className="text-lg text-stone-600 dark:text-stone-400 mb-16 max-w-2xl mx-auto">
          Dive into discussions on various health topics important to our
          friendly community.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {issues.map((issue, index) => {
            const slug = `h/${issue.toLowerCase().replace(/\s+/g, "-")}`;
            const colorClass = badgeColors[index % badgeColors.length];
            return (
              <Link href={`/sign-up`} key={issue}>
                <Badge
                  variant="outline"
                  className={`px-6 py-2.5 text-base font-medium rounded-full cursor-pointer transition-all shadow-sm border ${colorClass} hover:shadow-md`}
                >
                  {slug}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedIssues;
