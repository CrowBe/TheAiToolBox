"use client";

import { useState } from "react";
import { faviconSrc, initials, inkForHex } from "@/engine/text";

export function ItemMark({
  name,
  url,
  color,
  size = "sm",
}: {
  name: string;
  url?: string;
  color?: string;
  size?: "sm" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const src = !failed && url ? faviconSrc(url) : null;
  const dimension = size === "lg" ? "size-14 text-lg" : "size-10 text-sm";
  const background = color ?? "var(--accent)";
  const foreground = color ? inkForHex(color) : "var(--accent-ink)";

  return (
    <span
      aria-hidden="true"
      className={`${dimension} relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line font-semibold`}
      style={{ backgroundColor: background, color: foreground }}
    >
      {initials(name)}
      {src ? (
        // Each product serves its own favicon. next/image would need a remote pattern per host.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          src={src}
          width={64}
          height={64}
          className="absolute inset-0 size-full bg-elev object-contain p-1.5"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}
