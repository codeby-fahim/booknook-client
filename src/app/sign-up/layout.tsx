import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "BookNook | Sign Up" },
};

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return children;
}
