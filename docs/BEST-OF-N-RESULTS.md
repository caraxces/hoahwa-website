# Best-of-N Results — Hoahwa WIRO Layout MVP

## Runs

| Model | Worktree | Status |
|-------|----------|--------|
| composer-2.5-fast | `~/.cursor/worktrees/hoahwa-wiro-composer-*/hoahwa-*` | Parallel runner |
| gpt-5.3-codex | `~/.cursor/worktrees/hoahwa-wiro-codex-*/hoahwa-*` | Parallel runner |
| claude-4.6-sonnet-medium-thinking | `~/.cursor/worktrees/hoahwa-wiro-sonnet-*/hoahwa-*` | Parallel runner |
| **Coordinator (hoahwa-website)** | `/Users/maitruc/Documents/hoahwa-website` | **Selected winner** |

## Winner: `hoahwa-website` (coordinator delivery)

### Rubric

| Criterion | Result |
|-----------|--------|
| Build pass + 5 MVP routes | Pass (`pnpm build`) |
| Mega-menu drill-down | Pass (Audit/Build/Growth + Back) |
| Homepage 10 sections order | Pass |
| Swiper + dual testimonial marquee | Pass |
| `content/navigation.ts` structure | Pass |
| Basic a11y (dialog, aria-expanded, Escape) | Pass |
| Visual smoke screenshots | Pass (`/tmp/hoahwa-wiro-*.png`) |

### Apply

Implementation lives on **main** at `~/Documents/hoahwa-website` — no `apply-worktree` cherry-pick required.

## Cleanup

Optional removal of parallel worktrees after confirming subagent runs:

```bash
git worktree list
git worktree remove <path>
```
