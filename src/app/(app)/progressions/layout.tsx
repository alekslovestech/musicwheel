import { Suspense } from "react";

import { chordProgressionViewMetadata } from "@/lib/metadata";

export const metadata = chordProgressionViewMetadata;

export default function ProgressionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
