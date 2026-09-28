import { useState } from "react";
import { Play, Loader as Loader2, Sparkles } from "lucide-react";
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
        <Button size="sm" variant="outline" data-action="demo-mode" className="bg-ai-soft border-ai-label/20 text-ai-label hover:bg-ai-soft/70 hover:text-ai-label">
          <Sparkles className="size-3.5" />
          Try AI Demo
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">AI Demo</p>
          <p className="text-xs text-muted-foreground">Choose a scenario:</p>
        </div>
        <ol className="py-1">
          {SCENARIOS.map((s, i) => (
            <li key={s.key}>
              <button
                onClick={() => setSelected(s.key)}
                className={cn(
                  "flex w-full items-center gap-3 border-l-2 px-4 py-2 text-left text-sm transition-colors",
                  selected === s.key
                    ? "border-l-primary bg-primary-soft font-medium text-accent-foreground"
                    : "border-l-transparent hover:bg-muted",
                )}
              >
                <span className="w-4 text-xs text-muted-foreground">{i + 1}.</span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {active.description} <span className="italic">“{active.prompt}”</span>
          </p>
          <Button
            size="sm"
            className="mt-3 w-full"
            disabled={running !== null}
            onClick={() => runScenario(selected)}
          >
            {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-3.5" />}
            {running ? "Running demo…" : "Run Demo"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
