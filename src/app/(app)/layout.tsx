import { RootProvider } from "@/contexts/RootContext";

/** Everything under this group is the interactive app: it needs the music/display/audio
 * contexts, so it - and only it - pays for mounting Tone.js. Routes outside this group (the
 * static /learn content) never mount RootProvider and never load the audio engine. */
export default function AppGroupLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootProvider>{children}</RootProvider>;
}
