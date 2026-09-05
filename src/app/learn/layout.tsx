import { learnViewMetadata } from "@/lib/metadata";

export const metadata = learnViewMetadata;

/**
 * The reading shell for every article: one measured column, no app chrome. Articles are static -
 * no settings panel, no playback transport, no tonic picker - so the only controls a reader sees
 * are the links out to the live app.
 */
export default function LearnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-normal px-normal py-spacious text-labels-textDefault">
      {children}
    </main>
  );
}
