import { LEARN_STYLES } from "@/lib/design";
import { LearnTag } from "@/types/enums/LearnTag";

/** Small pill badges shown after a Learn heading's link, classifying the article's content. */
export function LearnTags({ tags }: { tags: LearnTag[] }) {
  return (
    <span className={LEARN_STYLES.tagRow}>
      {tags.map((tag) => (
        <span key={tag} className={LEARN_STYLES.tagBadge}>
          {tag}
        </span>
      ))}
    </span>
  );
}
