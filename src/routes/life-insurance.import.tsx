import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { recentImports } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/life-insurance/import")({
  head: () => ({
    meta: [
      { title: "Import Data · Life Insurance" },
      { name: "description", content: "Import life insurance policy files in CSV, Excel or JSON and track recent import batches." },
      { property: "og:title", content: "Import Data · Life Insurance" },
      { property: "og:description", content: "Upload and validate policy data files with live import progress." },
    ],
  }),
  component: ImportData,
});

const STAGES = ["Uploading", "Validating", "Processing", "Completed"];

function ImportData() {
  const [stage, setStage] = useState(-1);

  const run = () => {
    setStage(0);
    STAGES.forEach((_, i) => {
      setTimeout(() => {
        setStage(i);
        if (i === STAGES.length - 1) toast.success("Import completed · 1,248 records added");
      }, i * 900);
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Import Data"
        description="Bring policy and customer files into the Life Insurance module."
        actions={
          <Button data-action="import-data" onClick={run}>
            <UploadCloud className="size-4" /> Import Data
          </Button>
        }
      />

      <div className="rounded-lg border-2 border-dashed border-border bg-card p-10 text-center transition-colors hover:border-primary/40">
        <UploadCloud className="mx-auto size-8 text-primary" />
        <p className="mt-3 text-sm font-medium">Drag &amp; drop your file here</p>
        <p className="mt-1 text-xs text-muted-foreground">Supported formats: CSV, Excel, JSON</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={run}>
          Browse files
        </Button>
      </div>

      {stage >= 0 && (
        <div className="mt-4 rounded-lg border border-border bg-card p-5 shadow-card">
          <p className="text-sm font-semibold">life_policy_data.xlsx</p>
          <div className="mt-4 space-y-2">
            {STAGES.map((s, i) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                {i < stage || stage === STAGES.length - 1 ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : i === stage ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : (
                  <span className="size-4 rounded-full border border-border" />
                )}
                <span className={cn(i > stage && "text-muted-foreground")}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <h2 className="border-b border-border px-5 py-3 text-sm font-semibold">Recent imports</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 font-medium">File Name</th>
                <th className="px-5 py-2.5 font-medium">Records</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentImports.map((r) => (
                <tr key={r.file} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3 font-medium">{r.file}</td>
                  <td className="px-5 py-3">{r.records}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        r.status === "Completed"
                          ? "bg-success-soft text-success"
                          : "bg-warning-soft text-warning",
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
