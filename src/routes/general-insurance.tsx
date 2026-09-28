import { createFileRoute } from "@tanstack/react-router";
import { Car, HeartPulse, Home, Plane } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { generalCategories, mockPolicies } from "@/data/mock";

export const Route = createFileRoute("/general-insurance")({
  head: () => ({
    meta: [
      { title: "General Insurance · Aegis Insure" },
      { name: "description", content: "Motor, health, property and travel insurance portfolios with claims and policy counts." },
      { property: "og:title", content: "General Insurance · Aegis Insure" },
      { property: "og:description", content: "Manage motor, health, property and travel insurance portfolios." },
    ],
  }),
  component: GeneralInsurance,
});

const ICONS = [Car, HeartPulse, Home, Plane] as const;

function GeneralInsurance() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="General Insurance" description="Manage non-life portfolios, claims and policy operations." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {generalCategories.map((c, i) => {
          const Icon = ICONS[i];
          return (
            <div
              key={c.name}
              className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-panel"
            >
              <div className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-4" />
              </div>
              <p className="mt-3 text-sm font-semibold">{c.name}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{c.policies}</p>
              <p className="text-xs text-muted-foreground">
                {c.claims} open claims ·{" "}
                <span className={c.growth.startsWith("-") ? "text-destructive" : "text-success"}>{c.growth}</span>
              </p>
            </div>
          );
        })}
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <h2 className="border-b border-border px-5 py-3 text-sm font-semibold">Recent general policies</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Policy Number", "Customer", "Type", "Premium", "Status"].map((h) => (
                  <th key={h} className="px-5 py-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockPolicies
                .filter((p) => p.id.startsWith("GEN"))
                .concat(mockPolicies.slice(0, 3))
                .map((p, i) => (
                  <tr key={`${p.id}-${i}`} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3 font-mono text-xs">{p.id}</td>
                    <td className="px-5 py-3 font-medium">{p.customer}</td>
                    <td className="px-5 py-3">{p.type}</td>
                    <td className="px-5 py-3">₹ {p.premium.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
