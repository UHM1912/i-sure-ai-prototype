import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { LifeTabs } from "@/components/common/LifeTabs";
import { Button } from "@/components/ui/button";
import { useAI } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/life-insurance/new")({
  head: () => ({
    meta: [
      { title: "New Data Entry · Life Insurance" },
      { name: "description", content: "Create a new life insurance record with customer, policy, premium and coverage details." },
      { property: "og:title", content: "New Data Entry · Life Insurance" },
      { property: "og:description", content: "Guided form for creating a new life insurance policy record." },
    ],
  }),
  component: NewDataEntry,
});

function NewDataEntry() {
  const { formFocus } = useAI();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer: "",
    policy: "LIC-2026-00134",
    type: "Term Life",
    premium: "",
    coverage: "",
    start: "2026-10-01",
    status: "Active",
  });

  const field = (
    label: string,
    key: keyof typeof form,
    props: { type?: string; options?: string[]; focusKey?: string } = {},
  ) => {
    const focused = props.focusKey && formFocus === props.focusKey;
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{label}</label>
        {props.options ? (
          <select
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
          >
            {props.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            data-action={props.focusKey}
            type={props.type ?? "text"}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className={cn(
              "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring/20",
              focused && "border-primary ring-2 ring-ring/25",
            )}
          />
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New Data Entry" description="Create a new life insurance policy record." />
      <LifeTabs />

      {formFocus && (
        <div className="mb-4 flex items-start gap-2.5 rounded-md border border-border border-l-2 border-l-primary bg-card px-4 py-2.5">
          <Sparkles className="mt-0.5 size-4 text-primary" />
          <div>
            <p className="text-sm font-medium">AI Guidance</p>
            <p className="text-xs text-muted-foreground">AI is guiding you through this step — start with Customer Name.</p>
          </div>
        </div>
      )}

      <form
        className="rounded-lg border border-border bg-card p-6 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Record saved", { description: `${form.policy} is ready for review.` });
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {field("Customer Name", "customer", { focusKey: "customer-name" })}
          {field("Policy Number", "policy")}
          {field("Policy Type", "type", { options: ["Term Life", "Endowment", "Whole Life", "ULIP", "Money Back"] })}
          {field("Premium (₹)", "premium", { type: "number" })}
          {field("Coverage Amount (₹)", "coverage", { type: "number" })}
          {field("Start Date", "start", { type: "date" })}
          {field("Policy Status", "status", { options: ["Active", "Pending", "Under Review"] })}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/life-insurance" })}>
            Cancel
          </Button>
          <Button type="submit" data-action="save-record">
            Save Record
          </Button>
        </div>
      </form>
    </div>
  );
}
