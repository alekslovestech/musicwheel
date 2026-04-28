"use client";
import { useState } from "react";
import { useEffect } from "react";

export function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(false);
  useEffect(() => {
    const check = () => setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isLandscape;
}
