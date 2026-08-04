/**
 * About page content.
 *
 * Everything here must be verifiable. Team facts come from `content/team.ts`;
 * studio facts describe how we actually work today. If a claim cannot be
 * checked by a prospect in under a minute, it does not belong on this page.
 */

export const aboutHero = {
  eyebrow: "About",
  headline: ["A three-person studio.", "You'll know all three."] as const,
  lead: "Hoahwa is a boutique web design and development studio. We are small on purpose: the people who scope your project are the people who design it, build it, and answer the phone afterwards.",
};

export const aboutStory = {
  headline: "Why we started",
  body: [
    "Most agencies put a layer between the client and the work. Briefs get relayed through an account manager, decisions wait for a status call, and the person actually writing the code never hears why a page matters. The output gets slower and more expensive, and nobody can say exactly where the money went.",
    "Hoahwa is the alternative arrangement. You talk to the developer and the designer directly. Scope is written down and priced before anything starts. When something is harder than we estimated, that is our problem, not a change order.",
    "We are early — we started this studio recently and we are still building our public body of work. We would rather tell you that plainly than dress the site in borrowed credibility.",
  ],
};

/** Concrete, checkable statements about how an engagement runs. */
export const aboutPrinciples = [
  {
    num: "01",
    title: "Fixed scope before we start",
    body: "You get a written scope and a flat price before any work begins. No hourly drift, no surprise invoices at handover.",
  },
  {
    num: "02",
    title: "Direct access, no account layer",
    body: "Your point of contact is the person doing the work. Questions get answered by someone who can actually change the code.",
  },
  {
    num: "03",
    title: "We publish our own numbers",
    body: "This site's build decisions and performance scores are documented publicly. We hold client work to the same standard we hold our own.",
  },
  {
    num: "04",
    title: "You own everything at the end",
    body: "Code, design files, and accounts are handed over in full. Nothing is locked to us, and you are free to take the work elsewhere.",
  },
];

export const aboutCta = {
  headline: ["Want to talk to the people", "who'd actually build it?"] as const,
  body: "A first call is free and takes about thirty minutes. We'll tell you honestly whether we're the right fit — including when we're not.",
  cta: "Book a call",
};
