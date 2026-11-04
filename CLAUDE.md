# CLAUDE.md

## Notation conventions

Always prefer Arabic numerals to ordinal number words, and use accidental symbols instead of spelling them out.

- Use "6th" instead of "sixth"
- Use "♭6" instead of "flat 6" or "flat sixth"
- Use "♯4" instead of "sharp 4" or "sharp fourth"

Apply this in code, comments, UI copy, and documentation.

Exception: spell out interval names in prose ("major third", "minor sixth", "perfect fifth", "augmented second"). The number in an interval name counts letters on the staff, not semitones (a major third is 4 semitones), so a word keeps it from reading as a size. Scale degrees ("the 4th degree"), chord names ("dominant 7th", "diminished 7th"), symbols (m3, M6, ♭3) and the color legend's abbreviated labels keep numerals.

## Learn section content

- Avoid stating the same concept twice in different words within the same passage (e.g. don't say "three semitones" and then restate it as "a step and a half").
- Prefer semitones over steps/tones for interval sizes (e.g. "3 semitones" instead of "1½ steps" or "1½ tones").
- Italicize full names of scales/modes, intervals, and chords in narrative text (e.g. *Dorian*, *minor third*, *dominant 7th*) with `<i>`. Don't italicize abbreviations or symbols (m3, V7, Cmaj7), or anything inside figures, captions, or tables.

### See Also blocks

- Link inline when the link supports a specific claim in that sentence. Use a `SeeAlso` block (`components/Learn/prose/SeeAlso.tsx`) for onward reading the page doesn't depend on.
- Don't list a page in the block if the text already links to it.
- Order the items: those that elaborate something in the text come first, in the order that topic appears on the page; the rest follow, from closest to furthest from the page's topic.
- Link to pages by id from `lib/learn/learnPages.ts`, which holds one title and blurb per page. Add a blurb of your own only when the reason for the link matters more than the page's topic.
