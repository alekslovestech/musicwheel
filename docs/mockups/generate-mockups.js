/**
 * Schematic UI mockups for two cross-mode unification proposals.
 *
 * Coherence rules demonstrated (dashed boxes mark the recurring clusters):
 *  - SOUND cluster, always above the wheel: what you hear. Transpose arrows
 *    (▼ ▲, never ♭/♯) move pitch. Harmony = arrows only (notes are absolute);
 *    Scales = key/scale picker + arrows; Progressions = key picker + arrows
 *    (moves the whole progression — key-relative content couples key + notes).
 *  - NOTATION ♯/♭ badge, always docked on the staff: how it's written.
 *    Harmony = interactive "Written as" picker (spelling is a choice);
 *    Scales/Progressions = read-only, derived from the key.
 *  - Transpose toast narrates what the same gesture did in each mode.
 *  - PLAY: one transport cluster, same slot in every mode.
 *  - COLOR = CHORD QUALITY, app's real palette (LCH interval mix):
 *    Major #82c400 · minor #abc300 · diminished #ff9e00. Only these three are
 *    shown precisely; other qualities stay neutral. Mode accents color chrome only.
 *  - Progressions: wide notation column (staff + motion lane + Roman notebook);
 *    wheel shrinks and shows roots + motion arrows around the circle.
 *
 * Run: node mockups/generate-mockups.js
 */
const path = require("path");
const sharp = require("sharp");

const OUT = __dirname;

const ACCENTS = {
  harmony: "#2563eb",
  scales: "#059669",
  progressions: "#7c3aed",
};
const MODES = ["harmony", "scales", "progressions"];
const MODE_LABELS = { harmony: "HARMONY", scales: "SCALES", progressions: "PROGRESSIONS" };

// App's actual quality colors (ColorUtils LCH mix of interval-class colors)
const QUALITY = { maj: "#82c400", min: "#abc300", dim: "#ff9e00" };

// I–V–vi–IV in C: roots on the chromatic circle + qualities
const PROG_STEPS = [
  [0, "maj", "I"],
  [7, "maj", "V"],
  [9, "min", "vi"],
  [5, "maj", "IV"],
];
const DEGREE_QUALITIES = [
  ["I", "maj"],
  ["ii", "min"],
  ["iii", "min"],
  ["IV", "maj"],
  ["V", "maj"],
  ["vi", "min"],
  ["vii°", "dim"],
];

// ---------------- svg primitives ----------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function rect(x, y, w, h, o = {}) {
  const {
    fill = "#ffffff",
    stroke = "#cbd5e1",
    rx = 6,
    sw = 1,
    dash = "",
    fillOpacity = 1,
  } = o;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-width="${sw}" ${
    dash ? `stroke-dasharray="${dash}"` : ""
  }/>`;
}

function txt(x, y, s, o = {}) {
  const { size = 11, fill = "#334155", anchor = "start", weight = "normal" } = o;
  return `<text x="${x}" y="${y}" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
}

function chip(x, y, w, h, label, o = {}) {
  const { active = false, accent = "#2563eb", size = 10, fill = "#ffffff", textFill } = o;
  const r = Math.min(h / 2, 9);
  return (
    rect(x, y, w, h, { fill: active ? accent : fill, stroke: active ? accent : "#cbd5e1", rx: r }) +
    txt(x + w / 2, y + h / 2 + size * 0.36, label, {
      size,
      anchor: "middle",
      fill: textFill || (active ? "#ffffff" : "#475569"),
      weight: active ? "bold" : "normal",
    })
  );
}

// quality-colored chip: tinted when idle, solid when active; text stays dark
function qchip(x, y, w, h, label, q, o = {}) {
  const { active = false, size = 10 } = o;
  const col = QUALITY[q];
  return (
    rect(x, y, w, h, {
      fill: col,
      fillOpacity: active ? 1 : 0.28,
      stroke: active ? "#334155" : col,
      sw: active ? 1.6 : 1,
      rx: Math.min(h / 2, 9),
    }) +
    txt(x + w / 2, y + h / 2 + size * 0.36, label, {
      size,
      anchor: "middle",
      fill: "#1e293b",
      weight: active ? "bold" : "normal",
    })
  );
}

// ---------------- coherence clusters ----------------
// dashed boxes + tiny labels mark "same widget, same slot, every mode"

// SOUND: what you hear. Arrows (▼ ▲) transpose pitch — never ♭/♯ glyphs.
// Harmony has no key picker (notes are absolute); Scales picks the scale/key;
// Progressions picks the key (and transposing moves the whole progression).
function soundClusterWidth(mode) {
  const keyW = mode === "harmony" ? 0 : mode === "scales" ? 124 : 92;
  return (keyW ? keyW + 4 : 0) + 44 + 10;
}

