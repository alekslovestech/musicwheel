"use client";
import { useState } from "react";
import { useEffect } from "react";

function getIsLandscape() {
  return typeof window !== "undefined" && window.matchMedia("(orientation: landscape)").matches;
}

export function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(getIsLandscape);
  useEffect(() => {
    const check = () => setIsLandscape(getIsLandscape());
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isLandscape;
}
