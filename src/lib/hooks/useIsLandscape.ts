"use client";
import { useState, useLayoutEffect } from "react";

function getIsLandscape() {
  return window.matchMedia("(orientation: landscape)").matches;
}

export function useIsLandscape() {
  // Starts false to match the server-rendered markup (window is undefined during SSR); the
  // layout effect below corrects it synchronously before paint, so there's no visible flash and
  // no hydration mismatch.
  const [isLandscape, setIsLandscape] = useState(false);
  useLayoutEffect(() => {
    const check = () => setIsLandscape(getIsLandscape());
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isLandscape;
}
