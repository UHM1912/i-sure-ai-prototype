import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileStack,
  FileUp,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { recentActivity } from "@/data/mock";
import { useAI } from "@/lib/ai-engine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Insurance Operations · i-Sure" },
      {
        name: "description",
        content:
          "Manage insurance data and workflows from one workspace, with an AI layer that navigates and automates the application.",
      },
      { property: "og:title", content: "Insurance Operations · i-Sure" },
      {
        property: "og:description",
        content: "Policies, customers and pending actions in one AI-assisted insurance workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Total Clients", value: "8,932", delta: "+148 this month", icon: Users },
  { label: "Active Policies", value: "12,480", delta: "+312 this month", icon: FileStack },
  { label: "Renewals Due", value: "127", delta: "Next 30 days", icon: FileUp },
  { label: "Pending Claims", value: "24", delta: "9 need review", icon: TriangleAlert },
];

const INSIGHTS = [
  { title: "Import recent policy data", detail: "842 renewal rows are waiting in the queue.", prompt: "Where can I import insurance data?" },
  { title: "Review pending records", detail: "9 policies flagged as Under Review.", prompt: "Open policy management" },
  { title: "Complete customer information", detail: "4 records are missing coverage details.", prompt: "Create a new life insurance record" },
];

function Dashboard() {
  const { submit } = useAI();

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Dashboard"
        description="Overview of your clients, policies, renewals and claims."
        actions={
          <Button variant="outline" size="sm" data-action="ask-ai-dashboard" onClick={() => submit("Show me what I need to do next")}>
            <Sparkles className="size-4" /> Ask AI what's next
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-border bg-card p-4 shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <s.icon className="size-3.5 text-primary" />
            </div>
            <p className="mt-2 text-xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-border bg-card p-4 shadow-card lg:col-span-2">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
          <ul className="mt-2 divide-y divide-border">
            {recentActivity.map((a) => (
              <li key={a.title} className="flex items-center justify-between gap-4 py-2.5">
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-4" />
            <h2 className="text-sm font-semibold">AI Insights</h2>
          </div>
          <p className="mt-1 text-xs text-accent-foreground">
            3 actions can be completed automatically.
          </p>
          <div className="mt-3 space-y-2">
            {INSIGHTS.map((i) => (
              <button
                key={i.title}
                onClick={() => submit(i.prompt)}
                className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-left transition-shadow hover:shadow-card"
              >
                <p className="text-sm font-medium">{i.title}</p>
                <p className="text-xs text-muted-foreground">{i.detail}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          { to: "/life-insurance", title: "Life Insurance", copy: "Import, manage and create life policy records." },
          { to: "/general-insurance", title: "General Insurance", copy: "Motor, health, property and travel portfolios." },
          { to: "/investments", title: "Investments", copy: "Products, portfolio and transactions." },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-lg border border-border bg-card p-4 shadow-card transition-all hover:shadow-card"
          >
            <p className="flex items-center justify-between text-sm font-semibold">
              {c.title}
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{c.copy}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
