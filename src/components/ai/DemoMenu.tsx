import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { SCENARIOS, useAI, type ScenarioKey } from "@/lib/ai-engine";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DemoMenu() {
  const { runScenario, running } = useAI();
  const [selected, setSelected] = useState<ScenarioKey>("full");
  const active = SCENARIOS.find((s) => s.key === selected)!;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" data-action="demo-mode">
          <Play className="size-3.5" /> Try AI Demo
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <p className="text-sm font-semibold">Demo Scenario</p>
        <p className="text-xs text-muted-foreground">
          Run a predefined scenario to see the AI layer in action.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSelected(s.key)}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-left text-xs transition-colors",
                selected === s.key
                  ? "border-primary bg-primary-soft text-accent-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          {active.description}
          <span className="mt-1 block italic">“{active.prompt}”</span>
        </p>
        <Button
          className="mt-3 w-full"
          disabled={running !== null}
          onClick={() => runScenario(selected)}
        >
          {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
          {running ? "Running demo…" : "Run Demo"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
