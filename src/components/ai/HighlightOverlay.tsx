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

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="ai-pulse-ring absolute rounded-xl transition-all duration-300"
        style={{
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
        }}
      >
        {highlight.method === "VISION" && (
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div className="ai-scanline h-1/4 w-full bg-warning/30" />
          </div>
        )}
      </div>
      <div
        className="absolute flex items-center gap-2 transition-all duration-300"
        style={{ top: rect.top + rect.height + 12, left: rect.left }}
      >
        <MousePointer2 className="size-5 fill-primary text-primary drop-shadow" />
        <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-panel">
          {highlight.method === "VISION" ? (
            <ScanSearch className="size-3.5" />
          ) : (
            <Sparkles className="size-3.5" />
          )}
          AI is guiding you · {highlight.label}
        </span>
      </div>
    </div>
  );
}