function soundCluster(x, y, mode) {
  const keyW = mode === "harmony" ? 0 : mode === "scales" ? 124 : 92;
  const innerW = (keyW ? keyW + 4 : 0) + 44;
  let s = rect(x - 5, y - 4, innerW + 10, 28, {
    fill: "none",
    stroke: "#94a3b8",
    dash: "2,2",
    rx: 6,
  });
  s += txt(x - 2, y - 7, "SOUND", { size: 6.5, fill: "#94a3b8", weight: "bold" });
  let cx = x;
  if (keyW) {
    s += chip(cx, y, keyW, 20, mode === "scales" ? "C Ionian (Major) ▾" : "Key: C major ▾", {
      size: 8.5,
    });
    cx += keyW + 4;
  }
  s += chip(cx, y, 20, 20, "▼", { size: 8 });
  s += chip(cx + 24, y, 20, 20, "▲", { size: 8 });
  return s;
}

// NOTATION: how it's written. Docked on the staff, since that's all it changes.
// Harmony: interactive spelling picker. Scales/Progressions: derived, read-only.
function notationBadge(x, y, mode, o = {}) {
  const { w = 108 } = o;
  const labels = {
    harmony: "Written as: C ▾",
    scales: "auto · 0♯",
    progressions: "auto · follows key",
  };
  const interactive = mode === "harmony";
  let s = rect(x - 5, y - 4, w + 10, 28, { fill: "none", stroke: "#94a3b8", dash: "2,2", rx: 6 });
  s += txt(x - 2, y - 7, "NOTATION ♯/♭", { size: 6.5, fill: "#94a3b8", weight: "bold" });
  s += chip(x, y, w, 20, labels[mode], { size: 8, textFill: interactive ? "#475569" : "#94a3b8" });
  return s;
}

// transient toast narrating what transpose (▲) just did in this mode
const TOAST_TEXT = {
  harmony: "Notes up a semitone — spelling unchanged",
  scales: "Key → D♭ major",
  progressions: "Whole progression → D♭ major",
};

function toast(x, y, mode, anchor = "start") {
  const t = TOAST_TEXT[mode];
  const w = t.length * 4.4 + 16;
  const tx = anchor === "middle" ? x - w / 2 : x;
  let s = rect(tx, y, w, 16, { fill: "#1e293b", stroke: "none", rx: 8 });
  s += txt(tx + w / 2, y + 11, t, { size: 8, anchor: "middle", fill: "#f8fafc" });
  return s;
}

function playCluster(x, y, accent, o = {}) {
  const { tempo = false } = o;
  const w = tempo ? 198 : 102;
  let s = rect(x - 6, y - 5, w + 12, 32, { fill: "none", stroke: "#94a3b8", dash: "2,2", rx: 6 });
  s += txt(x - 2, y - 8, "PLAY", { size: 6.5, fill: "#94a3b8", weight: "bold" });
  s += chip(x, y, 30, 22, "▶", { active: true, accent, size: 11 });
  s += chip(x + 36, y, 30, 22, "⏸", { accent, size: 11 });
  s += chip(x + 72, y, 30, 22, "◼", { accent, size: 10 });
  if (tempo) s += chip(x + 112, y, 86, 22, "Tempo 120", { accent, size: 9.5 });
  return s;
}

// compact quality legend — same slot in every screen of a proposal
function legendRow(x, y, o = {}) {
  const { size = 8 } = o;
  let s = "";
  let cx = x;
  [
    ["maj", "Maj"],
    ["min", "min"],
    ["dim", "dim"],
  ].forEach(([q, label]) => {
    s += rect(cx, y - 4, 14, 9, { fill: QUALITY[q], stroke: "#94a3b8", sw: 0.5, rx: 2 });
    s += txt(cx + 17, y + 4, label, { size, fill: "#475569" });
    cx += 17 + label.length * size * 0.6 + 8;
  });
  return s;
}

// ---------------- musical schematics ----------------

function wheelDotPositions(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    pts.push([cx + r * 0.78 * Math.cos(a), cy + r * 0.78 * Math.sin(a)]);
  }
  return pts;
}

