import { redirect } from "next/navigation";

import { DEFAULT_MUSICAL_KEY } from "@/types/Keys/MusicalKey";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { scaleSelectionPath } from "@/utils/slug/scaleSelection";

export default async function ScalesPage({
  searchParams,
}: {
  searchParams: Promise<{ isDemo?: string }>;
}) {
  const isDemo = (await searchParams).isDemo !== undefined;
  redirect(
    scaleSelectionPath(
      {
        tonic: DEFAULT_MUSICAL_KEY.tonicString,
        scaleMode: DEFAULT_MUSICAL_KEY.scaleMode,
        playbackMode: ScalePlaybackMode.SingleNote,
      },
      { demo: isDemo },
    ),
  );
}
