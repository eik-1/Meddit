import { Amiri, Inter } from "next/font/google";

export const amiri = Amiri({
  subsets: ["latin"],
  variable: "--font-amiri",
  display: "swap",
  weight: "400",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});
