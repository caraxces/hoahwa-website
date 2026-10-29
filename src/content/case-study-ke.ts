/**
 * Case study 005: Kể — a local-first audio story studio.
 *
 * A self-initiated desktop app, so like BloomBound and Vietfolk ’26 every figure
 * here is measured rather than quoted: test counts from `npm test` across the
 * three workspaces plus the Playwright run, installer sizes from the signed-off
 * 0.2.2 build artefacts, and speech figures from the phase-0 spike on an M4.
 *
 * Last measured: 2026-09-10 (159 unit/integration tests, 3 Playwright e2e,
 * Windows + macOS 0.2.2 installers). Re-measure when the app ships a new build.
 */

import type { CaseStudyContent } from "@/components/case-studies/CaseStudyLayout";

export const caseStudyKe: CaseStudyContent = {
  meta: {
    eyebrow: "Case study 005",
    headline: ["An AI story studio", "that runs on your own machine."],
    lead: "Kể turns a reference video or a rough idea into a finished Vietnamese audio episode — transcript, script, narration, subtitles, and the YouTube metadata to publish it. The unusual part is where it runs: entirely on the user's laptop. No account, no server, no upload. You bring your own ChatGPT for the writing; the app measures whether what comes back is actually new, and speaks it in a cloned voice without a single byte leaving the machine.",
    measured: "Figures measured 10 September 2026 from the 0.2.2 build: the full test suite across three workspaces, the Playwright end-to-end run, and the shipped Windows and macOS installers.",
  },
  stats: [
    { value: "162", label: "Automated tests passing — 159 unit and integration, 3 end-to-end" },
    { value: "0", label: "Servers, accounts, or bytes of user text leaving the machine" },
    { value: "6", label: "Pipeline stages, each one resumable and inspectable on disk" },
    { value: "2,984", label: "Lines of TypeScript and Python doing the whole job" },
  ],
  chapters: [
    {
      num: "01",
      title: "The problem is not writing, it is proving the writing is new",
      body: [
        "Vietnamese storytelling channels on YouTube are largely a copy economy. Someone finds a video that performs, feeds the transcript to an AI, asks for a rewrite, and publishes a narration of a narration. It works until it does not — the platform demotes it, the original creator complains, and the channel has no defence because nobody ever measured how close the output was to its source.",
        "So originality is not a feature of Kể, it is the product. The app takes the reference transcript, the finished script, and measures the distance between them twice: 8-word shingle overlap must stay at or under 3%, and a multilingual-e5-small embedding pass flags any paragraph scoring above 0.92 cosine against a source paragraph. More than 10% of paragraphs flagged and the episode fails the gate. The AI does not get to grade its own homework — it reports scores, and the engine independently measures the text.",
        "The calibration behind that 0.92 is the part that took the longest. A close paraphrase measured 0.948; two passages on the same topic but genuinely different content measured 0.875 to 0.906. The threshold sits in the gap. We also learned to ignore source paragraphs under 60 characters, because a one-line note on the same subject cannot meaningfully be the thing you plagiarised.",
      ],
    },
    {
      num: "02",
      title: "Bring your own AI, because the alternative is a bill",
      body: [
        "The obvious architecture is an API key in the app and a per-episode cost. We deliberately did not build that. Instead the app produces a prompt pack — the sources, the requirements, the house style, the review criteria, and the exact output format — which the user pastes into whichever ChatGPT or Claude subscription they already pay for. The result gets pasted back, and a parser pulls the script, the self-scored rubric, and the YouTube title, hashtags and summary out of the fenced blocks.",
        "For people running Claude Desktop there is a second route: the app runs a local MCP server on 127.0.0.1 with 15 tools, so the assistant reads the source material and writes the script straight into the project without any copy-paste. The stdio shim runs on the Electron binary itself, so the user never installs Node.",
        "Both routes converge on the same review function. Whether a human pasted the script or an assistant wrote it through a tool call, it faces the same originality measurement and the same values rubric before anything is narrated.",
      ],
    },
    {
      num: "03",
      title: "Voices that never leave the laptop",
      body: [
        "Narration runs on VieNeu-TTS through a Python sidecar the app installs on first launch with uv — roughly a gigabyte, downloaded once. Two Vietnamese voices ship inside the installer, and users can clone their own from a short audio sample: pick a file, choose a few seconds, and the reference WAV stays in the user's application data folder forever.",
        "The honest number is speed. On an M4 the model synthesises at 1.2 to 1.7 times realtime, not the 7x the upstream README suggests, which means a 30-minute episode takes 18 to 25 minutes to render. We measured it, wrote it into the spec, and built rendering as a background job with progress rather than pretending it was instant. Quality was verified by transcribing the output back with Whisper: 186 of 187 words matched, the single miss being a homophone.",
        "Everything else in the pipeline is equally local. ffmpeg is bundled for the audio assembly and subtitle burn-in, the embedding model runs on onnxruntime on the CPU, and the finished episode lands in a plain folder as MP3, WAV, SRT and a description file. There is nothing to log into and nothing to cancel.",
      ],
    },
    {
      num: "04",
      title: "The bug that only existed on the user's machine",
      body: [
        "The first Windows build went out cross-compiled from a Mac and never run on real hardware. The report that came back was precise and, at first, baffling: the transcript step added a source, but the content was wrong, and the transcript itself was not visible anywhere in the app.",
        "Reproducing it took eliminating a plausible theory first. The app passes yt-dlp a runtime path as `deno:C:\\…\\deno.exe`, and a Windows drive letter puts a second colon in that argument — an obvious suspect. It was wrong: yt-dlp splits on the first colon and parses drive paths correctly. What was actually true is subtler and worse. The work directory was never cleaned between runs, and success was judged by which files existed afterwards. Pull video A, then pull video B on a bad network, and you get B's title and URL attached to A's transcript — the exact failure the app's source-crediting promise exists to prevent.",
        "Two more defects sat next to it. A playlist link made yt-dlp overwrite the video's metadata with the playlist's, stripping the author and date. And `--no-warnings` was swallowing the real reason for every failure, so rate limiting and bot checks all surfaced to the user as the same misleading message: this video has no subtitles. The fix cleans the directory before each run, accepts only single-video links and canonicalises them, keeps the warnings and translates them into plain Vietnamese, distinguishes a video with no captions from a caption download that failed, and puts a 180-second timeout on a step that could previously hang forever.",
        "The reusable lesson is about test coverage shape, not about yt-dlp. All four existing tests injected a fake process runner, so the real subprocess path — the only part that could break on a different operating system — had never once been executed by the suite. It is covered now, on both the engine and the app's IPC layer.",
      ],
    },
    {
      num: "05",
      title: "What it costs, and what we would not claim",
      body: [
        "Local-first is not free. The Windows installer is 286 MB and the macOS disk image is 337 MB, because a bundled Chromium, ffmpeg, yt-dlp and a JavaScript runtime all ride along; the speech model adds about a gigabyte on first launch. A server-side version would download in seconds. It would also cost money per episode, require an account, and put the user's scripts on somebody else's disk — which is the trade we chose against.",
        "Neither installer is code-signed yet, so Windows SmartScreen and macOS Gatekeeper both interrupt the first launch, and the download page explains exactly how to get past that rather than pretending it does not happen. The macOS build is Apple Silicon only. Speech recognition for videos without captions is not built; the app tells the user to paste text instead of guessing.",
        "What we would carry into client work is the discipline rather than the domain: measure the claim you are making instead of asserting it, make the failure message name the real cause, and treat any code path your tests mock out as code that does not work on platforms you have not run it on.",
      ],
    },
  ],
  stack: [
    { label: "Shell", value: "Electron 44 with a sandboxed renderer, React 19, typed IPC over 35 channels" },
    { label: "Engine", value: "TypeScript workspace, no framework — 2,984 lines across engine, MCP and app" },
    { label: "Speech", value: "VieNeu-TTS in a Python sidecar installed on first run with uv; voice cloning from a sample" },
    { label: "Originality", value: "8-word shingles at 3%, multilingual-e5-small on onnxruntime at 0.92 cosine" },
    { label: "Ingest", value: "yt-dlp 2026.08.19 with a bundled deno 2.9.6 for YouTube's JS challenges" },
    { label: "AI routes", value: "Prompt pack for ChatGPT; local MCP server with 15 tools for Claude Desktop" },
    { label: "Testing", value: "162 automated tests; the real subprocess and binary paths covered, not mocked" },
    { label: "Delivery", value: "NSIS installer cross-built from macOS; macOS dmg assembled from stock Electron.app" },
  ],
  demo: {
    href: "/apps/ke/",
    label: "Download Kể",
    note: "Free, for Windows 10/11 and Apple Silicon Macs. Nothing you write or record is uploaded anywhere — the app has no server to upload to.",
  },
  cta: {
    headline: ["Want software that proves", "its claims instead of stating them?"],
    body: "We scope product work in writing before it starts, including the numbers we will measure and the parts we would advise against building — the same way every figure on this page was produced.",
    cta: "Book a call",
  },
};
