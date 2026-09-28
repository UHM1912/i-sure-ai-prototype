import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@tanstack/react-router";

export type AIStatus = "ready" | "working" | "acting" | "complete" | "vision" | "error";

export type StepState = "pending" | "active" | "done" | "fail";

export type ActionStep = { label: string; state: StepState };

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  steps?: ActionStep[];
  error?: boolean;
  spoken?: boolean;
};

export type LogEntry = { time: string; label: string; value: string; tone?: "ok" | "warn" | "fail" };

export type Intent = {
  intent: string;
  module: string;
  target: string;
  action: string;
  confidence: number;
  detectionMethod: "DOM" | "VISION";
  route: string;
  targetKey: string;
  targetLabel: string;
  reply: string;
  selector: string;
  vision?: boolean;
  critical?: boolean;
};

export const ROUTES = {
  HOME: "/",
  LIFE_INSURANCE: "/life-insurance",
  IMPORT_DATA: "/life-insurance/import",
  MANAGE_DATA: "/life-insurance/manage",
  NEW_DATA_ENTRY: "/life-insurance/new",
  GENERAL_INSURANCE: "/general-insurance",
  INVESTMENTS: "/investments",
  AI_AUTOMATION: "/ai-automation",
  ACTIVITY: "/activity",
} as const;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const stamp = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const uid = () => Math.random().toString(36).slice(2, 10);

const INTENTS: Array<{ match: RegExp; build: () => Intent }> = [
  {
    match: /(create|new|add).*(record|entry|policy|customer)|new data entry|data entry form/i,
    build: () => ({
      intent: "CREATE_RECORD",
      module: "LIFE_INSURANCE",
      target: "NEW_DATA_ENTRY",
      action: "NAVIGATE",
      confidence: 0.96,
      detectionMethod: "DOM",
      route: ROUTES.NEW_DATA_ENTRY,
      targetKey: "new-data-entry",
      targetLabel: "New Data Entry",
      selector: '[data-action="new-data-entry"]',
      reply: "Sure. I found the Life Insurance module — opening the New Data Entry form.",
      critical: false,
    }),
  },
  {
    match: /import|upload|recent imports/i,
    build: () => ({
      intent: "FIND_ELEMENT",
      module: "LIFE_INSURANCE",
      target: "IMPORT_DATA",
      action: "HIGHLIGHT",
      confidence: 0.94,
      detectionMethod: "DOM",
      route: ROUTES.IMPORT_DATA,
      targetKey: "import-data",
      targetLabel: "Import Data",
      selector: '[data-action="import-data"]',
      reply: "I found the Import Data section. Follow the highlighted control.",
    }),
  },
  {
    match: /manage|policy management|update policy|existing polic|records table/i,
    build: () => ({
      intent: "NAVIGATE",
      module: "LIFE_INSURANCE",
      target: "MANAGE_DATA",
      action: "NAVIGATE",
      confidence: 0.93,
      detectionMethod: "DOM",
      route: ROUTES.MANAGE_DATA,
      targetKey: "manage-data",
      targetLabel: "Manage Data",
      selector: '[data-action="manage-data"]',
      reply: "Opening policy management — Life Insurance → Manage Data.",
    }),
  },
  {
    match: /general insurance|motor|health insurance|property|travel/i,
    build: () => ({
      intent: "NAVIGATE",
      module: "GENERAL_INSURANCE",
      target: "GENERAL_INSURANCE",
      action: "NAVIGATE",
      confidence: 0.92,
      detectionMethod: "DOM",
      route: ROUTES.GENERAL_INSURANCE,
      targetKey: "nav-general-insurance",
      targetLabel: "General Insurance",
      selector: '[data-action="nav-general-insurance"]',
      reply: "Taking you to the General Insurance module.",
    }),
  },
  {
    match: /investment|portfolio|fund|nav/i,
    build: () => ({
      intent: "NAVIGATE",
      module: "INVESTMENTS",
      target: "INVESTMENTS",
      action: "NAVIGATE",
      confidence: 0.91,
      detectionMethod: "DOM",
      route: ROUTES.INVESTMENTS,
      targetKey: "nav-investments",
      targetLabel: "Investments",
      selector: '[data-action="nav-investments"]',
      reply: "Opening the Investments module.",
    }),
  },
  {
    match: /activity|log|history|trace/i,
    build: () => ({
      intent: "NAVIGATE",
      module: "COMMON",
      target: "ACTIVITY_LOG",
      action: "NAVIGATE",
      confidence: 0.9,
      detectionMethod: "DOM",
      route: ROUTES.ACTIVITY,
      targetKey: "nav-activity",
      targetLabel: "Activity Log",
      selector: '[data-action="nav-activity"]',
      reply: "Here is the AI activity log with the full execution trace.",
    }),
  },
  {
    match: /automation|capabilit|pipeline|architecture/i,
    build: () => ({
      intent: "NAVIGATE",
      module: "COMMON",
      target: "AI_AUTOMATION",
      action: "NAVIGATE",
      confidence: 0.9,
      detectionMethod: "DOM",
      route: ROUTES.AI_AUTOMATION,
      targetKey: "nav-ai-automation",
      targetLabel: "AI Automation",
      selector: '[data-action="nav-ai-automation"]',
      reply: "Opening the AI Automation command centre.",
    }),
  },
  {
    match: /life insurance/i,
    build: () => ({
      intent: "NAVIGATE",
      module: "LIFE_INSURANCE",
      target: "LIFE_INSURANCE",
      action: "NAVIGATE",
      confidence: 0.95,
      detectionMethod: "DOM",
      route: ROUTES.LIFE_INSURANCE,
      targetKey: "nav-life-insurance",
      targetLabel: "Life Insurance",
      selector: '[data-action="nav-life-insurance"]',
      reply: "Taking you to the Life Insurance module.",
    }),
  },
  {
    match: /dashboard|home|overview|next|what.*do/i,
    build: () => ({
      intent: "NAVIGATE",
      module: "COMMON",
      target: "HOME",
      action: "NAVIGATE",
      confidence: 0.88,
      detectionMethod: "DOM",
      route: ROUTES.HOME,
      targetKey: "nav-home",
      targetLabel: "Home",
      selector: '[data-action="nav-home"]',
      reply: "Here is your operations dashboard with the pending items.",
    }),
  },
];

