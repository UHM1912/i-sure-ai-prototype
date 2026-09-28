import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  CircleAlert,
  Loader2,
  Mic,
  ScanSearch,
  Send,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { useAI, type ActionStep } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  "Create a new life insurance record",
  "Show me imported policies",
  "Take me to General Insurance",
  "Open policy management",
  "Where can I import insurance data?",
  "Show me what I need to do next",
];

function StepRow({ step }: { step: ActionStep }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {step.state === "done" && <CheckCircle2 className="size-3.5 text-success" />}
      {step.state === "active" && <Loader2 className="size-3.5 animate-spin text-primary" />}
      {step.state === "fail" && <CircleAlert className="size-3.5 text-warning" />}
      {step.state === "pending" && <span className="size-3.5 rounded-full border border-border" />}
      <span
        className={cn(
          step.state === "pending" && "text-muted-foreground",
          step.state === "done" && "text-foreground",
          step.state === "active" && "font-medium text-primary",
          step.state === "fail" && "text-warning",
        )}
      >
        {step.label}
      </span>
    </div>
  );
}

function Waveform() {
  return (
    <div className="flex items-end gap-1">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="w-1 animate-pulse rounded-full bg-primary"
          style={{ height: `${8 + ((i * 7) % 18)}px`, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

export function AssistantPanel() {
  const {
    open,
    setOpen,
    messages,
    steps,
    thinking,
    listening,
    submit,
    simulateVoice,
    status,
    lastIntent,
    confirm,
    resolveConfirm,
  } = useAI();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, steps, listening]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        data-action="ask-ai"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-panel transition-opacity hover:opacity-90"
      >
        <Sparkles className="size-4" />
        Ask i-Sure AI
      </button>
    );
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-[min(400px,100vw)] flex-col border-l border-border bg-card shadow-panel">
      <header className="flex items-start justify-between border-b border-border px-4 py-3">
        <div className="flex gap-3">
          <div className="grid size-8 place-items-center rounded-md bg-primary-soft text-primary">
            <Bot className="size-4" />
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              i-Sure AI
              <span className="inline-flex items-center gap-1 text-xs font-normal text-success">
                <span className="size-1.5 rounded-full bg-success" />
                {status === "ready" ? "Ready" : "Active"}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              How can I help you?
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted"
          aria-label="Close assistant"
        >
          <X className="size-4" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Try asking
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="block w-full rounded-md border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary-soft"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-md px-3 py-2 text-sm",
                m.role === "user"
                  ? "bg-primary-soft text-foreground"
                  : m.error
                    ? "border border-destructive/30 bg-destructive/5 text-foreground"
                    : "border border-border bg-background",
              )}
            >
              <p>{m.text}</p>
              {m.spoken && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Volume2 className="size-3" /> Spoken response
                </p>
              )}
              {m.error && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => submit("Take me to Life Insurance")}>
                    Try Again
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => submit("Where can I import data?", { forceVision: true })}
                  >
                    <ScanSearch className="size-3.5" /> Use Vision
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {steps.length > 0 && (
          <div className="rounded-md border border-border bg-background p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              AI Action
            </p>
            <div className="space-y-1.5">
              {steps.map((s) => (
                <StepRow key={s.label} step={s} />
              ))}
            </div>
            {lastIntent && (
              <details className="mt-3 border-t border-border pt-2 text-[11px] text-muted-foreground">
                <summary className="cursor-pointer select-none text-xs text-primary">View AI reasoning</summary>
                <div className="mt-2 grid grid-cols-2 gap-1 font-mono">
                  <span>intent: {lastIntent.intent}</span>
                  <span>module: {lastIntent.module}</span>
                  <span>target: {lastIntent.target}</span>
                  <span>conf: {lastIntent.confidence}</span>
                  <span className="col-span-2">selector: [data-action="{lastIntent.target.toLowerCase().replace(/_/g, "-")}"]</span>
                </div>
              </details>
            )}
          </div>
        )}

        {listening && (
          <div className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5">
            <Mic className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Listening…</span>
            <Waveform />
          </div>
        )}

        {thinking && !listening && (
          <div className="flex items-center gap-1.5 px-1 text-muted-foreground">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      {confirm && (
        <div className="border-t border-border bg-warning-soft px-4 py-3">
          <p className="text-sm font-medium">AI is ready to perform this action.</p>
          <p className="text-xs text-muted-foreground">{confirm.label} · confirmation required</p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => resolveConfirm(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => resolveConfirm(true)}>
              Allow
            </Button>
          </div>
        </div>
      )}

      <form
        className="flex items-center gap-2 border-t border-border px-3 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          const text = input;
          setInput("");
          submit(text);
        }}
      >
        <button
          type="button"
          onClick={() => simulateVoice()}
          className="grid size-9 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
          aria-label="Voice input"
        >
          <Mic className="size-4" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell AI what you want…"
          className="h-9 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
        />
        <button
          type="submit"
          className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          aria-label="Send"
        >
          <Send className="size-4" />
        </button>
      </form>
    </aside>
  );
}
