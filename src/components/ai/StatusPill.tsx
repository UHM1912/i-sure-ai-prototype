import { useAI } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

const MAP = {
  ready: { label: "AI Ready", dot: "bg-success", text: "text-muted-foreground" },
  working: { label: "AI Working", dot: "bg-primary animate-pulse", text: "text-primary" },
  acting: { label: "AI Acting", dot: "bg-primary animate-pulse", text: "text-primary" },
  complete: { label: "AI Complete", dot: "bg-success", text: "text-success" },
  vision: { label: "Vision Fallback", dot: "bg-warning animate-pulse", text: "text-warning" },
  error: { label: "AI Needs Help", dot: "bg-destructive", text: "text-destructive" },
} as const;

export function StatusPill({ className }: { className?: string }) {
  const { status } = useAI();
  const s = MAP[status];
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-1 text-xs", className)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      <span className={s.text}>{s.label}</span>
    </div>
  );
}