function wheelBase(cx, cy, r) {
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r * 0.45}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`
  );
}

// Harmony: current chord as a quality-colored triangle. Scales: neutral scale
// polygon (shape, not quality) with quality-colored tonic triad dots.
function wheel(cx, cy, r, mode) {
  let s = wheelBase(cx, cy, r);
  const pts = wheelDotPositions(cx, cy, r);
  const dotR = r > 75 ? 6.5 : 5;
  if (mode === "harmony") {
    const tri = [pts[0], pts[4], pts[7]];
    s += `<polygon points="${tri.map((p) => p.join(",")).join(" ")}" fill="${QUALITY.maj}" fill-opacity="0.30" stroke="${QUALITY.maj}" stroke-width="2"/>`;
    pts.forEach(([px, py], i) => {
      const on = [0, 4, 7].includes(i);
      s += `<circle cx="${px}" cy="${py}" r="${on ? dotR : dotR * 0.6}" fill="${on ? QUALITY.maj : "#e2e8f0"}" stroke="#94a3b8" stroke-width="0.8"/>`;
    });
  } else {
    const deg = [0, 2, 4, 5, 7, 9, 11];
    s += `<polygon points="${deg.map((i) => pts[i].join(",")).join(" ")}" fill="#64748b" fill-opacity="0.06" stroke="#64748b" stroke-width="1"/>`;
    s += `<line x1="${cx}" y1="${cy - r * 0.45}" x2="${cx}" y2="${cy - r * 1.06}" stroke="#64748b" stroke-width="2"/>`;
    pts.forEach(([px, py], i) => {
      const inScale = deg.includes(i);
      const inTonicTriad = [0, 4, 7].includes(i);
      s += `<circle cx="${px}" cy="${py}" r="${inScale ? dotR : dotR * 0.6}" fill="${
        inTonicTriad ? QUALITY.maj : inScale ? "#cbd5e1" : "#eef2f7"
      }" stroke="#94a3b8" stroke-width="0.8"/>`;
    });
  }
  return s;
}

// Progressions: roots around the circle, quality-colored, with motion arrows
// (1→2→3→4, dashed loop back) — the progression "drawn onto" the wheel.
function progressionWheel(cx, cy, r) {
  let s = wheelBase(cx, cy, r);
  const pts = wheelDotPositions(cx, cy, r);
  pts.forEach(([px, py]) => {
    s += `<circle cx="${px}" cy="${py}" r="2.6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.6"/>`;
  });
  for (let k = 0; k < PROG_STEPS.length; k++) {
    const [i1] = PROG_STEPS[k];
    const [i2] = PROG_STEPS[(k + 1) % PROG_STEPS.length];
    const [x1, y1] = pts[i1];
    const [x2, y2] = pts[i2];
    const mx = (x1 + x2) / 2,
      my = (y1 + y2) / 2;
    const ctlx = cx + (mx - cx) * 0.42,
      ctly = cy + (my - cy) * 0.42;
    const isLoop = k === PROG_STEPS.length - 1;
    s += `<path d="M ${x1} ${y1} Q ${ctlx} ${ctly} ${x2} ${y2}" fill="none" stroke="#64748b" stroke-width="1.4" ${
      isLoop ? 'stroke-dasharray="3,3"' : ""
    } marker-end="url(#arrowG)"/>`;
  }
  PROG_STEPS.forEach(([i, q, rn], k) => {
    const [px, py] = pts[i];
    s += `<circle cx="${px}" cy="${py}" r="9.5" fill="${QUALITY[q]}" stroke="#475569" stroke-width="0.9"/>`;
    s += txt(px, py + 3, rn, { size: 7.5, anchor: "middle", fill: "#1e293b", weight: "bold" });
    const a = ((i * 30 - 90) * Math.PI) / 180;
    s += txt(cx + (r + 9) * Math.cos(a), cy + (r + 9) * Math.sin(a) + 3, String(k + 1), {
      size: 7.5,
      anchor: "middle",
      fill: "#64748b",
      weight: "bold",
    });
  });
  return s;
}

// Root-motion lane: pitch height of each chord root, arrows + interval labels.
function motionLane(x, y, w, h) {
  let s = rect(x, y, w, h, { fill: "#f8fafc", stroke: "#e2e8f0", rx: 4 });
  s += txt(x + 5, y + 10, "MOTION", { size: 6.5, fill: "#94a3b8", weight: "bold" });
  const x0 = x + 44,
    xw = w - 76;
  const py = (p) => y + h - 9 - (p / 9) * (h - 22);
  const px = (k) => x0 + (xw * k) / 3;
  const segs = ["↑ P5", "↑ M2", "↓ M3"];
  for (let k = 0; k < 3; k++) {
    const p1 = PROG_STEPS[k][0];
    const p2 = PROG_STEPS[k + 1][0];
    s += `<line x1="${px(k) + 8}" y1="${py(p1)}" x2="${px(k + 1) - 8}" y2="${py(p2)}" stroke="#64748b" stroke-width="1.3" marker-end="url(#arrowG)"/>`;
    s += txt((px(k) + px(k + 1)) / 2, Math.min(py(p1), py(p2)) - 3, segs[k], {
      size: 7,
      anchor: "middle",
      fill: "#64748b",
    });
  }
  PROG_STEPS.forEach(([p, q, rn], k) => {
    s += `<circle cx="${px(k)}" cy="${py(p)}" r="7" fill="${QUALITY[q]}" stroke="#475569" stroke-width="0.8"/>`;
    s += txt(px(k), py(p) + 2.8, rn, { size: 6.5, anchor: "middle", fill: "#1e293b", weight: "bold" });
  });
  return s;
}

