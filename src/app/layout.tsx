import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  display: 'swap',
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: {
    default: "BookNook | Online Library",
    template: "%s | BookNook",
  },
  description:
    "BookNook is a simple online library where you can explore books, add new books, borrow your favorite books, and manage your borrowed collection.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.className}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F3] text-[#252D29]">
        <Suspense
          fallback={
            <div
              aria-hidden="true"
              className="h-17.25 border-b border-[#E7E5DF] bg-[#FAF8F3]"
            />
          }
        >
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer></Footer>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
