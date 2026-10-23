import type { CSSProperties } from "react";

export const s = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  } satisfies CSSProperties,
  separator: {
    color: "var(--text-muted)",
    fontSize: 12,
  } satisfies CSSProperties,
  empty: {
    opacity: 0.45,
    pointerEvents: "none",
  } satisfies CSSProperties,
} as const;