// Roman-numeral bar notebook, one row; cell color = quality (precise palette)
function notebook(x, y, w, activeIdx = 1, cellH = 40) {
  const cols = PROG_STEPS.length;
  const gapX = 6;
  const cw = (w - gapX * (cols - 1)) / cols;
  let s = "";
  PROG_STEPS.forEach(([, q, rn], i) => {
    const cx0 = x + i * (cw + gapX);
    const active = i === activeIdx;
    s += rect(cx0, y, cw, cellH, {
      fill: QUALITY[q],
      fillOpacity: active ? 1 : 0.28,
      stroke: active ? "#334155" : QUALITY[q],
      sw: active ? 1.8 : 1,
      rx: 6,
    });
    s += txt(cx0 + cw / 2, y + cellH / 2 + 1, rn, {
      size: 12,
      anchor: "middle",
      weight: "bold",
      fill: "#1e293b",
    });
    s += txt(cx0 + cw / 2, y + cellH - 5, q, { size: 7.5, anchor: "middle", fill: "#475569" });
  });
  return s;
}

// schematic piano (no note dots — quality, not notes, is the focus)
function piano(x, y, w, h) {
  let s = rect(x, y, w, h, { fill: "#ffffff", stroke: "#94a3b8", rx: 4 });
  const n = 14;
  const kw = w / n;
  for (let i = 1; i < n; i++)
    s += `<line x1="${x + i * kw}" y1="${y}" x2="${x + i * kw}" y2="${y + h}" stroke="#cbd5e1" stroke-width="1"/>`;
  const blackAfter = [0, 1, 3, 4, 5];
  for (let o = 0; o < 2; o++)
    for (const b of blackAfter) {
      const i = o * 7 + b;
      if (i + 1 >= n) continue;
      s += rect(x + (i + 1) * kw - kw * 0.28, y, kw * 0.56, h * 0.55, {
        fill: "#475569",
        stroke: "none",
        rx: 1,
      });
    }
  return s;
}

function staffLines(x, y, w, h, color = QUALITY.maj, withTriad = true) {
  let s = "";
  for (let i = 0; i < 5; i++) {
    const ly = y + (h / 4) * i;
    s += `<line x1="${x}" y1="${ly}" x2="${x + w}" y2="${ly}" stroke="#94a3b8" stroke-width="1"/>`;
  }
  if (withTriad) {
    const cxx = x + w * 0.5;
    for (let j = 0; j < 3; j++)
      s += `<ellipse cx="${cxx}" cy="${y + h - j * (h / 4)}" rx="4.5" ry="3.2" fill="${color}" stroke="#475569" stroke-width="0.5"/>`;
  }
  return s;
}

// progression staff: 4 stacked triads, noteheads in each chord's quality color
function staffChords(x, y, w, h, activeIdx = 1) {
  let s = "";
  for (let i = 0; i < 5; i++) {
    const ly = y + (h / 4) * i;
    s += `<line x1="${x}" y1="${ly}" x2="${x + w}" y2="${ly}" stroke="#94a3b8" stroke-width="1"/>`;
  }
  PROG_STEPS.forEach(([, q], k) => {
    const cxx = x + w * (0.12 + (k * 0.76) / 3);
    const base = y + h * (0.85 + (k % 2 === 0 ? 0 : 0.12));
    for (let j = 0; j < 3; j++)
      s += `<ellipse cx="${cxx}" cy="${base - j * (h / 4)}" rx="4.2" ry="3" fill="${QUALITY[q]}" stroke="${
        k === activeIdx ? "#1e293b" : "#94a3b8"
      }" stroke-width="${k === activeIdx ? 1.1 : 0.5}"/>`;
  });
  return s;
}

// ================= PROPOSAL A : "One Shell, Three Modes" =================

function aTopBar(mode, W, compact = false) {
  let s = rect(1, 1, W - 2, compact ? 56 : 34, { fill: "#1e293b", stroke: "none", rx: 9 });
  s += txt(12, compact ? 20 : 22, "MusicWheel", { size: 11.5, fill: "#ffffff", weight: "bold" });
  const tabs = [
    ["Harmony", "harmony"],
    ["Scales", "scales"],
    ["Progressions", "progressions"],
  ];
  if (!compact) {
    let tx = 190;
    tabs.forEach(([l, m]) => {
      const w = l === "Progressions" ? 104 : 90;
      s += chip(tx, 7, w, 20, l, {
        active: m === mode,
        accent: ACCENTS[m],
        size: 10,
        fill: "#334155",
        textFill: m === mode ? "#fff" : "#cbd5e1",
      });
      tx += w + 8;
    });
  } else {
    let tx = 10;
    tabs.forEach(([l, m]) => {
      s += chip(tx, 32, 96, 20, l, {
        active: m === mode,
        accent: ACCENTS[m],
        size: 9.5,
        fill: "#334155",
        textFill: m === mode ? "#fff" : "#cbd5e1",
      });
      tx += 102;
    });
  }
  return s;
}

