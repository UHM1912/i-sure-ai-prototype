import { createFileRoute } from "@tanstack/react-router";
import {
  Braces,
  Brain,
  CheckCircle2,
  Eye,
  MousePointerClick,
  Mic,
  MonitorPlay,
  ScanSearch,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { SCENARIOS, useAI } from "@/lib/ai-engine";

export const Route = createFileRoute("/ai-automation")({
  head: () => ({
    meta: [
      { title: "AI Automation · Aegis Insure" },
      { name: "description", content: "AI capability command centre: intent understanding, DOM navigation, vision fallback and simulated browser automation." },
      { property: "og:title", content: "AI Automation · Aegis Insure" },
      { property: "og:description", content: "See how the AI layer understands intent, finds elements and acts on the insurance application." },
    ],
  }),
  component: AIAutomation,
});

const CAPABILITIES = [
  { name: "Intent Understanding", state: "Active", icon: Brain },
  { name: "Screen Understanding", state: "Active", icon: MonitorPlay },
  { name: "DOM Navigation", state: "Active", icon: Braces },
  { name: "Voice Interaction", state: "Active", icon: Mic },
  { name: "Vision Fallback", state: "Available", icon: Eye },
  { name: "Browser Automation", state: "Prototype", icon: MousePointerClick },
];

const PIPELINE = [
  "User request",
  "Voice / text",
  "AI understanding",
  "Intent + action",
  "Page understanding",
  "DOM element search",
  "Playwright action",
  "UI response",
];

const FALLBACK = ["DOM target not found", "Vision fallback", "Visual target detection", "Action"];

function AIAutomation() {
  const { lastIntent, domTrace, runScenario, running } = useAI();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="AI Automation"
        description="The planned AI operating layer on top of the insurance application."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CAPABILITIES.map((c) => (
          <div key={c.name} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
                <c.icon className="size-4" />
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  c.state === "Active"
                    ? "bg-success-soft text-success"
                    : c.state === "Available"
                      ? "bg-primary-soft text-primary"
                      : "bg-warning-soft text-warning"
                }`}
              >
                {c.state}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold">{c.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="text-sm font-semibold">Automation flow</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="space-y-2">
              {PIPELINE.map((p, i) => (
                <div key={p}>
                  <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium">
                    {p}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div className="mx-auto h-3 w-px bg-border" aria-hidden />
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fallback branch
              </p>
              {FALLBACK.map((p, i) => (
                <div key={p}>
                  <div className="rounded-lg border border-warning/40 bg-warning-soft px-3 py-2 text-xs font-medium text-warning-foreground">
                    {p}
                  </div>
                  {i < FALLBACK.length - 1 && <div className="mx-auto h-3 w-px bg-border" aria-hidden />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <ScanSearch className="size-4 text-primary" /> Element understanding
            </h2>
            <div className="mt-3 space-y-1.5">
              {(domTrace.length
                ? domTrace
                : [
                    { stage: "User intent", done: false },
                    { stage: "Page understanding", done: false },
                    { stage: "DOM element matching", done: false },
                    { stage: "Target identified", done: false },
                    { stage: "Browser action", done: false },
                  ]
              ).map((t) => (
                <div key={t.stage} className="flex items-center gap-2 text-xs">
                  {t.done ? (
                    <CheckCircle2 className="size-3.5 text-success" />
                  ) : (
                    <span className="size-3.5 rounded-full border border-border" />
                  )}
                  <span className={t.done ? "" : "text-muted-foreground"}>{t.stage}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
              <p>&lt;button&gt;{lastIntent?.targetLabel ?? "Import Data"}&lt;/button&gt;</p>
              <p className="text-muted-foreground">
                selector: {lastIntent?.selector ?? '[data-action="import-data"]'}
              </p>
              <p className="text-success">
                status: {lastIntent ? "element found" : "awaiting request"}
              </p>
              <p className="text-muted-foreground">
                detection: {lastIntent?.detectionMethod ?? "DOM"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold">Run a scenario</h2>
            <div className="mt-3 space-y-2">
              {SCENARIOS.map((s) => (
                <Button
                  key={s.key}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled={running !== null}
                  onClick={() => runScenario(s.key)}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-semibold">AI Browser Control (simulated)</h2>
        <p className="text-xs text-muted-foreground">
          Playwright-style execution trace. No real browser automation runs in this prototype.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-5">
          {["Locate element", "Verify element", "Move cursor", "Click element", "Navigate"].map((s) => (
            <div
              key={s}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs"
            >
              {s}
              <CheckCircle2 className="size-3.5 text-success" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
