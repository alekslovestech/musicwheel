import { Suspense } from "react";

import { harmonyViewMetadata } from "@/lib/metadata";

export const metadata = harmonyViewMetadata;

export default function HarmonyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
