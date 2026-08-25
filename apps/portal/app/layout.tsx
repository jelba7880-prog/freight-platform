import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@freight/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freight Platform — Portal",
  description: "Authenticated customer portal.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-mode="dark" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