function proposalALandscape(mode) {
  const c = ACCENTS[mode];
  const W = 600;
  let s = aTopBar(mode, W);

  if (mode === "progressions") {
    // wheel panel: SOUND on top (key moves everything), roots + motion below
    s += rect(8, 40, 168, 260);
    s += soundCluster(20, 56, mode);
    s += toast(14, 86, mode);
    s += progressionWheel(92, 178, 54);
    s += txt(92, 252, "root motion 1→2→3→4", { size: 8, anchor: "middle", fill: "#94a3b8" });
    s += legendRow(28, 286);

    // wide notation column: picker / staff + NOTATION badge / motion / notebook / PLAY
    s += rect(184, 40, 408, 260);
    s += chip(198, 52, 180, 22, "I – V – vi – IV  (Pop)  ▾", { accent: c, size: 10 });
    s += notationBadge(478, 54, mode, { w: 104 });
    s += staffChords(198, 92, 380, 32);
    s += motionLane(198, 134, 380, 36);
    s += notebook(198, 180, 380, 1, 40);
    s += playCluster(204, 238, c, { tempo: true });
  } else {
    // staff strip with NOTATION badge docked at its right edge
    s += rect(8, 40, 584, 48);
    s += staffLines(24, 52, 260, 26, QUALITY.maj);
    s += txt(400, 62, "C Maj", { anchor: "end", size: 14, weight: "bold", fill: "#1e293b" });
    s += txt(400, 76, mode === "scales" ? "tonic triad — major" : "Major triad", {
      anchor: "end",
      size: 9,
      fill: "#94a3b8",
    });
    s += notationBadge(470, 56, mode);

    // wheel panel: SOUND on top, toast below it, legend at the bottom
    s += rect(8, 94, 260, 206);
    s += soundCluster(24, 108, mode);
    s += toast(18, 136, mode);
    s += wheel(138, 226, 62, mode);
    s += legendRow(24, 292);

    s += rect(276, 94, 316, 206);
    const x = 290,
      y = 94;
    if (mode === "harmony") {
      s += txt(x, y + 14, "INPUT", { size: 8.5, fill: "#94a3b8", weight: "bold" });
      ["Freeform", "Single", "Intervals", "Chords"].forEach((l, i) => {
        s += chip(x + i * 74, y + 20, 70, 20, l, { active: l === "Chords", accent: c, size: 9.5 });
      });
      s += txt(x, y + 58, "CHORD QUALITY", { size: 8.5, fill: "#94a3b8", weight: "bold" });
      s += qchip(x, y + 64, 70, 21, "Maj", "maj", { active: true });
      s += qchip(x + 74, y + 64, 70, 21, "min", "min");
      s += qchip(x + 148, y + 64, 70, 21, "dim", "dim");
      ["Aug", "7", "Maj7", "m7"].forEach((l, i) => {
        s += chip(x + i * 74, y + 91, 70, 21, l, { accent: c, size: 10, textFill: "#94a3b8" });
      });
      s += txt(x, y + 132, "Inversion:", { size: 10, fill: "#64748b" });
      ["Root", "1st", "2nd"].forEach((l, i) => {
        s += chip(x + 58 + i * 50, y + 122, 46, 18, l, { active: i === 0, accent: c, size: 9 });
      });
    } else {
      s += txt(x, y + 20, "PLAYBACK STYLE", { size: 8.5, fill: "#94a3b8", weight: "bold" });
      ["Note", "Drone", "Triad", "7th"].forEach((l, i) => {
        s += chip(x + i * 62, y + 26, 58, 20, l, { active: l === "Triad", accent: c, size: 9.5 });
      });
      s += txt(x, y + 70, "DEGREE QUALITIES", { size: 8.5, fill: "#94a3b8", weight: "bold" });
      DEGREE_QUALITIES.forEach(([l, q], i) => {
        s += qchip(x + i * 40, y + 76, 36, 20, l, q, { active: i === 0 });
      });
      s += txt(x, y + 116, "chip color = triad quality on that degree", { size: 8.5, fill: "#94a3b8" });
    }
    s += playCluster(x + 6, y + 170, c);
  }

  s += rect(8, 306, 584, 62);
  s += piano(16, 312, 568, 50);
  return s;
}