export function parseIntent(input: string): Intent | null {
  const found = INTENTS.find((i) => i.match.test(input));
  return found ? found.build() : null;
}

export type Highlight = { key: string; label: string; method: "DOM" | "VISION" } | null;

type AIContextValue = {
  status: AIStatus;
  open: boolean;
  setOpen: (v: boolean) => void;
  messages: ChatMessage[];
  steps: ActionStep[];
  logs: LogEntry[];
  highlight: Highlight;
  clearHighlight: () => void;
  listening: boolean;
  thinking: boolean;
  lastIntent: Intent | null;
  domTrace: { stage: string; done: boolean }[];
  confirm: { intent: Intent; label: string } | null;
  resolveConfirm: (allow: boolean) => void;
  submit: (text: string, opts?: { forceVision?: boolean; confirmFirst?: boolean }) => Promise<void>;
  simulateVoice: (text?: string) => Promise<void>;
  runScenario: (key: ScenarioKey) => Promise<void>;
  running: ScenarioKey | null;
  formFocus: string | null;
};

const AIContext = createContext<AIContextValue | null>(null);

export type ScenarioKey =
  | "navigation"
  | "element"
  | "browser"
  | "voice"
  | "vision"
  | "full";

export const SCENARIOS: { key: ScenarioKey; label: string; prompt: string; description: string }[] = [
  { key: "navigation", label: "Navigation", prompt: "Take me to Life Insurance.", description: "AI understands intent and navigates the app." },
  { key: "element", label: "Element Finding", prompt: "Where can I import insurance data?", description: "AI locates and highlights a control on screen." },
  { key: "browser", label: "Browser Action", prompt: "Open the new data entry form.", description: "Simulated Playwright locate, move, click." },
  { key: "voice", label: "Voice", prompt: "Show me the policy management screen.", description: "Voice input, transcription and spoken reply." },
  { key: "vision", label: "Vision Fallback", prompt: "Where can I import insurance data?", description: "DOM detection fails, vision takes over." },
  { key: "full", label: "Full Workflow", prompt: "Create a new life insurance record.", description: "End-to-end request to guided form entry." },
];

