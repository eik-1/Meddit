import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Search, MessageSquareQuote, BadgeCheck } from "lucide-react";
import { amiri } from "@/fonts/fonts";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Find Your Issue",
      description:
        "Browse communities for specific health concerns like 'h-headache' or 'h-sleeplessness'.",
    },
    {
      icon: MessageSquareQuote,
      title: "2. Share & Discover",
      description:
        "Post your remedies or discover suggestions and medicines shared by others.",
    },
    {
      icon: BadgeCheck,
      title: "3. Trust & Verify",
      description:
        "Look for posts from verified doctors and rely on community upvotes for trusted advice.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-stone-50 dark:bg-stone-900/50">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2
          className={`${amiri.className} text-3xl md:text-4xl font-semibold text-stone-800 dark:text-stone-100 mb-4`}
        >
          How Meddit Works
        </h2>
        <p className="text-lg text-stone-600 dark:text-stone-400 mb-16 max-w-2xl mx-auto">
          Finding and sharing health information is simple, friendly, and
          community-driven.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-lg transition-shadow rounded-2xl text-left overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  {step.icon && (
                    <step.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <CardTitle className="text-xl font-medium text-stone-700 dark:text-stone-200">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-stone-600 dark:text-stone-400">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
