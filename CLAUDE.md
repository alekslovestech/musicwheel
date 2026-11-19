# CLAUDE.md

## Notation conventions

Always prefer Arabic numerals to ordinal number words, and use accidental symbols instead of spelling them out.

- Use "6th" instead of "sixth"
- Use "♭6" instead of "flat 6" or "flat sixth"
- Use "♯4" instead of "sharp 4" or "sharp fourth"

Apply this in code, comments, UI copy, and documentation.

Exception: spell out interval names in prose ("major third", "minor sixth", "perfect fifth", "augmented second"). The number in an interval name counts letters on the staff, not semitones (a major third is 4 semitones), so a word keeps it from reading as a size. Scale degrees ("the 4th degree"), chord names ("dominant 7th", "diminished 7th"), symbols (m3, M6, ♭3) and the color legend's abbreviated labels keep numerals.

## Code comments

Write a comment of 1 or 2 lines as `//` lines, never as `/** ... */` or `/* ... */`. Reserve `/** ... */` for comments of 3 or more lines.

## Learn section content

- Avoid stating the same concept twice in different words within the same passage (e.g. don't say "three semitones" and then restate it as "a step and a half").
- Prefer semitones over steps/tones for interval sizes (e.g. "3 semitones" instead of "1½ steps" or "1½ tones").
- Italicize full names of scales/modes, intervals, and chords in narrative text (e.g. *Dorian*, *minor third*, *dominant 7th*) with `<i>`. Don't italicize abbreviations or symbols (m3, V7, Cmaj7), or anything inside figures, captions, or tables.

### Article frame and onward links

Every article's page is wrapped in `ArticlePage` (`components/Learn/layout/ArticlePage.tsx`), which renders the back link, the position in a reading path, the content, one recommended next step, then See also. A page writes only its content:

```tsx
<ArticlePage id="chord-quality" seeAlso={["triad-inversions", "major-vs-minor-triads"]}>
  <h1 className={LEARN_STYLES.h1}>Chord Quality</h1>
  ...
</ArticlePage>
```

Don't write a back link, `ArticleNav`, `NextCard` or `SeeAlso` on an article page; the wrapper does, and `src/tests/LearnPages.test.ts` fails if you do. The scale comparison pages aren't in the registry, so they take `parent="comparisons"` instead of an `id`. Index pages (`isIndex: true` in the registry: Learn and its sections, plus Scale Comparisons) aren't articles: they use `BackLink` (`components/Learn/layout/BackLink.tsx`) and list their pages with `IndexEntry` (`components/Learn/layout/IndexEntry.tsx`): `<IndexEntry id="harmonic">blurb</IndexEntry>`. The title, topic `tags` and link style come from `LEARN_PAGES`; the blurb under it is written for the index and is longer than the registry's one-question blurb.

Where each link comes from:

- **Back link:** the page's `parent` in `LEARN_PAGES` (`lib/learn/learnPages.ts`), the id of the page it sits under. Every page but Learn must have one.
- **Next step:** a page in a reading path gets `ArticleNav`; a scales page outside the path gets a card into the Scales path; every other page gets a card into What's Useful About Music Theory, the start of the spine. These are the wrapper's rules, so don't override them page by page.
- **See also:** the `seeAlso` prop, at most 3 items (SeeAlso throws past that), with `seeAlsoTitle` to name the block when its links share a kind.
- **In the text:** `Aside` (`components/Learn/prose/Aside.tsx`) points to another page where its question comes up, at most 1 or 2 per article. Link inline when the link supports a specific claim in that sentence.

Rules for choosing and ordering See also items:

- Don't list a page if the text (inline link or `Aside`) already links to it, or if it is the page's Previous/Next in its path.
- Order the items: those that elaborate something in the text come first, in the order that topic appears on the page; the rest follow, from closest to furthest from the page's topic.
- Link to pages by id from `lib/learn/learnPages.ts`, which holds one title and blurb per page. Each blurb is the question the page answers ("Why does C/E still sound like C major?"), so a link promises an answer rather than naming a topic. Add a blurb of your own only when the reason for the link matters more than the page's topic.

### Testing Learn changes

Don't run the tests after every Learn edit, such as reordering pages, renaming titles or moving links. Run them occasionally, for example once a batch of structural changes has settled or when the user asks.

### Reading paths

Every article is one of 3 kinds:

- **The spine** (`LEARN_PATHS.start` in `lib/learn/learnPages.ts`): What's Useful About Music Theory, The Chromatic Circle, then Music Theory on the Chromatic Circle. It is the app's idea, and where every standalone piece sends a new reader.
- **Topic paths** (`LEARN_PATHS.scales`): a short sequence read in order, each page building on the last.
- **Groupings** (`LEARN_GROUPS`: "Intervals and Chords" and "Progressions"): pages on one topic with no order between them, listed on the section's index page. They get no ArticleNav; each ends with a NextCard like a standalone piece.
- **Side tracks** (`/learn/side-tracks`): optional pieces for the curious that nothing depends on - Symmetry and Dissonance, Interval Inversions, How Chord Colors Are Computed and the opinion essay. Standalone in every other respect, and listed on their own index instead of with a topic.
- **Standalone pieces**: everything else, meant to be entered from search or a forum post and to make sense alone. Examples: Accidentals, Color Coding and the scale comparisons.

Rules:

- `ArticleNav` derives Previous/Next, the "Scales · 2 of 5" position and the end-of-path cards from `LEARN_PATHS`. Don't hand-write a "see the next article" link.
- A page belongs to at most one path or grouping. Add a new path article to its path in `LEARN_PATHS` (not to See also). A grouping page goes in `LEARN_GROUPS` and on its index page instead. A new page also needs an entry in `LEARN_PAGES` with its `parent`. `src/tests/LearnPages.test.ts` checks this.
- Color Coding and Accidentals are reference for the spine, not part of it.
- Links in these components go through `TrackedLink`, which reports a `learn_link_click` event with its placement; use it for any new kind of onward link.
