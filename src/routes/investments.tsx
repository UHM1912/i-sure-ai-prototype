import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { investmentProducts, investmentTransactions, portfolioSeries } from "@/data/mock";

export const Route = createFileRoute("/investments")({
  head: () => ({
    meta: [
      { title: "Investments · Aegis Insure" },
      { name: "description", content: "Investment products, portfolio performance and recent customer transactions." },
      { property: "og:title", content: "Investments · Aegis Insure" },
      { property: "og:description", content: "Track fund NAVs, portfolio growth and investment transactions." },
    ],
  }),
  component: Investments,
});

function Investments() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Investments" description="Products, portfolio performance and transactions." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="text-sm font-semibold">Portfolio performance</h2>
          <p className="text-xs text-muted-foreground">Assets under management (₹ hundred crore)</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioSeries}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  fill="url(#fill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold">Investment products</h2>
          <ul className="mt-3 divide-y divide-border">
            {investmentProducts.map((p) => (
              <li key={p.name} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">AUM {p.aum}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{p.nav}</p>
                  <p className={`text-xs ${p.change.startsWith("-") ? "text-destructive" : "text-success"}`}>
                    {p.change}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <h2 className="border-b border-border px-5 py-3 text-sm font-semibold">Recent transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Transaction", "Customer", "Product", "Amount", "Date"].map((h) => (
                  <th key={h} className="px-5 py-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {investmentTransactions.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono text-xs">{t.id}</td>
                  <td className="px-5 py-3 font-medium">{t.customer}</td>
                  <td className="px-5 py-3">{t.product}</td>
                  <td className="px-5 py-3">{t.amount}</td>
                  <td className="px-5 py-3 text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
