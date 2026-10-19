import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { GalleryLayout } from "@/lib/weddingStore";

interface GalleryLayoutSelectorProps {
  value: GalleryLayout;
  onChange: (layout: GalleryLayout) => void;
  /** Photos used to fill the mini previews (falls back to tinted blocks). */
  photos?: string[];
}

const Block = ({ src, className }: { src?: string; className?: string }) => (
  <div
    className={cn("bg-primary/25 overflow-hidden rounded-[3px]", className)}>
    {src && <img src={src} alt="" className="w-full h-full object-cover" />}
  </div>
);

const previews = (p: (i: number) => string | undefined): Record<GalleryLayout, ReactNode> => ({
  default: (
    <div className="grid grid-cols-3 gap-1 p-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Block key={i} src={p(i)} className="aspect-square" />
      ))}
    </div>
  ),
  rhythm: (
    <div className="columns-3 gap-1 p-2 [&>*]:mb-1">
      <Block src={p(0)} className="aspect-[3/4]" />
      <Block src={p(1)} className="aspect-square" />
      <Block src={p(2)} className="aspect-[4/5]" />
      <Block src={p(3)} className="aspect-square" />
      <Block src={p(4)} className="aspect-[3/4]" />
    </div>
  ),
  square: (
    <div className="grid grid-cols-3 gap-1 p-2">
      {[0, 1, 2].map((i) => (
        <Block key={i} src={p(i)} className="aspect-square" />
      ))}
    </div>
  ),
  editorial: (
    <div className="grid grid-cols-2 gap-1.5 p-2">
      <Block src={p(0)} className="aspect-[4/5]" />
      <Block src={p(1)} className="aspect-[4/5] mt-3" />
    </div>
  ),
  strip: (
    <div className="flex gap-1 p-2 overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <Block key={i} src={p(i)} className="aspect-[3/4] w-[38%] shrink-0" />
      ))}
    </div>
  ),
  staggered: (
    <div className="grid grid-cols-3 gap-1 p-2 items-start">
      <Block src={p(0)} className="aspect-[3/4]" />
      <Block src={p(1)} className="aspect-[3/4] mt-3" />
      <Block src={p(2)} className="aspect-[3/4]" />
    </div>
  ),
  mosaic: (
    <div className="grid grid-cols-3 grid-rows-2 gap-1 p-2 h-full">
      <Block src={p(0)} className="col-span-2 row-span-2 h-full" />
      <Block src={p(1)} className="h-full" />
      <Block src={p(2)} className="h-full" />
    </div>
  ),
  spotlight: (
    <div className="relative h-full p-3">
      <Block src={p(0)} className="h-full w-full rounded-lg ring-2 ring-primary/60 shadow-lg" />
      <span className="absolute bottom-5 left-6 right-6 h-0.5 rounded bg-white/60"><span className="block h-full w-1/2 rounded bg-white" /></span>
    </div>
  ),
  band: (
    <div className="grid grid-cols-6 gap-0 mt-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Block key={i} src={p(i)} className="aspect-square rounded-none" />
      ))}
    </div>
  ),
});

const OPTIONS: Array<{ id: GalleryLayout; label: string; hint?: string }> = [
  { id: "default", label: "Template default", hint: "Keeps the gallery that comes with your template" },
  { id: "rhythm", label: "Rhythm grid" },
  { id: "square", label: "Square grid" },
  { id: "editorial", label: "Two editorial" },
  { id: "strip", label: "Swipe strip" },
  { id: "staggered", label: "Staggered columns" },
  { id: "mosaic", label: "Featured mosaic" },
  { id: "band", label: "Full-bleed band" },
  { id: "spotlight", label: "Spotlight (auto-scroll)", hint: "One photo at a time, advancing on its own" },
];

export const GalleryLayoutSelector = ({
  value,
  onChange,
  photos = [],
}: GalleryLayoutSelectorProps) => {
  const art = previews((i) => photos[i % Math.max(photos.length, 1)]);

  return (
    <div role="radiogroup" aria-label="Gallery layout" className="grid grid-cols-2 gap-3">
      {OPTIONS.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.id)}
            title={o.hint}
            className={cn(
              "text-left rounded-md border bg-card overflow-hidden transition-all",
              selected
                ? "border-primary ring-2 ring-primary shadow-md"
                : "border-border hover:border-primary/50",
            )}>
            <div className="h-24 bg-muted/60 overflow-hidden">{art[o.id]}</div>
            <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
              <span
                className={cn(
                  "w-3 h-3 rounded-full border",
                  selected ? "bg-primary border-primary" : "border-muted-foreground/40",
                )}
              />
              <span className={cn("text-sm font-medium", selected && "text-primary")}>
                {o.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
