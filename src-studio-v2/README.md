# `src-studio-v2/` — Studio 2.0 snapshot (parked, not wired)

> **This folder is NOT part of the running Base44 app.**
> It is a verbatim snapshot of [`yanivorion/studio-heuristics-manager`](https://github.com/yanivorion/studio-heuristics-manager) committed `2026-05-03`, parked here as a reference for the upcoming port.

## What's here

A copy of the `studio-heuristics-manager` `src/` tree as it stood on `main` at commit [`232e951`](https://github.com/yanivorion/studio-heuristics-manager/commit/232e951) — the latest local-IDE iteration of the Heuristics rule editor, including:

- The **redesigned Add Rule Wizard** (`components/AddRuleWizard.jsx`, +1.8k lines), with multi-select conditions, expanded WHEN/IN/IF/THEN schema and parameter formatting.
- New wizard primitives: `ConditionConfigurator`, `WizardDiagram`, `WizardIcons`, `WizardPreview`.
- New **feedback flows** (TypeScript): `feedback/ReportHeuristicBugWizard.tsx`, `feedback/RequestHeuristicWizard.tsx`, `feedback/feedbackWizardShared.tsx`.
- **`ElementMock`** redesign and an expanded `addRuleWizardConfig.js`.
- Pure-CSS styling in `styles/app.css` (~4.7k lines, custom design system, no Tailwind).

## Why this is not yet active

The Base44 app and the Studio iteration are built on different stacks:

| Layer | Base44 app (this repo, `src/`) | Studio snapshot (`src-studio-v2/`) |
|---|---|---|
| Data | `@base44/sdk` → `Heuristic` entity | `supabase-js` → `heuristics` table |
| UI primitives | shadcn/Radix + Tailwind | Pure custom CSS |
| Auth | `AuthContext` + `ProtectedRoute` | None |

A direct merge of `src-studio-v2/` over `src/` would break the live Base44 app. This snapshot exists so the upcoming port has a single source of truth to read from.

## How the port will work

Tracked on a separate feature branch (`feat/studio-v2-wizard`):

1. Re-implement the new wizard pieces using the existing shadcn/Radix primitives in `src/components/ui/*`.
2. Rewire data calls from `supabase.from(...)` → `base44Client.entities.Heuristic.*`.
3. Add a feature flag so the new wizard runs alongside Mayan's existing wizard (opt-in), so the live UX is not disrupted on day one.
4. Open a separate PR for that branch and merge once verified.

## What you should NOT do

- **Do not** import anything from `src-studio-v2/` into `src/`.
- **Do not** add `src-studio-v2/` to the build pipeline (it is not picked up by Vite by default — it lives outside the build entry point's import graph and uses Supabase env vars that are not configured here).
- **Do not** delete this folder until the port lands and you've verified parity.

## Provenance

| Field | Value |
|---|---|
| Source repo | `yanivorion/studio-heuristics-manager` |
| Source commit | `232e951` |
| Source branch | `main` |
| Snapshot date | 2026-05-03 |
| Brought in by | carry-over PR from branch `studio-snapshot-2026-05-03` |
