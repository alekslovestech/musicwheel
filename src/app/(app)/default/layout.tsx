import { harmonyViewMetadata } from "@/lib/metadata";

export const metadata = harmonyViewMetadata;

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
