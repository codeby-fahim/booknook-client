import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "BookNook | Book Details" },
};

export default function BookDetailsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
