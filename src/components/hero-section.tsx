import React from "react";
import Link from "next/link";
import Image from "next/image";

import { amiri } from "@/fonts/fonts";
import illustration from "../../public/hero-section-illustration.png";
import { Button } from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <>
      <main className="overflow-x-hidden">
        <section>
          <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-12">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <h1
                  className={`mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl ${amiri.className}`}
                >
                  Social Media For Your Medical Discussions
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg">
                  Discover, Share, and Validate Medical Remedies with a
                  Community of Experts and Peers.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button asChild size="lg" className="px-5 text-base">
                    <Link href="#link">
                      <span className="text-nowrap">Join the Community</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                className="-z-10 order-first ml-auto h-14 w-full object-cover sm:h-96 lg:absolute lg:inset-0 lg:-right-24 lg:-top-32 lg:order-last lg:h-max lg:w-2/4 lg:object-contain"
                src={illustration}
                alt="Abstract Object"
                height="2000"
                width="2000"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
