import { chordProgressionViewMetadata } from "@/lib/metadata";

export const metadata = chordProgressionViewMetadata;

export default function ChordProgressionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

