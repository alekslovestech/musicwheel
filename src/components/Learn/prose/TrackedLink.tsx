"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import { trackLearnLinkClick, type LearnLinkPlacement } from "@/lib/tracking/track";

// A Link that reports a learn_link_click saying where on the page it sat, so click-through can be
// compared across NextCard, ArticleNav, SeeAlso, Aside and the figures' app links.
export function TrackedLink({
  href,
  placement,
  onClick,
  ...rest
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string; placement: LearnLinkPlacement }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={(event) => {
        trackLearnLinkClick({ from: pathname ?? "", to: href, placement });
        onClick?.(event);
      }}
      {...rest}
    />
  );
}
