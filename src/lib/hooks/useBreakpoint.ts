"use client";
import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("mobile");

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1024)
        setBreakpoint("desktop"); // lg
      else if (width >= 768)
        setBreakpoint("tablet"); // md
      else setBreakpoint("mobile"); // sm
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return breakpoint;
}