function proposalAPortrait(mode) {
  const c = ACCENTS[mode];
  let s = aTopBar(mode, 320, true);

  if (mode === "progressions") {
    s += rect(8, 62, 304, 330);
    s += chip(20, 72, 170, 22, "I – V – vi – IV  (Pop)  ▾", { accent: c, size: 9.5 });
    s += notationBadge(208, 76, mode, { w: 92 });
    s += staffChords(20, 110, 280, 32);
    s += motionLane(20, 154, 280, 36);
    s += notebook(20, 200, 280, 1, 42);
    s += playCluster(28, 262, c, { tempo: true });
    s += txt(20, 318, "Tap any bar to hear its quality", { size: 9, fill: "#94a3b8" });
    s += legendRow(20, 340);

    s += rect(8, 398, 304, 184);
    s += soundCluster(20, 412, mode);
    s += toast(20, 440, mode);
    s += progressionWheel(160, 510, 50);
  } else {
    s += rect(8, 62, 304, 46);
    s += staffLines(20, 73, 130, 24, QUALITY.maj);
    s += txt(200, 82, "C Maj", { anchor: "end", size: 12, weight: "bold", fill: "#1e293b" });
    s += notationBadge(222, 76, mode, { w: 82 });

    s += rect(8, 112, 304, 252);
    s += soundCluster(24, 128, mode);
    s += toast(24, 154, mode);
    s += wheel(160, 262, 82, mode);
    s += legendRow(24, 352);

    s += rect(8, 368, 304, 218);
    if (mode === "harmony") {
      ["Freeform", "Single", "Intervals", "Chords"].forEach((l, i) => {
        s += chip(16 + i * 74, 378, 70, 20, l, { active: l === "Chords", accent: c, size: 9 });
      });
      s += txt(16, 418, "CHORD QUALITY", { size: 8.5, fill: "#94a3b8", weight: "bold" });
      s += qchip(16, 424, 70, 22, "Maj", "maj", { active: true });
      s += qchip(90, 424, 70, 22, "min", "min");
      s += qchip(164, 424, 70, 22, "dim", "dim");
      ["Aug", "7", "Maj7", "m7"].forEach((l, i) => {
        s += chip(16 + i * 74, 452, 70, 22, l, { accent: c, size: 10, textFill: "#94a3b8" });
      });
      s += txt(16, 498, "Inversion:", { size: 10, fill: "#64748b" });
      ["Root", "1st", "2nd"].forEach((l, i) => {
        s += chip(74 + i * 52, 487, 48, 18, l, { active: i === 0, accent: c, size: 9 });
      });
      s += playCluster(22, 540, c);
    } else {
      s += txt(16, 388, "PLAYBACK STYLE", { size: 8.5, fill: "#94a3b8", weight: "bold" });
      ["Note", "Drone", "Triad", "7th"].forEach((l, i) => {
        s += chip(16 + i * 64, 394, 60, 20, l, { active: l === "Triad", accent: c, size: 9.5 });
      });
      s += txt(16, 438, "DEGREE QUALITIES", { size: 8.5, fill: "#94a3b8", weight: "bold" });
      DEGREE_QUALITIES.forEach(([l, q], i) => {
        s += qchip(16 + i * 41, 444, 37, 20, l, q, { active: i === 0 });
      });
      s += txt(16, 484, "chip color = triad quality on that degree", { size: 8.5, fill: "#94a3b8" });
      s += playCluster(22, 540, c);
    }
  }

  s += rect(8, 592, 304, 60);
  s += piano(14, 598, 292, 48);
  return s;
}

// ============ PROPOSAL B : "Wheel-Centric Learning Lens" ============

function bRail(mode) {
  let s = rect(1, 1, 54, 373, { fill: "#1e293b", stroke: "none", rx: 9 });
  const items = [
    ["harmony", "Chords"],
    ["scales", "Scales"],
    ["progressions", "Progr."],
  ];
  items.forEach(([m, label], i) => {
    const y = 14 + i * 56;
    const active = m === mode;
    s += rect(8, y, 38, 38, { fill: active ? ACCENTS[m] : "#334155", stroke: "none", rx: 8 });
    const cx = 27,
      cy = y + 19;
    if (m === "harmony")
      s += `<polygon points="${cx},${cy - 8} ${cx + 8},${cy + 6} ${cx - 8},${cy + 6}" fill="#fff"/>`;
    else if (m === "scales")
      s +=
        `<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="#fff" stroke-width="2"/>` +
        `<line x1="${cx}" y1="${cy - 8}" x2="${cx}" y2="${cy - 13}" stroke="#fff" stroke-width="2"/>`;
    else
      s += `<path d="M ${cx - 8} ${cy + 4} Q ${cx} ${cy - 10} ${cx + 8} ${cy + 4}" fill="none" stroke="#fff" stroke-width="2" marker-end="url(#arrowW)"/>`;
    s += txt(27, y + 49, label, { size: 7, anchor: "middle", fill: active ? "#fff" : "#94a3b8" });
  });
  return s;
}

const LEARN_TEXT = {
  harmony: ["Quality lives in the 3rd", "Major = bright · minor = dark"],
  scales: ["Every degree owns a quality", "I ii iii IV V vi vii° — color shows it"],
  progressions: ["V → I is a perfect cadence", "Tension resolves home to I"],
};

