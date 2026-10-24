import { FIGURE_KEY_BORDER, LEARN_STYLES } from "@/lib/design";

/** The frame every Learn figure shares: the bordered card with its caption underneath.
 *
 * `bare` drops all of it - the card, its padding and gaps, and the caption - leaving just the
 * content. For a figure used as an image rather than as part of an article, such as a link
 * preview (see src/app/promo). */
export function FigureFrame({
  caption,
  bare = false,
  children,
}: {
  /** The caption's content - the frame supplies the `<figcaption>` and its styling. */
  caption: React.ReactNode;
  bare?: boolean;
  children: React.ReactNode;
}) {
  if (bare) {
    return (
      <figure className="m-0 flex flex-col" style={FIGURE_KEY_BORDER}>
        {children}
      </figure>
    );
  }

  return (
    <figure className={LEARN_STYLES.figureCard} style={FIGURE_KEY_BORDER}>
      {children}
      <figcaption className={LEARN_STYLES.figureCaption}>{caption}</figcaption>
    </figure>
  );
}
