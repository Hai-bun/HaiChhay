import { cn } from "@/lib/utils";
import type { LocationStyle } from "@/lib/weddingStore";

interface LocationStyleSelectorProps {
  value: LocationStyle;
  onChange: (value: LocationStyle) => void;
}

const OPTIONS: { id: LocationStyle; label: string; hint: string }[] = [
  { id: "card", label: "Soft card", hint: "Photo beside a map with the address on top" },
  { id: "framed", label: "Framed cards", hint: "Photo and map in their own frames, flower corners" },
  { id: "mapcard", label: "Map backdrop", hint: "Soft map behind a centred info card" },
];

const Mini = ({ id }: { id: LocationStyle }) => {
  const box = "rounded-[3px] bg-primary/25";
  if (id === "framed")
    return (
      <div className="grid grid-cols-2 gap-1.5 p-2 h-full">
        <div className="rounded-md border border-primary/40 p-1"><div className={cn(box, "h-full")} /></div>
        <div className="rounded-md border border-primary/40 p-1 flex flex-col gap-1">
          <div className={cn(box, "h-3")} />
          <div className={cn(box, "flex-1 bg-primary/15")} />
          <div className="h-2 rounded-full bg-primary/60" />
        </div>
      </div>
    );
  if (id === "mapcard")
    return (
      <div className="relative h-full bg-primary/15">
        <div className="absolute inset-3 rounded-md bg-card shadow flex flex-col items-center justify-center gap-1">
          <div className="h-2 w-12 rounded bg-primary/50" />
          <div className="h-1.5 w-16 rounded bg-primary/25" />
          <div className="h-2.5 w-14 rounded-full bg-primary/60 mt-1" />
        </div>
        <span className="absolute -top-1 right-2 w-5 h-5 rounded-full bg-primary/50 ring-2 ring-card" />
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-1.5 p-2 h-full">
      <div className={cn(box, "h-full")} />
      <div className="rounded-md bg-primary/10 p-1 flex flex-col gap-1">
        <div className="h-3 rounded bg-card" />
        <div className="h-2 rounded-full bg-primary/60" />
        <div className={cn(box, "flex-1 bg-primary/15")} />
      </div>
    </div>
  );
};

/** Picks the layout of the Location section. */
export const LocationStyleSelector = ({ value, onChange }: LocationStyleSelectorProps) => (
  <div className="grid grid-cols-3 gap-3">
    {OPTIONS.map((o) => (
      <button
        key={o.id}
        type="button"
        onClick={() => onChange(o.id)}
        aria-pressed={value === o.id}
        className={cn(
          "rounded-lg border-2 p-2 text-left transition-colors",
          value === o.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}>
        <div className="aspect-[4/3] overflow-hidden rounded-md bg-card border border-border/60">
          <Mini id={o.id} />
        </div>
        <p className="mt-2 text-sm font-medium">{o.label}</p>
        <p className="text-xs text-muted-foreground">{o.hint}</p>
      </button>
    ))}
  </div>
);
