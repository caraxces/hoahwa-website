/**
 * Case study 006: Notch Agent Train (internal name "AgentPet") — a notch app that runs an agent train.
 *
 * Public name is "Notch Agent Train" on purpose: an unrelated open-source project
 * (github.com/ntd4996/agentpet) already uses the AgentPet name. Do not conflate them.
 *
 * A self-initiated macOS tool, so like Kể and BloomBound every figure here is
 * counted from the repository rather than quoted: commits from `git log`,
 * Swift lines from `find Sources -name '*.swift' | xargs wc -l`, the number of
 * wagons and task kinds from `pool/agentpool` (`BACKENDS`, `KINDS`), the
 * cooldown default from `pool.py`, and routing from `pool.py` plus the
 * `delegate` skill. No usage, speed or cost-saving figure is claimed because
 * none has been measured.
 *
 * Last measured: 2026-10-28 (63 commits, first 2026-10-26, last 2026-10-27).
 * This page is refreshed weekly through November 2026: re-run the counts above.
 */

import type { CaseStudyContent } from "@/components/case-studies/CaseStudyLayout";

export const caseStudyAgentpet: CaseStudyContent = {
  meta: {
    eyebrow: "Case study 006",
    headline: ["A pixel pet in the notch", "that runs an agent train."],
    lead: "Notch Agent Train is a macOS app we built for ourselves (internally we call it AgentPet; it is unrelated to the open-source project of the same name). A small pet lives in the MacBook notch; open it and you see an \"agent train\" at work. Claude is the locomotive: it splits a job into slices and hands each one to another coding CLI we are already logged into — Codex, Cursor, Antigravity, Kimi, opencode or a second Claude — through a single delegate command. Progress streams back live. We use it to ship our own engineering, which is why it is on this site.",
    measured: "Updated 28 October 2026. Figures counted on that date from the repository: git history, plus Swift source, tests and the delegate pool code in the working copy, including work not yet committed. This case study is refreshed weekly through November.",
  },
  stats: [
    { value: "63", label: "Commits between 26 and 27 October 2026" },
    { value: "16,205", label: "Lines of Swift across 88 source files" },
    { value: "6", label: "Coding CLIs the locomotive can hand work to" },
    { value: "8", label: "Task kinds, each with its own ordered route" },
  ],
  chapters: [
    {
      num: "01",
      title: "The problem: one agent, many subscriptions, no overview",
      body: [
        "Most engineering work with an AI assistant is serial. One agent holds the whole job, reads, edits and tests in turn, and the rest of the tools you pay for sit idle. They are not interchangeable: some are better at reading a lot of code, some at a quick targeted edit, some at a hard multi-step change, and each has its own limits and cooldowns.",
        "The second problem is visibility. Hand work to a background agent and you are left guessing — is it running, stuck, rate-limited, finished? We wanted the answer glanceable without opening another window, and we wanted the routing to be a decision the system makes, not one we remember to make.",
        "For an eCommerce growth agency this is not a side project. Shipping storefronts, tracking and automation quickly depends on an engineering workflow that is orchestrated rather than improvised. Building the tooling ourselves is how we know what that workflow actually costs and where it breaks.",
      ],
    },
    {
      num: "02",
      title: "What we built",
      body: [
        "Two pieces. The first is delegate, a Python command that runs one task on one coding CLI in headless mode, reads that CLI's JSON event stream, and writes progress into a small record per task on disk. Progress goes to stderr, the final answer to stdout, and a non-zero exit code means failure, so it composes with any script.",
        "The second is the app: a Swift menu-bar program that reads those records and draws them in the notch. Collapsed, a pixel pet sits to the left of the notch — asleep, typing, jumping when work finishes, startled when something fails, grey when it loses contact — with a spinner and the running-task count on the right. Hover to expand the list of tasks and the step each is on; click one to open its log as a terminal-style view.",
        "Around the train sit a home tab and a system tab: now-playing music with transport controls, a calendar strip, a floating front-camera window, RAM and disk gauges, and Claude quota for the 5-hour session and the week. They are there because the notch is real estate you look at all day; once the pet had earned the space, the rest of a glanceable dashboard followed.",
      ],
    },
    {
      num: "03",
      title: "How the train works",
      body: [
        "Claude is the locomotive. Before launching anything it maps the request, groups the changes into slices by file ownership — two slices never edit the same file — decides which slices can run in parallel now and which must wait, and keeps design decisions and security-sensitive edits for itself. Each slice gets a written brief: goal, where to read and write, constraints, the command that must pass, and what to report.",
        "Routing is by task kind and then by model. Each of the eight kinds is an ordered list of wagon-and-model slots, cheapest capable first. A rename is not a hard problem and should not start on the most expensive model. The routes live in a config file, so changing the order is an edit, not a code change.",
        "Failure is handled by the pool, not by us. A wagon that is out of quota or logged out before it did any work is put to rest and the job moves to the next slot; the default rest is 60 minutes, or the time the CLI itself reports. A model that is only overloaded rests for about ten minutes. The one exception is the chore kind, which never escalates: it waits rather than run on a premium model.",
        "Every wagon can also fan out internally. Each task can run in team mode, where the wagon spawns its own explorer, implementer, tester and reviewer sub-agents; small jobs run solo to save requests.",
      ],
    },
    {
      num: "04",
      title: "Routing by kind, isolation by worktree, review before anything ships",
      body: [
        "The eight kinds and what they are for: simple (one-line fixes, renames), chore (repetitive per-item work, never escalates), edit (a focused change in a few files, the default), tests (writing and fixing tests), ui (views, layout, styling), research (read and report, no edits), review (check a diff another wagon wrote) and hard (multi-file features and tricky bugs). The rule in the skill is to pick the lowest kind that fits.",
        "Two agents in one checkout overwrite each other, and delegate refuses a second running job in the same directory. So every editing job gets its own git worktree and branch. If the main checkout has uncommitted work, it is snapshotted into a base branch without touching the main index, and the worktree starts from that snapshot. Finished slices are merged back as patches; because slices never share files, the patches apply cleanly.",
        "Review is not optional. Every slice that edits code is reviewed, and risky ones by a different wagon from the one that wrote them, using the review kind with the diff as the brief. Underneath that, the rule is that a wagon's work is never reported as done on its word: the locomotive reads the diff, runs the done-when command itself, and for interface work looks at a rendered snapshot before saying anything changed.",
        "Rules we enforce on every wagon through the brief: no new dependencies unless asked, never read or print credentials, no commits unless requested, and no AI attribution lines in commit messages. Repetitive work goes through delegate each, which runs one item at a time on the cheap route, or to a plain script when sed is enough.",
      ],
    },
    {
      num: "05",
      title: "Designing for a notch",
      body: [
        "The notch is a hard constraint and a gift. It is a fixed shape in the one place your eyes already rest, so the collapsed state has almost no room: a pet on one side, a count on the other, a vertical music bar while audio plays, a small yellow dot when something needs attention. Everything else appears on hover.",
        "The pet is the status indicator. State is read from posture rather than from text — typing means work is running, a jump means done, alarm means error, grey means disconnected — which is quicker to read from the corner of the eye than a number. Each agent CLI also has its own pixel animal in the Work tab, so you can tell which wagon is doing what without reading a label.",
        "The interface follows tokens in a single design-system file: an 8-point grid, system type, no emoji. Because a menu-bar app is hard to eyeball in CI, the binary has a snapshot flag that renders the app's states to PNG files, and a status flag that prints exactly what the notch is showing. Both are used to check interface work before it is called done.",
      ],
    },
    {
      num: "06",
      title: "Results, and what we will not claim",
      body: [
        "What we can verify: the project has 63 commits over two days, 26 and 27 October 2026, and 16,205 lines of Swift in 88 source files in the working copy. It supports six coding CLIs as wagons, eight task kinds, and a four-role team of explorer, implementer, tester and reviewer. The Swift tests carry 329 test annotations across 33 files, and the delegate pool has 60 Python test functions.",
        "What we will not claim: any time saved, any cost saved, any number of jobs delegated. We have not measured them in a way we would put in front of a client, and a number we cannot defend would undercut the point of the page. The point is narrower: an orchestrated, multi-agent engineering workflow is something we run, inspect and fix ourselves, not something we describe from the outside.",
        "It is also young. The repository is days old, it is built for one person's machine and set of subscriptions, and it depends on third-party CLIs that change their login flows and models without notice — one wagon was already replaced in the first two days when its CLI was retired.",
      ],
    },
    {
      num: "07",
      title: "What's next",
      body: [
        "This page will be updated weekly through November 2026. The first things to add are real, measured numbers: how many delegated slices needed a second pass after review, and how routing choices change as cooldowns hit.",
        "On the tool itself, we want better visibility into why the pool chose a slot, and to see how far the train scales before the notch list needs a different view. The app already switches to a larger office view when many tasks run at once; how well that holds up is something we will report on once we have used it for longer.",
      ],
    },
  ],
  stack: [
    { label: "App", value: "Swift menu-bar app for macOS 14+, 16,205 lines across 88 source files" },
    { label: "Pool", value: "Python command-line tool (delegate) running each wagon's CLI headless and reading its JSON event stream" },
    { label: "Wagons", value: "Codex, Cursor, Antigravity, Kimi, opencode and Claude, each logged in with our own accounts" },
    { label: "Routing", value: "8 task kinds, ordered wagon-and-model slots per kind, edited in a config file" },
    { label: "Isolation", value: "One git worktree and branch per editing job; one running job per directory" },
    { label: "Testing", value: "329 Swift test annotations, 60 Python pool tests, snapshot-to-PNG rendering for UI states" },
    { label: "Updated", value: "28 October 2026" },
  ],
  cta: {
    headline: ["Want an engineering team that builds", "its own tools before selling you its process?"],
    body: "We scope work in writing before it starts, including what we can measure and what we would not promise. If you want a store built and grown by a team that runs this kind of workflow, we would like to talk.",
    cta: "Book a call",
  },
};