function learnCard(x, y, w, h, mode) {
  let s = rect(x, y, w, h, { fill: "#fffbeb", stroke: "#f59e0b", rx: 8 });
  s += txt(x + 10, y + 16, "★ LEARN", { size: 9, fill: "#b45309", weight: "bold" });
  s += txt(x + 10, y + 32, LEARN_TEXT[mode][0], { size: 9.5, fill: "#78350f", weight: "bold" });
  s += txt(x + 10, y + 46, LEARN_TEXT[mode][1], { size: 9, fill: "#92400e" });
  return s;
}

function nowLine(x, y, mode, anchor = "middle") {
  const label =
    mode === "harmony" ? "Now: C Major (I)" : mode === "scales" ? "Now: degree I — major" : "Now: V → I";
  let s = `<circle cx="${x - label.length * 2.6 - 8}" cy="${y - 3}" r="4" fill="${QUALITY.maj}" stroke="#475569" stroke-width="0.6"/>`;
  s += txt(x, y, label, { size: 10, anchor, fill: "#1e293b", weight: "bold" });
  return s;
}

function bControls(mode, c, x, y, w) {
  let s = txt(x, y + 11, MODE_LABELS[mode], { size: 8.5, fill: "#94a3b8", weight: "bold" });
  if (mode === "harmony") {
    ["Freeform", "Presets"].forEach((l, i) => {
      s += chip(x + i * 72, y + 17, 68, 20, l, { active: i === 1, accent: c, size: 9.5 });
    });
    s += qchip(x, y + 45, 56, 20, "Maj", "maj", { active: true, size: 9 });
    s += qchip(x + 60, y + 45, 56, 20, "min", "min", { size: 9 });
    s += qchip(x + 120, y + 45, 56, 20, "dim", "dim", { size: 9 });
    ["Aug", "7", "Maj7"].forEach((l, i) => {
      s += chip(x + i * 60, y + 70, 56, 19, l, { accent: c, size: 9, textFill: "#94a3b8" });
    });
  } else {
    s += txt(x, y + 28, "PLAYBACK STYLE", { size: 7.5, fill: "#94a3b8", weight: "bold" });
    ["Note", "Drone", "Triad", "7th"].forEach((l, i) => {
      s += chip(x + i * 50, y + 33, 46, 19, l, { active: l === "Triad", accent: c, size: 8.5 });
    });
    DEGREE_QUALITIES.forEach(([l, q], i) => {
      s += qchip(x + i * 28, y + 66, 25, 18, l, q, { active: i === 0, size: 7.5 });
    });
  }
  s += playCluster(x + 6, y + 106, c);
  return s;
}

function proposalBLandscape(mode) {
  const c = ACCENTS[mode];
  let s = bRail(mode);

  if (mode === "progressions") {
    s += soundCluster(86, 16, mode);
    s += toast(155, 46, mode, "middle");
    s += progressionWheel(153, 132, 52);
    s += nowLine(153, 202, mode);
    s += legendRow(80, 216);
    s += learnCard(64, 230, 182, 58, mode);

    s += rect(256, 10, 336, 288);
    s += chip(270, 20, 170, 22, "I – V – vi – IV  (Pop)  ▾", { accent: c, size: 9.5 });
    s += notationBadge(470, 24, mode, { w: 110 });
    s += staffChords(270, 60, 308, 30);
    s += motionLane(270, 100, 308, 34);
    s += notebook(270, 144, 308, 1, 42);
    s += playCluster(276, 204, c, { tempo: true });
    s += txt(270, 286, "cell · staff · wheel all share the quality color", { size: 8.5, fill: "#94a3b8" });
  } else {
    s += soundCluster(mode === "harmony" ? 188 : 129, 16, mode);
    s += toast(215, 44, mode, "middle");
    s += wheel(215, 172, 88, mode);
    s += nowLine(215, 280, mode);
    s += legendRow(150, 294);

    s += rect(370, 10, 222, 60);
    s += staffLines(380, 20, 100, 24, QUALITY.maj);
    s += txt(580, 22, "C Maj", { anchor: "end", size: 11, weight: "bold", fill: "#1e293b" });
    s += notationBadge(486, 36, mode, { w: 98 });
    s += rect(370, 78, 222, 152);
    s += bControls(mode, c, 382, 86, 200);
    s += learnCard(370, 238, 222, 60, mode);
  }

  s += rect(270, 306, 60, 5, { fill: "#cbd5e1", stroke: "none", rx: 2.5 });
  s += rect(62, 314, 532, 54, { fill: "#f8fafc", stroke: "#e2e8f0", rx: 6 });
  s += piano(70, 320, 516, 42);
  return s;
}

