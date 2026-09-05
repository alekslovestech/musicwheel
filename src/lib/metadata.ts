import type { Metadata, Viewport } from "next";

const DEFAULT_SITE_URL = "https://musicwheel.app";

/** Canonical site origin for metadata and OG URLs. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  
  return DEFAULT_SITE_URL;
}

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Base metadata shared across the application
export const baseMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Music Wheel App",
  keywords: [
    "music theory",
    "chromatic circle",
    "circular keyboard",
    "music education",
    "harmony",
    "geometry",
    "color coding chords",
    "circle of fifths",
  ],
  description: "Interactive music theory application for exploring the chromatic circle",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Music Wheel",
    description: "Interactive music theory application for exploring the chromatic circle",
    type: "website",
    url: "/",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Music Wheel Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music Wheel",
    description: "Interactive music theory application for exploring the chromatic circle",
  },
};

// Harmony view metadata
export const harmonyViewMetadata: Metadata = {
  ...baseMetadata,
  title: "Music Wheel App - Intervals and Chords",
  keywords: ["black and white keys", "intervals", "chord presets"],
  description: "Exploring intervals and chords on the chromatic circle",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Music Wheel - Harmony View",
    description: "Exploring intervals and chords on the chromatic circle",
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Music Wheel - Harmony View",
    description: "Basic features for exploring music theory with the chromatic circle",
  },
};

// Scales view metadata
export const scalesViewMetadata: Metadata = {
  ...baseMetadata,
  title: "Music Wheel App - Musical Modes and Scales",
  keywords: [
    "ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian",
    "hungarian minor",
    "ukranian dorian",
    "phrygian dominant",
    "greek modes",
    "musical modes",
    "modes",
    "scales",
    "chords",
    "progressions",
  ],
  description: "Scales Preview with the chromatic circle",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Music Wheel App - Musical Modes and Scales",
    description: "Exploring musical modes and scales on the chromatic circle",
    url: "/scales",
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Music Wheel App - Musical Modes and Scales",
    description: "Exploring musical modes and scales on the chromatic circle",
  },
};

// Chord Progressions view metadata
export const chordProgressionViewMetadata: Metadata = {
  ...baseMetadata,
  title: "Music Wheel App - Chord Progressions",
  keywords: ["chord progressions", "cadences"],
  description: "Exploring chord progressions on the chromatic circle",
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Music Wheel - Chord Progressions",
    description: "Exploring chord progressions on the chromatic circle",
    url: "/progressions",
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Music Wheel - Chord Progressions",
    description: "Exploring chord progressions on the chromatic circle",
  },
};


// Per-slug metadata for scales and progressions (canonical path, no query params). `description`
// overrides the base view's generic description; omitted, it falls back to `base.description`.
export function metadataForSlugPage(
  base: Metadata,
  pathname: string,
  itemTitle: string,
  description?: string,
): Metadata {
  const pageTitle = `Music Wheel - ${itemTitle}`;
  const pageDescription = description ?? base.description ?? undefined;

  return {
    ...base,
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      ...base.openGraph,
      title: pageTitle,
      description: pageDescription,
      url: pathname,
    },
    twitter: {
      ...base.twitter,
      title: pageTitle,
      description: pageDescription,
    },
    alternates: {
      canonical: pathname,
    },
  };
}
