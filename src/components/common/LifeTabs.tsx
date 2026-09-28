import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/life-insurance", label: "Overview" },
  { to: "/life-insurance/import", label: "Import Data" },
  { to: "/life-insurance/manage", label: "Manage Data" },
  { to: "/life-insurance/new", label: "New Data Entry" },
] as const;

export function LifeTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
      {TABS.map((t) => {
        const active = path === t.to || (t.to === "/life-insurance" && path === "/life-insurance/");
        return (
          <Link
            key={t.to}
            to={t.to}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm transition-colors",
              active
                ? "border-primary font-medium text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
