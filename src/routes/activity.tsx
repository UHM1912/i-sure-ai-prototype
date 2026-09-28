import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { useAI } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity & History · i-Sure" },
      { name: "description", content: "Execution trace of every AI request: intent, module, target, action and outcome." },
      { property: "og:title", content: "Activity & History · i-Sure" },
      { property: "og:description", content: "Full AI execution trace for auditability in the insurance workspace." },
    ],
  }),
  component: ActivityLog,
});

function ActivityLog() {
  const { logs } = useAI();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Activity / History"
        description="Execution trace of AI requests, decisions and actions in this session."
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        {logs.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">
            No AI activity yet. Run a demo scenario or ask the assistant something.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {logs.map((l, i) => (
              <li key={`${l.time}-${i}`} className="flex items-start gap-4 px-5 py-3">
                <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">{l.time}</span>
                <span className="w-44 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {l.label}
                </span>
                <span
                  className={cn(
                    "font-mono text-xs",
                    l.tone === "ok" && "text-success",
                    l.tone === "warn" && "text-warning",
                    l.tone === "fail" && "text-destructive",
                  )}
                >
                  {l.value}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
