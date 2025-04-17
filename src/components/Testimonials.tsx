import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import { amiri } from "@/fonts/fonts";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "Found a simple remedy for my recurring headaches that actually worked. So grateful for this community!",
      author: "Alex R.",
      isVerified: false,
    },
    {
      quote:
        "As a doctor, it's great to see a platform encouraging shared knowledge. The verification badge helps build trust.",
      author: "Dr. Evelyn Chen",
      isVerified: true,
    },
    {
      quote:
        "The medicine links helped me quickly find what I needed after reading a helpful post. Very convenient.",
      author: "Sam K.",
      isVerified: false,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <h2
          className={`${amiri.className} text-3xl md:text-4xl font-semibold text-stone-800 dark:text-stone-100 mb-16 text-center`}
        >
          What Our Community Says
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/50 shadow-sm rounded-2xl overflow-hidden flex flex-col"
            >
              <CardContent className="p-8 flex-grow flex flex-col">
                <blockquote className="flex-grow mb-6">
                  <p className="relative text-lg text-stone-700 dark:text-stone-300 leading-relaxed italic pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                    "{testimonial.quote}"
                  </p>
                </blockquote>
                <div className="mt-auto pt-5 text-right">
                  <p className="font-medium text-sm text-stone-800 dark:text-stone-200 flex items-center justify-end">
                    - {testimonial.author}
                    {testimonial.isVerified && (
                      <CheckCircle className="ml-1.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
