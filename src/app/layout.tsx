import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/providers/theme-provider";
import { inter } from "@/fonts/fonts";

export const metadata: Metadata = {
  title: "Meddit",
  description: "Your go-to platform for sharing and discussing medical issues.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
