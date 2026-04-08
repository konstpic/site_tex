/** Типы и чередование вариантов появления (как на главной). Без «use client» — можно вызывать из Server Components. */

export type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "fade"
  | "scale"
  | "blur";

export const SECTION_REVEAL_VARIANTS: RevealVariant[] = [
  "up",
  "fade",
  "scale",
  "left",
  "right",
  "blur",
];

export function sectionRevealVariant(index: number): RevealVariant {
  return SECTION_REVEAL_VARIANTS[index % SECTION_REVEAL_VARIANTS.length] ?? "up";
}
