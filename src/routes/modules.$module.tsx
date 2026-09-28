import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockPolicies } from "@/data/mock";

const MODULES: Record<string, { title: string; description: string; column: string }> = {
  clients: { title: "Clients", description: "Client master records and relationship details.", column: "Relationship Manager" },
  policies: { title: "Policies", description: "All policies across life and general insurance.", column: "Line of Business" },
  claims: { title: "Claims", description: "Claim intimations, documents and settlement status.", column: "Claim Stage" },
  renewals: { title: "Renewals", description: "Upcoming renewals and follow-ups due.", column: "Renewal Due" },
  commissions: { title: "Commissions", description: "Commission statements and payout tracking.", column: "Payout" },
  analytics: { title: "Analytics", description: "Business performance and portfolio reports.", column: "Segment" },
};

const EXTRA = ["Sunil Rao", "Health", "Survey pending", "15 Oct 2026", "₹ 4,820", "Retail"];

export const Route = createFileRoute("/modules/$module")({
  loader: ({ params }) => {
    const m = MODULES[params.module];
    if (!m) throw notFound();
    return m;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Module"} · i-Sure` },
      { name: "description", content: loaderData?.description ?? "i-Sure module" },
      { property: "og:title", content: `${loaderData?.title ?? "Module"} · i-Sure` },
      { property: "og:description", content: loaderData?.description ?? "i-Sure module" },
    ],
  }),
  component: ModulePage,
});

function ModulePage() {
  const m = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title={m.title} description={m.description} />
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Reference</th>
              <th className="px-4 py-2 font-medium">Client</th>
              <th className="px-4 py-2 font-medium">{m.column}</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockPolicies.slice(0, 8).map((p, i) => (
              <tr key={p.id} className="hover:bg-muted/50">
                <td className="px-4 py-2 font-medium">{p.id}</td>
                <td className="px-4 py-2">{p.customer}</td>
                <td className="px-4 py-2 text-muted-foreground">{EXTRA[i % EXTRA.length]}</td>
                <td className="px-4 py-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
