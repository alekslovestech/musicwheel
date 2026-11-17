# Learn Content Review

Tracks readiness of `/learn` pages for promotion. Content is currently Claude-generated
and needs to be reviewed against what I actually want to say.

**Score scale (0-5):**
- 0 = not reviewed
- 1 = wrong direction, needs rewrite
- 2 = major gaps or inaccuracies
- 3 = usable but needs editing
- 4 = close, minor tweaks only
- 5 = ready to promote

Update the score column as pages are reviewed. Keep this file in the repo so
review progress is visible in git history.

**Path** is the reading path the page belongs to (see `LEARN_PATHS` in
`src/lib/learn/learnPages.ts`); "standalone" pages sit outside every path and must
make sense to a reader who arrives from a search or a forum post. **Promote** marks
the standalone pages that answer a question people ask on forums - the ones to post
first, phrased as that question.

## Learn index

| Page | Path | Score |
|---|---|---|
| Learn home | `page.tsx` | 0 |

## Approach

| Page | Path | Reading path | Promote | Score |
|---|---|---|---|---|
| Approach index | `approach/page.tsx` | - | | 4 |
| Chromatic circle | `approach/chromatic-circle/page.tsx` | start 1 | | 4.5 |
| What's useful about music theory | `approach/whats-useful-about-music-theory/page.tsx` | start 2 | | 4 |
| Music theory on the chromatic circle | `approach/music-theory-on-the-chromatic-circle/page.tsx` | start 3 | | 0 |
| What's wrong with music theory | `approach/whats-wrong-with-music-theory/page.tsx` | side track | later | 4.5 |
| Color coding | `approach/color-coding/page.tsx` | standalone | | 4.5 |
| Chord color formula | `approach/chord-color-formula/page.tsx` | side track | | 0 |
| Accidentals | `approach/accidentals/page.tsx` | standalone | | 4.5 |

## Chords

| Page | Path | Reading path | Promote | Score |
|---|---|---|---|---|
| Intervals and Chords index | `chords/page.tsx` | - | | 0 |
| Progressions index | `progressions/page.tsx` | - | | 0 |
| Major vs minor triads | `chords/major-vs-minor-triads/page.tsx` | group: intervals and chords | | 3.5 |
| Chord quality | `chords/chord-quality/page.tsx` | group: intervals and chords | | 4 |
| Triad inversions | `chords/triad-inversions/page.tsx` | group: intervals and chords | yes | 4.5 |
| Chord progressions (draft) | `progressions/chord-progressions/page.tsx` | group: progressions | | 0 |
| Cadences (draft) | `progressions/cadences/page.tsx` | group: progressions | | 0 |
| Roman numerals | `chords/roman-numerals/page.tsx` | group: progressions | | 4 |

## Scales

| Page | Path | Reading path | Promote | Score |
|---|---|---|---|---|
| Scales index | `scales/page.tsx` | - | | 3 |
| Scale degrees | `scales/scale-degrees/page.tsx` | scales 1 | | 3.5 |
| Greek modes | `scales/greek-modes/page.tsx` | scales 2 | | 3.5 |
| Relative vs parallel modes | `scales/relative-vs-parallel-modes/page.tsx` | scales 3 | yes | 3.5 |
| Harmonic (major/minor overview) | `scales/harmonic/page.tsx` | scales 4 | | 4.5 |
| Modal families | `scales/modal-families/page.tsx` | scales 5 | | 3 |
| Melodic minor modes | `scales/melodic-minor-modes/page.tsx` | standalone | | 3.5 |

## Scales / Comparisons

All standalone. Minor vs Dorian is the first to promote.

| Page | Path | Score |
|---|---|---|
| Comparisons index | `scales/comparisons/page.tsx` | 3 |
| Major vs Lydian | `scales/comparisons/major-vs-lydian/page.tsx` | 0 |
| Major vs Mixolydian | `scales/comparisons/major-vs-mixolydian/page.tsx` | 0 |
| Minor vs Dorian | `scales/comparisons/minor-vs-dorian/page.tsx` | 0 |
| Minor vs Phrygian | `scales/comparisons/minor-vs-phrygian/page.tsx` | 0 |
| Locrian vs Phrygian | `scales/comparisons/locrian-vs-phrygian/page.tsx` | 0 |
| Dorian vs Ukrainian Dorian | `scales/comparisons/dorian-vs-ukrainian-dorian/page.tsx` | 0 |
| Phrygian vs Phrygian Dominant | `scales/comparisons/phrygian-vs-phrygian-dominant/page.tsx` | 0 |
| Minor vs Harmonic Minor | `scales/comparisons/minor-vs-harmonic-minor/page.tsx` | 0 |
| Major vs Harmonic Major | `scales/comparisons/major-vs-harmonic-major/page.tsx` | 0 |
| Harmonic Minor vs Harmonic Major | `scales/comparisons/harmonic-minor-vs-harmonic-major/page.tsx` | 0 |
| Harmonic Minor vs Melodic Minor | `scales/comparisons/harmonic-minor-vs-melodic-minor/page.tsx` | 0 |
| Harmonic Minor vs Hungarian Minor | `scales/comparisons/harmonic-minor-vs-hungarian-minor/page.tsx` | 0 |
| Harmonic Major vs Double Harmonic Major | `scales/comparisons/harmonic-major-vs-double-harmonic-major/page.tsx` | 0 |
| Double Harmonic Major vs Panthuvarali | `scales/comparisons/double-harmonic-major-vs-panthu-varaali/page.tsx` | 0 |
| Major vs Melodic Minor | `scales/comparisons/major-vs-melodic-minor/page.tsx` | 0 |

## Other

| Page | Path | Reading path | Promote | Score |
|---|---|---|---|---|
| Interval inversions | `interval-inversions/page.tsx` | group: intervals and chords | yes | 5 |
| Symmetry and dissonance | `symmetry-and-dissonance/page.tsx` | side track | yes | 5 |
