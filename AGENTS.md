<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Simulated AI behaviour (intent parsing, action steps, highlighting, demo scenarios, activity log) lives in `src/lib/ai-engine.tsx` and is consumed via `useAI()`; UI elements the AI targets are marked with `data-action="<key>"` so the highlight overlay can locate them. Keeps the demo logic in one place instead of scattered per-page state.
