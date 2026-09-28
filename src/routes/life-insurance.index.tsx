import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, FilePlus2, Upload } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { LifeTabs } from "@/components/common/LifeTabs";

export const Route = createFileRoute("/life-insurance/")({
  head: () => ({
    meta: [
      { title: "Life Insurance · i-Sure" },
      { name: "description", content: "Manage life insurance data and policy operations: import data, manage records and create new entries." },
      { property: "og:title", content: "Life Insurance · i-Sure" },
      { property: "og:description", content: "Import, manage and create life insurance policy records." },
    ],
  }),
  component: LifeInsurance,
});

const ACTIONS = [
  { to: "/life-insurance/import", key: "import-data", title: "Import Data", copy: "Upload CSV, Excel or JSON policy files.", icon: Upload },
  { to: "/life-insurance/manage", key: "manage-data", title: "Manage Data", copy: "Search, filter and update existing policies.", icon: Database },
  { to: "/life-insurance/new", key: "new-data-entry", title: "New Data Entry", copy: "Create a new life insurance record.", icon: FilePlus2 },
];

function LifeInsurance() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Life Insurance"
        description="Manage life insurance data and policy operations."
      />
      <LifeTabs />
      <div className="grid gap-4 md:grid-cols-3">
        {ACTIONS.map((a) => (
          <Link
            key={a.key}
            to={a.to}
            data-action={a.key}
            className="group rounded-lg border border-border bg-card p-6 shadow-card transition-all hover:border-primary/40 hover:shadow-card"
          >
            <div className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
              <a.icon className="size-5" />
            </div>
            <p className="mt-4 text-base font-semibold">{a.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{a.copy}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active policies", value: "7,412" },
          { label: "Pending review", value: "9" },
          { label: "Premium collected (Sep)", value: "₹ 4.2 Cr" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
