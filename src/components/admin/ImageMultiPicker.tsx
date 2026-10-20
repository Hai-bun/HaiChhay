import { Wand2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageMultiPickerProps {
  label: string;
  description: string;
  /** Chosen image URLs, in the order they will appear. Empty = automatic. */
  value: string[];
  options: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

/** Pick several uploaded images; the number on each tile is its position. */
export const ImageMultiPicker = ({
  label,
  description,
  value,
  options,
  onChange,
  max = 8,
}: ImageMultiPickerProps) => {
  const choices = Array.from(new Set(options.filter(Boolean)));
  const chosen = value.filter((u) => choices.includes(u));

  const toggle = (url: string) => {
    if (chosen.includes(url)) onChange(chosen.filter((u) => u !== url));
    else if (chosen.length < max) onChange([...chosen, url]);
  };

  return (
    <div className="space-y-2">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>

      {choices.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Upload photos in the Photos tab first, then choose them here.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onChange([])}
            aria-pressed={chosen.length === 0}
            className={cn(
              "w-20 h-20 rounded-md border flex flex-col items-center justify-center gap-1 text-xs transition-all",
              chosen.length === 0
                ? "border-primary ring-2 ring-primary text-primary bg-primary/5"
                : "border-border text-muted-foreground hover:border-primary/50",
            )}>
            <Wand2 className="w-4 h-4" />
            Auto
          </button>

          {choices.map((url) => {
            const at = chosen.indexOf(url);
            const selected = at >= 0;
            return (
              <button
                key={url}
                type="button"
                onClick={() => toggle(url)}
                aria-pressed={selected}
                className={cn(
                  "relative w-20 h-20 rounded-md overflow-hidden border transition-all",
                  selected ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50",
                )}>
                <img src={url} alt="" loading="lazy" draggable={false} className="w-full h-full object-cover" />
                {selected && (
                  <span className="absolute top-1 right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    {at + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {chosen.length === 0 ? "Auto uses your gallery photos." : `${chosen.length} of up to ${max} selected, shown in this order.`}
      </p>
    </div>
  );
};
