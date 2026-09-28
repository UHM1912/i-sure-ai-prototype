import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Aegis Insure" },
      { name: "description", content: "Control how the AI layer behaves: confirmations for critical actions, voice replies and vision fallback." },
      { property: "og:title", content: "Settings · Aegis Insure" },
      { property: "og:description", content: "AI control and governance settings for the insurance workspace." },
    ],
  }),
  component: Settings,
});

const TOGGLES = [
  { label: "User confirmation required for critical actions", detail: "AI must ask before saving, deleting or submitting records.", on: true },
  { label: "Voice responses", detail: "Speak AI confirmations aloud after each action.", on: true },
  { label: "Vision fallback", detail: "Use visual detection when DOM matching fails.", on: true },
  { label: "Automatic navigation", detail: "Allow the AI to move between modules without asking.", on: true },
  { label: "Log every AI action", detail: "Keep a full execution trace for audit.", on: true },
];

function Settings() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" description="AI control, governance and workspace preferences." />
      <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-card">
        {TOGGLES.map((t) => (
          <div key={t.label} className="flex items-center justify-between gap-6 px-5 py-4">
            <div>
              <p className="text-sm font-medium">{t.label}</p>
              <p className="text-xs text-muted-foreground">{t.detail}</p>
            </div>
            <Switch defaultChecked={t.on} />
          </div>
        ))}
      </div>
    </div>
  );
}
