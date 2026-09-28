import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Pencil, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { LifeTabs } from "@/components/common/LifeTabs";
import { Button } from "@/components/ui/button";
import { mockPolicies } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/life-insurance/manage")({
  head: () => ({
    meta: [
      { title: "Manage Data · Life Insurance" },
      { name: "description", content: "Search, filter, sort and update life insurance policy records with premium and status details." },
      { property: "og:title", content: "Manage Data · Life Insurance" },
      { property: "og:description", content: "Policy management table with search, filters and pagination." },
    ],
  }),
  component: ManageData,
});

const STATUSES = ["All", "Active", "Pending", "Under Review", "Lapsed"] as const;
const PAGE_SIZE = 6;

const statusClass: Record<string, string> = {
  Active: "bg-success-soft text-success",
  Pending: "bg-warning-soft text-warning",
  "Under Review": "bg-primary-soft text-primary",
  Lapsed: "bg-destructive/10 text-destructive",
};

function ManageData() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const filtered = mockPolicies
      .filter((p) => (status === "All" ? true : p.status === status))
      .filter((p) =>
        `${p.id} ${p.customer} ${p.type}`.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => (asc ? a.premium - b.premium : b.premium - a.premium));
    return filtered;
  }, [query, status, asc]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const view = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Manage Data" description="Search and maintain existing life insurance policy records." />
      <LifeTabs />

      <div className="mb-4 flex flex-wrap items-center gap-2" data-action="manage-data">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search className="size-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search policy or customer"
            className="w-56 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(0);
              }}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                status === s ? "border-primary bg-primary-soft text-primary" : "border-border bg-card hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setAsc((v) => !v)}>
          <ArrowUpDown className="size-3.5" /> Premium {asc ? "asc" : "desc"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Policy Number", "Customer", "Policy Type", "Premium", "Status", "Last Updated", "Actions"].map(
                  (h) => (
                    <th key={h} className="px-5 py-2.5 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {view.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3 font-mono text-xs">{p.id}</td>
                  <td className="px-5 py-3 font-medium">{p.customer}</td>
                  <td className="px-5 py-3">{p.type}</td>
                  <td className="px-5 py-3">₹ {p.premium.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusClass[p.status])}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.updated}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil className="size-3.5" />
                      </button>
                      <button className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            {rows.length} records · page {page + 1} of {pages}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
