import { useAI } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

const MAP = {
  ready: { label: "AI Ready", dot: "bg-success", text: "text-muted-foreground" },
  working: { label: "AI Working", dot: "bg-primary animate-pulse", text: "text-primary" },
  acting: { label: "AI Acting", dot: "bg-primary animate-ping", text: "text-primary" },
  complete: { label: "AI Complete", dot: "bg-success", text: "text-success" },
  vision: { label: "Vision Fallback", dot: "bg-warning animate-pulse", text: "text-warning" },
  error: { label: "AI Needs Help", dot: "bg-destructive", text: "text-destructive" },
} as const;

export function StatusPill({ className }: { className?: string }) {
  const { status } = useAI();
  const s = MAP[status];
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors",
        className,
      )}
    >
      <span className={cn("size-2 rounded-full", s.dot)} />
      <span className={s.text}>{s.label}</span>
    </div>
  );
}
