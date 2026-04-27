// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  safelist: [
    // Force these classes to be generated
    "bg-test",
    {
      pattern: /bg-keys-*/,
    },
    {
      pattern: /fill-keys-*/,
    },
    {
      pattern: /text-keys-*/,
    },
    {
      pattern: /border-keys-*/,
    },
    {
      pattern: /border-containers-*/,
    },
    {
      pattern: /text-playback-*/,
    },
  ],
  theme: {
    extend: {
      boxShadow: {
        "linear-key": "inset 0 0 0 1px rgba(0, 0, 0, 0.5)",
      },
      colors: {
        test: "red",

        chordprogression: {
          active: "rgb(245, 158, 66)", // Amber 500
        },

        buttons: {
          // Slightly warmer grays (less blue) for a softer UI; inactive ~6% lighter
          bgDefault: "rgb(235, 233, 229)",
          bgHover: "rgb(221, 218, 212)",
          bgSelected: "rgb(99, 132, 165)", //"#598abb",
          textDefault: "rgb(26, 26, 26)", //"#1A1A1A",
          textSelected: "rgb(255, 255, 255)", //"#ffffff",
          border: "rgba(45, 45, 45, 0.05)",
          borderSelected: "rgba(192, 42, 42, 0.2)",
          bgDisabled: "rgb(239, 237, 233)",

          // New action button colors (inactive default ~6% lighter)
          actionBgDefault: "rgb(248, 246, 242)",
          actionBgHover: "rgb(232, 228, 220)", // Darker on hover for press effect
          actionBgActive: "rgb(210, 204, 192)", // Even darker when actively pressed
          actionBorder: "rgba(60, 60, 60, 0.2)", // Stronger border for definition
          actionText: "rgb(50, 50, 50)", // Slightly different text color
        },
        // New playback button colors
        playback: {
          scalesMode: "rgb(37, 99, 235)", //#2563eb
          defaultMode: "rgb(59, 130, 246)", //#3b82f6
        },

        labels: {
          textDefault: "rgb(31, 31, 31)", //"#1f1f1f",
        },
        keys: {
          bgWhite: "rgb(250, 250, 246)", //"#fafaf6",
          bgBlack: "rgb(68, 68, 68)", //"#444444",
          bgWhiteSelected: "rgb(190, 227, 236)", //"#BEE3EC",
          bgBlackSelected: "rgb(90, 156, 179)", //"#5A9CB3",
          textOnWhiteSelected: "rgb(63, 105, 201)", // Softer blue for selected white keys
          textOnBlackSelected: "rgb(255, 255, 255)", // White for selected black keys
          textOnWhiteFaded: "rgba(100, 100, 110, 0.5)", //"#64646E",
          textOnBlackFaded: "rgba(200, 200, 210, 0.5)", //"#C8C8D2",
          bgHover: "rgb(240, 240, 240)", //"#f0f0f0",
          borderColor: "rgb(110, 110, 110)", //"#6E6E6E",

          bgHighlighted: "rgb(113, 182, 255)", //"#B0D6FD",
          bgHighlightedSelected: "rgb(59, 97, 222)", //"#3B61DE",
          textOnHighlighted: "rgb(255, 255, 255)", // #FFFFFF

          bgMuted: "rgb(228, 229, 230)", //"#E4E5E6",
          bgMutedSelected: "rgb(150, 150, 150)", //"#969696",
          textOnMuted: "rgb(51, 51, 51)", //"#333333",

          bgRootNote: "rgb(222, 97, 59)", //"#DE613B",

          borderRootNote: "rgb(255, 0, 0)", //"#6E6E6E",
          scaleBoundaryColor: "rgb(60, 60, 60)", //"#3C3C3C",
        },
        containers: {
          outline: "rgba(0,0,128,0.01)", // Default container border (fainter)
          outlineDebug: "rgba(0,0,0,0.5)", // Debug container border
          divider: "rgba(45, 45, 45, 0.15)",
        },
        canvas: {
          bgDefault: "rgb(212, 214, 216)", // Even darker gray than before
          bgScales: "rgb(220, 220, 220)", //"#F0F2F5",
        },
      },
      spacing: {
        //used for gaps and margins
        tight: "0.25rem",
        snug: "0.5rem",
        normal: "1rem",
        loose: "1.25rem",
        spacious: "1.5rem",
      },
      minWidth: {
        "button-sm": "1.75rem",
        "button-md": "2.25rem",
        "button-lg": "2.75rem",
      },
    },
  },
};
