import { createFileRoute } from "@tanstack/react-router";
import { Building2, FileSpreadsheet, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/common")({
  head: () => ({
    meta: [
      { title: "Common · Aegis Insure" },
      { name: "description", content: "Shared masters used across insurance modules: customers, branches, document templates and compliance." },
      { property: "og:title", content: "Common · Aegis Insure" },
      { property: "og:description", content: "Shared masters and reference data across all insurance modules." },
    ],
  }),
  component: Common,
});

const ITEMS = [
  { title: "Customer Master", copy: "8,932 customer records shared across modules.", icon: Users },
  { title: "Branch & Agency", copy: "214 branches, 1,082 mapped agents.", icon: Building2 },
  { title: "Document Templates", copy: "38 policy and claim document templates.", icon: FileSpreadsheet },
  { title: "Compliance Rules", copy: "Validation rules applied on every import.", icon: ShieldCheck },
];

function Common() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Common" description="Shared masters and reference data used by every module." />
      <div className="grid gap-4 sm:grid-cols-2">
        {ITEMS.map((i) => (
          <div
            key={i.title}
            className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-panel"
          >
            <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
              <i.icon className="size-4" />
            </div>
            <p className="mt-3 text-sm font-semibold">{i.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{i.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
