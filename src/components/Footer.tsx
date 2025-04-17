import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 pt-12 pb-10 mt-16">
      <div className="container mx-auto px-6 max-w-7xl text-center text-stone-500 dark:text-stone-400">
        <div className="mb-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link
            href="/about"
            className="text-sm text-stone-600 hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-stone-600 hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-stone-600 hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="text-sm text-stone-600 hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400 transition-colors"
          >
            Contact
          </Link>
        </div>

        <p className="text-sm mb-3">
          &copy; {currentYear} Meddit. All rights reserved.
        </p>

        <p className="text-xs max-w-md mx-auto leading-relaxed">
          Disclaimer: Information on Meddit is user-generated and does not
          substitute professional medical advice. Always consult with a verified
          healthcare provider for any health concerns or before making any
          decisions based on information found on this platform.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
