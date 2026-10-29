/**
 * Case study 003: HoaHwa BloomBound.
 *
 * A self-initiated 3D landing page that happens to be a playable game. Like
 * Vietfolk ’26 it has no client, so every figure here is measured — from the
 * Vite production build output in `public/apps/bloombound`, the GLB files in
 * that directory, and a full Playwright run against the built sub-path.
 *
 * Last measured: 2026-09-08 (production build + all three Playwright suites on
 * Chrome/macOS with Metal acceleration). Re-measure when the game changes.
 */

import type { CaseStudyContent } from "@/components/case-studies/CaseStudyLayout";

export const caseStudyBloombound: CaseStudyContent = {
  meta: {
    eyebrow: "Case study 003",
    headline: ["A 3D landing page", "you can actually play."],
    lead: "Most “3D websites” are a hero section with a model spinning in it. BloomBound is the opposite bet: a real single-player game — grapple-flight, combat, three chapters, a save log — running in the browser at a URL, with no install, no plugin and no external asset service. It exists to answer one question in a sales call: yes, we can build that, and here is the thing running.",
    measured: "Figures measured 8 September 2026 from the production build output and a full Playwright run on Chrome/macOS.",
  },
  stats: [
    { value: "96", label: "Automated browser checks passing, zero console errors" },
    { value: "143 KB", label: "Gzipped Three.js core — the heaviest chunk on the page" },
    { value: "9", label: "CC0 3D models, all served from our own build" },
    { value: "0", label: "Plugins, installs, or third-party asset services" },
  ],
  chapters: [
    {
      num: "01",
      title: "Why a game, and not another hero animation",
      body: [
        "A scroll-driven hero proves you can time an animation. It does not prove you can hold 60 frames a second while a skinned character, a rigged enemy, instanced foliage and a physics-ish grapple all run at once. A game does, because a game breaks loudly the moment the frame budget slips — and because a visitor stays on it long enough to notice.",
        "The commercial point is narrower than “we do WebGL”. Every technique in here maps onto something a merchant actually asks for: a configurator that loads a compressed model in under a second, a product scene that stays interactive on a mid-range phone, a landing page whose motion is driven by state rather than hand-written scroll math. BloomBound is the stress test for all of those at once.",
      ],
    },
    {
      num: "02",
      title: "Four districts out of nine models",
      body: [
        "The world reads as much bigger than it is. Seven GLBs from the Kenney Nature Kit — three flowers, an oak, a mushroom cluster, a water lily and a stone bridge — are instanced with InstancedMesh across four named districts: Blossom Avenue, the Temple of the One Eye, the Ancient Rose Forest and the HoaHwa Garden. Instancing is the whole trick: hundreds of visible plants cost a handful of draw calls.",
        "Everything that is not a plant is built in code — the houses, the round-columned temple, the flower arches, the lake and fountain, the windmill, the butterflies, the drifting petals, the launch pads and the billboards. That keeps the asset budget at nine files while the scene still has somewhere to go.",
        "The two characters are the only heavy downloads. The player is the CC0 KayKit Rogue, 3.6 MB with embedded textures, 6 skinned meshes and 76 animation clips, of which the game blends 5. Unused equipment is hidden at load rather than shipped as a separate model.",
      ],
    },
    {
      num: "03",
      title: "Building a Cyclops that was never a Cyclops",
      body: [
        "There is no good CC0 one-eyed giant with a walk cycle. What exists is Eldritch Grim's Giant Mutant — a two-eyed body with a 22-bone rig and no animation we could use. So the body was voxel-remeshed into a single continuous surface, smoothed, and decimated to 9,002 vertices and 18,000 triangles, with skin weights transferred onto the new mesh. The shipped file is 552 KB.",
        "The eye, mouth, floral crown and linen accessories are added in Three.js at load time, not baked into the asset, which is why none of the original textures or clips are redistributed. Every movement — breathing, looking, blinking, walking, running, roaring, the attack wind-up, the stomp, the swipe, the stagger and the collapse — is authored in code against those 22 bones.",
        "That last part is the reusable lesson. Buying a rigged model and animating it yourself is dramatically cheaper than commissioning animation, and it keeps the licence clean. The remesh pipeline is committed alongside the game so the asset can be rebuilt rather than trusted.",
      ],
    },
    {
      num: "04",
      title: "Mounting a Vite game inside a Next.js static export",
      body: [
        "The site is a Next.js app exported to static files. The game is a Vite app. Rather than port the game to React or wrap it in an iframe, Vite builds with `base: '/apps/bloombound/'` straight into the Next.js `public/` tree, so `next build` copies it into the export verbatim and the game ships through the site's existing rsync deploy with no second pipeline.",
        "Two things had to be right for that to work. Every runtime asset path — the three GLB loaders — has to resolve through `import.meta.env.BASE_URL` instead of a leading slash, or the models 404 one directory up. And the link in the site header has to be a plain anchor rather than `next/link`: a client-side navigation to a path the static export's router has never heard of resolves to a 404 instead of loading the game.",
        "The payoff is that the game is a first-class page of the site — crawlable, linkable, deployed by the same command as everything else — rather than a demo parked on a subdomain.",
      ],
    },
    {
      num: "05",
      title: "What it costs, and where we would not use it",
      body: [
        "The whole build is 6.2 MB, and the honest headline number is the Three.js core: 563 KB raw, 143 KB gzipped, before any game code. The game's own logic is 69 KB raw and 27 KB gzipped, which tells you where the weight in any 3D project really lives — the engine, not your code.",
        "That is a fair price for a destination someone chose to visit. It would be indefensible on a storefront homepage, and we would not ship it there. The useful version of this work on a commercial site is one interactive scene loaded on demand, not a whole engine in the critical path.",
        "The verification is the part we would repeat on any client project: 96 automated browser checks — 47 on gameplay and UI, 40 on the world, models and enemy AI, 9 on mouse and fullscreen input — all run against the real production build at its real URL, with console errors treated as failures. Mobile is covered by 390 px Chrome touch emulation, which is a genuine check of layout and touch controls and is not the same as a physical device.",
      ],
    },
    {
      num: "06",
      title: "Update — October 2026: the Blossom Crown realm",
      body: [
        "BloomBound has a fourth realm. Blossom Crown is a painterly dark-fantasy throne hall — navy and gold banners, coral-pink and violet fractal blossom trees, crows circling a castle under a misty pink-grey sky — art-directed from three concept paintings by our artist team: the throne hall itself, a knight march with a giant red sword, and a magenta holographic HUD. The whole scene renders at roughly 256,000 triangles.",
        "The realm is procedural where it counts. Twenty-five road paths are planned around the castle with a 4 m baked avoidance mask, and that planning step went from about 15 seconds to 151 ms — the entire realm builds in around 0.4 seconds. Twenty-six vehicles (carriages, carts, cavalry) travel those roads through instanced scenery: 48 blossom trees, 140 pines, 167 banners, 334 lamps and 60 crows.",
        "The new gameplay is an escort mission: guard a carriage along the road to the castle while giants smash the traffic underfoot — and hitting a giant's eye counts. A painterly post-processing pass (toon ramps, outlines, bloom) ties the realm back to the concept art. Behind it sits a proper asset pipeline: headless Blender 5.2 scripts to optimize, stylize and preview, plus a Tripo 3D v3 API client for generating props.",
        "The build itself is the other story: the work was split across several AI coding agents, each in its own git worktree — the same setup documented in our Notch Agent Train case study. Blossom Crown was built and tested locally on 29 October 2026 and is now rolling out; the figures in the stats above remain the September measurements of the original three chapters until we re-measure.",
      ],
    },
  ],
  stack: [
    { label: "Engine", value: "Three.js 0.180 on WebGL 2, no game framework" },
    { label: "Build", value: "Vite 7.3.6, manual chunks for engine / addons / icons" },
    { label: "Characters", value: "KayKit Rogue (CC0); Giant Mutant remeshed to 18,000 triangles (CC0)" },
    { label: "World", value: "7 Kenney Nature Kit GLBs (CC0), instanced with InstancedMesh" },
    { label: "Animation", value: "THREE.AnimationMixer; the 22-bone Cyclops rig animated in code" },
    { label: "Weight", value: "6.2 MB build; 143 KB gzipped engine, 27 KB gzipped game logic" },
    { label: "Testing", value: "96 Playwright checks on Chrome/macOS, console errors fail the run" },
    { label: "Hosting", value: "Static sub-app of hoahwa.com, deployed by rsync merge over SSH" },
  ],
  gallery: [
    {
      src: "/img/bloombound/launcher.webp",
      alt: "The BloomBound launcher: a dark sidebar, the 3D valley behind the hero copy, and three selectable chapters below.",
      width: 1440,
      height: 1080,
      caption: "The launcher. The 3D world is already live behind the hero copy — there is no loading screen between the page and the game.",
    },
    {
      src: "/img/bloombound/cyclops.webp",
      alt: "The player mid-flight at eye level with a one-eyed Cyclops in a floral crown, the on-screen prompt reading 2 m and SLASH.",
      width: 1440,
      height: 1000,
      caption: "The Cyclops: a remeshed CC0 body, one eye and a floral crown added at load time, every movement authored against its 22 bones.",
    },
    {
      src: "/img/bloombound/hoahwa-billboard.webp",
      alt: "A billboard inside the 3D garden reading HoaHwa, Flowers for every moment, hoahwa.com — legible from player height.",
      width: 1440,
      height: 1000,
      caption: "Billboards render legible text inside the scene — the same technique a product configurator needs for labels and callouts.",
    },
  ],
  demo: {
    href: "/apps/bloombound/",
    label: "Play BloomBound",
    note: "Needs WebGL 2. Keyboard and mouse on desktop is the intended way to play; touch controls work, and there is a no-damage training chapter if you would rather just fly.",
  },
  cta: {
    headline: ["Want a page that holds", "a frame budget this tight?"],
    body: "We scope 3D and interactive work in writing before it starts, including the weight it adds and the places we would advise against it — measured the same way as everything on this page.",
    cta: "Book a call",
  },
};