function proposalBPortrait(mode) {
  const c = ACCENTS[mode];
  let s = "";
  [
    ["Harmony", "harmony"],
    ["Scales", "scales"],
    ["Progressions", "progressions"],
  ].forEach(([l, m], i) => {
    s += chip(10 + i * 102, 10, 98, 24, l, { active: m === mode, accent: ACCENTS[m], size: 9.5 });
  });
  const scWidth = soundClusterWidth(mode);
  s += soundCluster(160 - (scWidth - 10) / 2, 48, mode);
  s += toast(160, 76, mode, "middle");

  if (mode === "progressions") {
    s += progressionWheel(160, 152, 54);
    s += nowLine(160, 226, mode);
    s += legendRow(90, 242);

    s += rect(10, 256, 300, 248);
    s += chip(22, 266, 166, 22, "I – V – vi – IV  (Pop)  ▾", { accent: c, size: 9 });
    s += notationBadge(202, 270, mode, { w: 96 });
    s += staffChords(22, 300, 276, 30);
    s += motionLane(22, 340, 276, 34);
    s += notebook(22, 384, 276, 1, 40);
    s += playCluster(30, 444, c, { tempo: true });

    s += learnCard(10, 512, 300, 74, mode);
  } else {
    s += wheel(160, 200, 92, mode);
    s += nowLine(160, 312, mode);
    s += legendRow(90, 328);
    s += learnCard(10, 340, 300, 78, mode);
    s += staffLines(212, 356, 86, 20, QUALITY.maj);
    s += notationBadge(206, 390, mode, { w: 92 });
    s += rect(10, 424, 300, 162);
    s += bControls(mode, c, 24, 432, 280);
  }

  s += rect(130, 596, 60, 5, { fill: "#cbd5e1", stroke: "none", rx: 2.5 });
  s += rect(8, 606, 304, 48, { fill: "#f8fafc", stroke: "#e2e8f0", rx: 6 });
  s += piano(14, 611, 292, 38);
  return s;
}

// ---------------- composition ----------------
const DEFS = `<defs>
  <marker id="arrowG" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
    <path d="M0,0 L5,2.5 L0,5 Z" fill="#64748b"/>
  </marker>
  <marker id="arrowW" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
    <path d="M0,0 L6,3 L0,6 Z" fill="#ffffff"/>
  </marker>
</defs>`;

async function compose(filename, title, subtitle, builder, W, H) {
  const gap = 28,
    titleH = 56,
    capH = 26;
  const totalW = gap + MODES.length * (W + gap);
  const totalH = titleH + capH + H + gap;
  let body = `<rect width="${totalW}" height="${totalH}" fill="#eef2f7"/>`;
  body += txt(gap, 28, title, { size: 18, weight: "bold", fill: "#0f172a" });
  body += txt(gap, 46, subtitle, { size: 11, fill: "#64748b" });
  MODES.forEach((m, i) => {
    const ox = gap + i * (W + gap),
      oy = titleH + capH;
    body += txt(ox + W / 2, titleH + 16, MODE_LABELS[m], {
      size: 13,
      weight: "bold",
      anchor: "middle",
      fill: ACCENTS[m],
    });
    body += `<g transform="translate(${ox},${oy})">${rect(0, 0, W, H, {
      fill: "#f8fafc",
      stroke: "#64748b",
      rx: 10,
      sw: 1.5,
    })}${builder(m)}</g>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}">${DEFS}${body}</svg>`;
  await sharp(Buffer.from(svg), { density: 144 }).png().toFile(path.join(OUT, filename));
  console.log("wrote", filename);
}

(async () => {
  await compose(
    "proposalA-landscape.png",
    "Proposal A — One Shell, Three Modes (landscape)",
    "SOUND cluster (▼▲ moves pitch; key picker only where content is key-relative) sits above the wheel; NOTATION ♯/♭ badge docks on the staff (spelling only); toast narrates what transpose did. Color = chord quality: Maj #82c400 · min #abc300 · dim #ff9e00.",
    proposalALandscape,
    600,
    375,
  );
  await compose(
    "proposalA-portrait.png",
    "Proposal A — One Shell, Three Modes (portrait)",
    "Same slots stacked: SOUND above the wheel, NOTATION on the staff, PLAY at panel bottom. Harmony transposes notes; Scales/Progressions transpose the key (notes + notation follow).",
    proposalAPortrait,
    320,
    660,
  );
  await compose(
    "proposalB-landscape.png",
    "Proposal B — Wheel-Centric Learning Lens (landscape)",
    "SOUND above the wheel (arrows only in Harmony — no key there), NOTATION badge on the staff card, toast narrates the gesture per mode. Progression drawn on the wheel (roots 1→2→3→4) + motion lane in the notation column.",
    proposalBLandscape,
    600,
    375,
  );
  await compose(
    "proposalB-portrait.png",
    "Proposal B — Wheel-Centric Learning Lens (portrait)",
    "Lens pills · SOUND cluster · wheel · Now + quality legend · LEARN card · controls with PLAY. NOTATION badge rides with the mini staff; Progressions swaps controls for the notation card.",
    proposalBPortrait,
    320,
    660,
  );
})();