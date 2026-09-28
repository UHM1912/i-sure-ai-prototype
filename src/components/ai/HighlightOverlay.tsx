import { useEffect, useState } from "react";
import { MousePointer2, ScanSearch, Sparkles } from "lucide-react";
import { useAI } from "@/lib/ai-engine";

type Rect = { top: number; left: number; width: number; height: number };

export function HighlightOverlay() {
  const { highlight } = useAI();
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (!highlight) {
      setRect(null);
      return;
    }
    let frame = 0;
    let cancelled = false;
    const track = () => {
      if (cancelled) return;
      const el = document.querySelector(`[data-action="${highlight.key}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
      frame = requestAnimationFrame(track);
    };
    const el = document.querySelector(`[data-action="${highlight.key}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    frame = requestAnimationFrame(track);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [highlight]);

  if (!highlight || !rect) return null;
  const vision = highlight.method === "VISION";

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="ai-pulse-ring absolute rounded-md transition-all duration-300"
        style={{ top: rect.top - 4, left: rect.left - 4, width: rect.width + 8, height: rect.height + 8 }}
      >
        {vision && (
          <div className="absolute inset-0 overflow-hidden rounded-md">
            <div className="ai-scanline h-1/4 w-full bg-warning/20" />
          </div>
        )}
      </div>
      <MousePointer2
        className="absolute size-4 fill-primary text-card transition-all duration-500"
        style={{ top: rect.top + rect.height / 2, left: rect.left + Math.min(rect.width - 12, 40) }}
      />
      <div
        className="absolute flex max-w-xs items-start gap-2 rounded-md border border-border bg-card px-3 py-2 shadow-panel transition-all duration-300"
        style={{ top: rect.top + rect.height + 10, left: rect.left }}
      >
        {vision ? (
          <ScanSearch className="mt-0.5 size-3.5 shrink-0 text-warning" />
        ) : (
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
        )}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {vision ? "Found with visual recognition" : "AI Guidance"}
          </p>
          <p className="text-xs text-foreground">{highlight.label}</p>
        </div>
      </div>
    </div>
  );
}
