# CLAUDE.md — sowa-storefront

This file is loaded automatically by Claude Code as shared project context.
It encodes team conventions, stack decisions, and patterns so every agent session starts with the same foundation.

> **Need help with Claude Code itself?** Use the `claude-code-guide` agent — it covers CLI usage,
> skills, hooks, MCP servers, and the Agent SDK. This file only covers what's specific to this repo.

---

## What This Repo Is

A forkable playground where team members validate ideas by building custom components,
backed by shared knowledge about React, TypeScript, and design patterns.

Three purposes:
1. **Component playground** — fork, add a demo route, build and share your component
2. **Pattern library** — reusable hooks and utilities that encode team conventions
3. **Knowledge base** — raw materials, distilled conventions, and agent-ready skills that grow over time

---

## Knowledge Architecture

Knowledge flows in one direction: raw materials get distilled into conventions and a shared skill.

```
materials/                    ← raw knowledge artifacts
  <group>/                    ← category (e.g. patterns, advanced-react-api)
    <item>/                   ← one concept per folder
      *.tsx / *.ts            ← code examples
      docs.md                 ← written explanation, references, timestamps
      *.vtt / transcript.md   ← video subtitles or transcripts (optional)

        ↓  human curation + discussion

CLAUDE.md                     ← distilled conventions (opinionated, repo-specific)
.claude/skills/react-epic.md  ← single agent-ready skill compiled from all materials
src/hooks/                    ← conventions expressed in code
```

**Example structure:**
```
materials/
  patterns/
    control-props/            ← Kent C. Dodds — useToggle, Switch
    props-collection-and-getter/
    compound-component/
  advanced-react-api/
    sync-external-state/
```

**Materials** answer "how does this pattern work?" — each item is self-contained with whatever
artifacts explain it best (code, prose, video transcript).
**`react-epic` skill** is the distilled, agent-ready output compiled from all materials — one skill,
not one per pattern.

When a team member asks "why does `useControllableReducer` expose `stateReducer`?" — point them to
`materials/patterns/control-props/`. That is where the reasoning lives in its original form.

---

## Stack

| Tool | Version | Why |
|------|---------|-----|
| React | 19 | `use()`, server-ready, latest concurrent features |
| TypeScript | ~5.6 | strict mode, no shortcuts |
| Vite + SWC | 6 | fast DX |
| TanStack Router | v1 | file-based routing, type-safe |
| TanStack Query | v5 | server state, caching |
| Tailwind CSS | v4 | utility-first, co-located styles |
| shadcn/radix | latest | accessible primitives, not a locked-in component lib |
| CVA | 0.7 | variant management |
| react-hook-form + zod | latest | form state + validation |
| react-intl | v7 | i18n |

---

## Folder Conventions

```
materials/                    # Raw knowledge artifacts
  <group>/                    # Category — e.g. patterns, advanced-react-api
    <item>/                   # One concept — code examples, docs.md, transcripts as needed

.claude/
  skills/
    react-epic.md             # Single compiled skill distilled from all materials

src/
  components/                 # Custom components (each in its own folder)
    <name>/
      <Name>.tsx              # Main component file (compound component root)
      index.ts                # Public API — only export what consumers need
      Portal.tsx              # If the component uses a portal
      type.ts                 # Shared types for this component
      hooks/                  # Component-scoped hooks
  features/                   # Feature modules (page-level compositions)
  routes/                     # TanStack Router file-based routes
    demo/                     # Demo routes — one per component
      <name>.tsx              # Demo page for /demo/<name>
    __root.tsx
    index.tsx
  hooks/                      # Global reusable hooks
  lib/                        # Utilities (cn, callAll, etc.)
```

**Rules:**
- `index.ts` is the only public surface of a component — never import from internal files
- Demo routes live at `src/routes/demo/<name>.tsx` → URL `/demo/<name>`
- Hooks scoped to one component go in `components/<name>/hooks/`, not `src/hooks/`
- `materials/` is read-only reference — add context in `docs/`, not inline edits

---

## Component Pattern: Compound Component

All non-trivial components follow the compound component pattern.

```tsx
<BottomSheet>
  <BottomSheet.Trigger />
  <BottomSheet.Portal>
    <BottomSheet.Content />
  </BottomSheet.Portal>
</BottomSheet>
```

- Root component owns state and provides a context
- Sub-components consume context via a `use<Name>()` hook
- The hook throws if used outside the root — explicit error over silent failure
- Export sub-components as named exports, not as `Root.Sub` (easier to tree-shake and re-export)

---

## Pattern: Controlled / Uncontrolled + State Reducer

Every component that owns open/closed or value state must support both controlled and uncontrolled modes.
Two foundation hooks live in `src/hooks/` — never re-implement this logic in a component.

**Source material:** `materials/patterns/control-props/` (Kent C. Dodds)

**`useControllableReducer`** — for components with named action types and complex transitions:
```ts
import { useControllableReducer } from '@/hooks/use-controllable'

const [state, dispatch] = useControllableReducer({
  reducer: myReducer,        // component's default transitions
  stateReducer,              // consumer override — inversion of control
  initialValue: { open: false },
  value,                     // providing this makes it controlled
  onChange,                  // fires (nextState, action) in both modes
})
```

**`useControllableState`** — for simple single-value state with no named actions:
```ts
import { useControllableState } from '@/hooks/use-controllable'

const [open, setOpen] = useControllableState({
  initialValue: false,
  value: props.open,
  onChange: props.onOpenChange,
})
```

**`callAll`** — composes event handlers without conflict (`src/lib/utils.ts`):
```ts
<button onClick={callAll(props.onClick, internalHandler)} />
```

Rules:
- Use `useControllableState` for simple value state
- Use `useControllableReducer` when there are multiple action types or reset support
- Expose `stateReducer` as a prop on any component using `useControllableReducer`
- `onChange` always fires in both controlled and uncontrolled mode

---

## Naming Conventions

- Component files: PascalCase (`BottomSheet.tsx`)
- Hook files: kebab-case prefixed with `use` (`use-controllable.ts`)
- Route files: kebab-case (`bottom-sheet.tsx`)
- CSS: Tailwind utilities only — no CSS modules, no inline style objects
- Exports: named exports only, no default exports

---

## How to Add a New Component

1. Create `src/components/<name>/` with `<Name>.tsx`, `index.ts`, `type.ts`
2. Build the compound component using the patterns above
3. Add a demo route at `src/routes/demo/<name>.tsx`
4. Register the demo in the `DEMOS` array in `src/routes/demo.tsx`
5. Export only the public API from `index.ts`
6. Update `tasks.md` if this was a planned task

## How to Contribute a Material

1. Create `materials/<group>/<item>/` — group by category, item by concept
2. Add whatever artifacts explain it best: code examples, `docs.md`, video transcript
3. Discuss what to distill; update `CLAUDE.md` with the team convention
4. Update `.claude/skills/react-epic.md` with the agent-ready output

---

## Key Files

| File | Purpose |
|------|---------|
| `tasks.md` | Roadmap and task status — update as work progresses |
| `materials/patterns/control-props/` | Source material for the control props pattern |
| `src/hooks/use-controllable.ts` | Foundation hooks — `useControllableReducer` + `useControllableState` |
| `src/components/bottom-sheet/` | Reference compound component implementation |
| `src/lib/utils.ts` | Shared utilities — `cn`, `callAll` |
| `vite.config.ts` | Path alias `@` → `src/` |
