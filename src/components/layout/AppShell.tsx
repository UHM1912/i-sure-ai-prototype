import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  FileText,
  HandCoins,
  RefreshCw,
  ClipboardList,
  Users,
  Bell,
  Bot,
  Briefcase,
  ChevronLeft,
  Home,
  Layers,
  LifeBuoy,
  Search,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AssistantPanel } from "@/components/ai/AssistantPanel";
import { HighlightOverlay } from "@/components/ai/HighlightOverlay";
import { StatusPill } from "@/components/ai/StatusPill";
import { DemoMenu } from "@/components/ai/DemoMenu";
import { useAI } from "@/lib/ai-engine";

const NAV = [
  { to: "/", label: "Dashboard", icon: Home, key: "nav-home" },
  { to: "/modules/clients", label: "Clients", icon: Users, key: "nav-clients" },
  { to: "/life-insurance", label: "Life Insurance", icon: LifeBuoy, key: "nav-life-insurance" },
  { to: "/general-insurance", label: "General Insurance", icon: Shield, key: "nav-general-insurance" },
  { to: "/investments", label: "Investments", icon: TrendingUp, key: "nav-investments" },
  { to: "/modules/policies", label: "Policies", icon: FileText, key: "nav-policies" },
  { to: "/modules/claims", label: "Claims", icon: ClipboardList, key: "nav-claims" },
  { to: "/modules/renewals", label: "Renewals", icon: RefreshCw, key: "nav-renewals" },
  { to: "/modules/commissions", label: "Commissions", icon: HandCoins, key: "nav-commissions" },
  { to: "/modules/analytics", label: "Analytics", icon: BarChart3, key: "nav-analytics" },
  { to: "/common", label: "Common", icon: Layers, key: "nav-common" },
] as const;

const AI_NAV = [
  { to: "/ai-automation", label: "AI Automation", icon: Bot, key: "nav-ai-automation" },
  { to: "/activity", label: "Activity / History", icon: Activity, key: "nav-activity" },
] as const;

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/life-insurance": "Life Insurance",
  "/life-insurance/import": "Life Insurance · Import Data",
  "/life-insurance/manage": "Life Insurance · Manage Data",
  "/life-insurance/new": "Life Insurance · New Data Entry",
  "/general-insurance": "General Insurance",
  "/investments": "Investments",
  "/common": "Common",
  "/ai-automation": "AI Automation",
  "/activity": "Activity / History",
  "/settings": "Settings",
  "/modules/clients": "Clients",
  "/modules/policies": "Policies",
  "/modules/claims": "Claims",
  "/modules/renewals": "Renewals",
  "/modules/commissions": "Commissions",
  "/modules/analytics": "Analytics",
};

function NavItem({
  to,
  label,
  icon: Icon,
  dataKey,
  collapsed,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  dataKey: string;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      data-action={dataKey}
      className={cn(
        "flex items-center gap-3 rounded-md border-l-2 px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-l-sidebar-primary bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "border-l-transparent text-sidebar-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { setOpen } = useAI();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const title = TITLES[path] ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div className="flex items-center gap-2.5 px-4 py-5">
          <div className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            i
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                i-Sure
              </p>
              <p className="truncate text-[11px] text-sidebar-foreground/70">Insurance Management Platform</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {NAV.map((n) => (
            <NavItem
              key={n.to}
              to={n.to}
              label={n.label}
              icon={n.icon}
              dataKey={n.key}
              collapsed={collapsed}
              active={path === n.to || path.startsWith(n.to + "/")}
            />
          ))}

          <p
            className={cn(
              "px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50",
              collapsed && "text-center",
            )}
          >
            {collapsed ? "AI" : "i-Sure AI"}
          </p>
          <button
            data-action="nav-ai-assistant"
            onClick={() => setOpen(true)}
            className="flex w-full items-center gap-3 rounded-md border-l-2 border-l-transparent px-3 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Sparkles className="size-4 shrink-0" />
            {!collapsed && <span>AI Assistant</span>}
          </button>
          {AI_NAV.map((n) => (
            <NavItem
              key={n.to}
              to={n.to}
              label={n.label}
              icon={n.icon}
              dataKey={n.key}
              collapsed={collapsed}
              active={path === n.to}
            />
          ))}
        </nav>

        <div className="space-y-1 border-t border-sidebar-border p-3">
          <NavItem
            to="/settings"
            label="Settings"
            icon={Settings}
            dataKey="nav-settings"
            collapsed={collapsed}
            active={path === "/settings"}
          />
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-muted"
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-card px-4 py-2.5 md:px-8">
          <div className="min-w-0 flex-1">
            <p className="hidden text-xs text-muted-foreground sm:block">
              i-Sure <span className="mx-1">/</span> {title.replace(" · ", " / ")}
            </p>
            <p className="truncate text-sm font-semibold">{title.split(" · ").pop()}</p>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 lg:flex">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              placeholder="Search policies, customers, modules"
              className="w-56 bg-transparent text-sm outline-none"
            />
          </div>
          <button className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted">
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
          </button>
          <StatusPill className="hidden sm:inline-flex" />
          <DemoMenu />
          <div className="flex items-center gap-2 py-1 pl-1 pr-1">
            <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              AK
            </span>
            <span className="hidden text-xs font-medium sm:block">Anil Kulkarni</span>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-4 py-2 md:hidden">
          {[...NAV, ...AI_NAV].map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-xs",
                path === n.to ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>

        <footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground md:px-8">
          <span className="inline-flex items-center gap-2">
            <Briefcase className="size-3.5" />
            Prototype · simulated AI behaviour and mock data. User confirmation required for
            critical actions.
          </span>
        </footer>
      </div>

      <HighlightOverlay />
      <AssistantPanel />
    </div>
  );
}
