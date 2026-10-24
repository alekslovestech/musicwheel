"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { THUMBNAIL_HEIGHT, THUMBNAIL_WIDTH } from "@/lib/thumbnail";

/** Query flag the generator script adds: the page renders the bare 1200x630 stage in the top-left
 * corner, so the screenshot can be cropped to exactly the stage. Also what the preview iframe
 * below loads. */
const CAPTURE_PARAM = "capture";

type Mode = "pending" | "capture" | "preview";

/** A fixed white stage the size of a thumbnail (see lib/thumbnail).
 *
 * With ?capture (the generator script) it renders the stage itself, unscaled. Opened normally in
 * a browser it shows that same capture view in a 1200x630 iframe, centered and scaled to fit the
 * window, so it looks identical to the generated image at any window size. The iframe is the
 * point: the page inside always lays out at its true size, and only the finished result is
 * scaled. Scaling the live layout instead (transform or zoom) breaks it in small windows - the
 * wheel and ribbon measure themselves, and the browser won't shrink text below a minimum size.
 *
 * Which of the two applies is only known in the browser, so until then the stage is rendered but
 * hidden - it lays out and measures normally, but a browser visit never flashes it unscaled. */
export function PromoStage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode>("pending");
  const [scale, setScale] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const isCapture = new URLSearchParams(window.location.search).has(CAPTURE_PARAM);
    setMode(isCapture ? "capture" : "preview");
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (mode !== "preview" || !frame) return;
    const update = () =>
      setScale(
        Math.min(frame.clientWidth / THUMBNAIL_WIDTH, frame.clientHeight / THUMBNAIL_HEIGHT),
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [mode]);

  // The iframe can finish loading before React attaches onLoad, so the event is never seen.
  // Catch that case once it's mounted.
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (doc?.readyState === "complete" && doc.location.href !== "about:blank") setIsLoaded(true);
  }, [mode]);

  if (mode !== "preview") {
    return (
      <div
        className="flex items-center justify-center overflow-hidden bg-white"
        style={{
          width: THUMBNAIL_WIDTH,
          height: THUMBNAIL_HEIGHT,
          visibility: mode === "capture" ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div ref={frameRef} className="fixed inset-0 overflow-hidden bg-gray-100">
      <iframe
        ref={iframeRef}
        src={`${pathname}?${CAPTURE_PARAM}`}
        title="Promo image preview"
        onLoad={() => setIsLoaded(true)}
        className="absolute left-1/2 top-1/2 border-0 bg-white"
        style={{
          width: THUMBNAIL_WIDTH,
          height: THUMBNAIL_HEIGHT,
          visibility: isLoaded && scale !== null ? "visible" : "hidden",
          transform: `translate(-50%, -50%) scale(${scale ?? 1})`,
        }}
      />
    </div>
  );
}
