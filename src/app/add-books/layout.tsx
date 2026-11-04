import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "BookNook | Add Book" },
};

export default function AddBooksLayout({ children }: { children: ReactNode }) {
  return children;
}