export function AIProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AIStatus>("ready");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [steps, setSteps] = useState<ActionStep[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [highlight, setHighlight] = useState<Highlight>(null);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lastIntent, setLastIntent] = useState<Intent | null>(null);
  const [domTrace, setDomTrace] = useState<{ stage: string; done: boolean }[]>([]);
  const [running, setRunning] = useState<ScenarioKey | null>(null);
  const [formFocus, setFormFocus] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ intent: Intent; label: string } | null>(null);
  const confirmResolver = useRef<((v: boolean) => void) | null>(null);

  const log = useCallback((label: string, value: string, tone?: LogEntry["tone"]) => {
    setLogs((l) => [{ time: stamp(), label, value, tone }, ...l].slice(0, 120));
  }, []);

  const pushMessage = useCallback((m: Omit<ChatMessage, "id">) => {
    const id = uid();
    setMessages((prev) => [...prev, { ...m, id }]);
    return id;
  }, []);

  const updateSteps = useCallback((next: ActionStep[]) => setSteps(next), []);

  const resolveConfirm = useCallback((allow: boolean) => {
    setConfirm(null);
    confirmResolver.current?.(allow);
    confirmResolver.current = null;
  }, []);

  const askConfirm = useCallback(
    (intent: Intent, label: string) =>
      new Promise<boolean>((resolve) => {
        confirmResolver.current = resolve;
        setConfirm({ intent, label });
      }),
    [],
  );

  const runIntent = useCallback(
    async (intent: Intent, opts: { forceVision?: boolean; confirmFirst?: boolean } = {}) => {
      const useVision = opts.forceVision ?? intent.vision ?? false;
      setLastIntent({ ...intent, detectionMethod: useVision ? "VISION" : "DOM" });
      setThinking(true);
      setStatus("working");
      setHighlight(null);
      setFormFocus(null);
      setDomTrace([]);
      log("User requested", `"${intent.reply ? intent.target : intent.target}"`);
      log("Intent", intent.intent);
      log("Module", intent.module);

      const flow: ActionStep[] = [
        { label: "Understanding request", state: "active" },
        { label: `Identifying module: ${intent.module.replace("_", " ")}`, state: "pending" },
        { label: useVision ? "DOM element search" : "Finding target element", state: "pending" },
        { label: "Executing action", state: "pending" },
        { label: "Completed", state: "pending" },
      ];
      updateSteps(flow);
      await sleep(700);

      flow[0].state = "done";
      flow[1].state = "active";
      updateSteps([...flow]);
      setDomTrace([{ stage: "User intent", done: true }]);
      await sleep(600);

      flow[1].state = "done";
      flow[2].state = "active";
      updateSteps([...flow]);
      setDomTrace((t) => [...t, { stage: "Page understanding", done: true }]);
      await sleep(500);
      setDomTrace((t) => [...t, { stage: "DOM element matching", done: !useVision }]);
      await sleep(400);

      if (useVision) {
        setStatus("vision");
        flow[2].state = "fail";
        updateSteps([...flow]);
        pushMessage({
          role: "ai",
          text: "I couldn't identify the target from the page structure. Switching to vision analysis.",
        });
        log("DOM detection", "UNAVAILABLE", "warn");
        await sleep(600);
        setDomTrace((t) => [
          ...t,
          { stage: "Screenshot captured", done: true },
          { stage: "Visual elements detected", done: true },
        ]);
        await sleep(700);
        log("Vision fallback", "TARGET LOCATED", "ok");
      }

      setDomTrace((t) => [...t, { stage: "Target identified", done: true }]);
      flow[2].state = "done";
      flow[3].state = "active";
      updateSteps([...flow]);
      setStatus("acting");
      log("Target", intent.target);

      if (intent.critical) {
        const allowed = await askConfirm(intent, intent.targetLabel);
        if (!allowed) {
          flow[3].state = "fail";
          updateSteps([...flow]);
          setStatus("error");
          setThinking(false);
          log("Action", "CANCELLED BY USER", "fail");
          pushMessage({ role: "ai", text: "Cancelled. I won't perform that action.", error: true });
          return;
        }
      }

      await sleep(500);
      router.navigate({ to: intent.route });
      log("Action", intent.action);
      setDomTrace((t) => [...t, { stage: "Browser action", done: true }]);
      await sleep(650);

      setHighlight({ key: intent.targetKey, label: intent.targetLabel, method: useVision ? "VISION" : "DOM" });
      flow[3].state = "done";
      flow[4].state = "active";
      updateSteps([...flow]);
      await sleep(600);

      flow[4].state = "done";
      updateSteps([...flow]);
      setStatus("complete");
      setThinking(false);
      log("Status", "SUCCESS", "ok");
      pushMessage({
        role: "ai",
        text: `Done. ${intent.reply}`,
        spoken: true,
      });

      if (intent.target === "NEW_DATA_ENTRY") {
        setFormFocus("customer-name");
        pushMessage({ role: "ai", text: "I've highlighted the Customer Name field to get you started." });
      }

      setTimeout(() => {
        setStatus((s) => (s === "complete" ? "ready" : s));
      }, 3500);
      setTimeout(() => setHighlight(null), 6000);
    },
    [askConfirm, log, pushMessage, router, updateSteps],
  );

  const submit = useCallback(
    async (text: string, opts: { forceVision?: boolean } = {}) => {
      if (!text.trim()) return;
      setOpen(true);
      pushMessage({ role: "user", text });
      const intent = parseIntent(text);
      if (!intent) {
        setStatus("error");
        setSteps([
          { label: "Understanding request", state: "done" },
          { label: "Finding target element", state: "fail" },
        ]);
        log("Status", "TARGET NOT FOUND", "fail");
        pushMessage({
          role: "ai",
          text: "I couldn't complete that action. Target element was not available.",
          error: true,
        });
        return;
      }
      await runIntent(intent, opts);
    },
    [log, pushMessage, runIntent],
  );

  const simulateVoice = useCallback(
    async (text = "Show me the policy management screen.") => {
      setOpen(true);
      setListening(true);
      setStatus("working");
      await sleep(1800);
      setListening(false);
      await submit(text);
    },
    [submit],
  );

  const runScenario = useCallback(
    async (key: ScenarioKey) => {
      const scenario = SCENARIOS.find((s) => s.key === key);
      if (!scenario) return;
      setRunning(key);
      setOpen(true);
      if (key === "voice") {
        await simulateVoice(scenario.prompt);
      } else if (key === "vision") {
        await submit(scenario.prompt, { forceVision: true });
      } else {
        await submit(scenario.prompt);
      }
      setRunning(null);
    },
    [simulateVoice, submit],
  );

  const value = useMemo<AIContextValue>(
    () => ({
      status,
      open,
      setOpen,
      messages,
      steps,
      logs,
      highlight,
      clearHighlight: () => setHighlight(null),
      listening,
      thinking,
      lastIntent,
      domTrace,
      confirm,
      resolveConfirm,
      submit,
      simulateVoice,
      runScenario,
      running,
      formFocus,
    }),
    [
      status,
      open,
      messages,
      steps,
      logs,
      highlight,
      listening,
      thinking,
      lastIntent,
      domTrace,
      confirm,
      resolveConfirm,
      submit,
      simulateVoice,
      runScenario,
      running,
      formFocus,
    ],
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error("useAI must be used inside AIProvider");
  return ctx;
}
