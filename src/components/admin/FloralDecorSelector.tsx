import { cn } from "@/lib/utils";
import type { FloralDecor } from "@/lib/weddingStore";

interface FloralDecorSelectorProps {
  value: FloralDecor;
  onChange: (value: FloralDecor) => void;
}

const OPTIONS: { id: FloralDecor; label: string; hint: string; image?: string }[] = [
  { id: "none", label: "None", hint: "Clean sections" },
  { id: "roses", label: "White roses", hint: "Soft roses with leaves", image: "/floral/roses-tl.svg" },
  { id: "botanical", label: "Line botanical", hint: "Green line-art flowers", image: "/floral/botanical-tl.svg" },
];

/** Picks the flower decoration drawn in the corners of the invitation sections. */
export const FloralDecorSelector = ({ value, onChange }: FloralDecorSelectorProps) => (
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
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-card border border-border/60">
          {o.image ? (
            <img src={o.image} alt="" className="absolute -left-2 -top-2 w-[85%] max-w-none" draggable={false} />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              No flowers
            </span>
          )}
        </div>
        <p className="mt-2 text-sm font-medium">{o.label}</p>
        <p className="text-xs text-muted-foreground">{o.hint}</p>
      </button>
    ))}
  </div>
);
