import Image from "next/image";

import { TrackedLink } from "@/components/Learn/prose/TrackedLink";
import { LEARN_STYLES } from "@/lib/design";
import type { LearnPageInfo } from "@/lib/learn/learnPages";
import type { LearnLinkPlacement } from "@/lib/tracking/track";
import { THUMBNAIL_FOLDER, THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH } from "@/lib/thumbnail";

/** One recommended next step, as a card: a label ("Next", "Start here"), the page's title and the
 * question it answers, with its link-preview image where it has one. Use one per article, or a
 * short row of them where the reader picks a path; secondary links go in SeeAlso. */
export function NextCard({
  page,
  label,
  placement = "next-card",
}: {
  page: LearnPageInfo;
  label: string;
  placement?: LearnLinkPlacement;
}) {
  return (
    <TrackedLink href={page.href} placement={placement} className={LEARN_STYLES.nextCard}>
      {page.thumbnail && (
        <Image
          src={`/${THUMBNAIL_FOLDER}/${page.thumbnail}.png`}
          alt=""
          width={THUMBNAIL_WIDTH}
          height={THUMBNAIL_HEIGHT}
          sizes="160px"
          className={LEARN_STYLES.nextCardThumbnail}
        />
      )}
      <span className="flex flex-col gap-tight text-labels-textDefault">
        <span className={LEARN_STYLES.nextCardLabel}>{label}</span>
        <span className={LEARN_STYLES.nextCardTitle}>{page.title} →</span>
        {page.blurb && <span className="text-sm">{page.blurb}</span>}
      </span>
    </TrackedLink>
  );
}
