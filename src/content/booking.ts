/**
 * Meeting booking page.
 *
 * ── TO GO LIVE ────────────────────────────────────────────────────────────────
 * 1. Open Google Calendar as larisa.trucmt@gmail.com → Create → "Appointment
 *    schedule". Set your duration, working hours and buffer.
 * 2. Under "Booking page", copy the public link. It looks like:
 *      https://calendar.google.com/calendar/appointments/schedules/AcZssZ…
 * 3. Paste it into GOOGLE_APPOINTMENT_URL below. That is the only edit needed —
 *    the page swaps from the request form to the live calendar automatically.
 * 4. Optional: in the schedule's settings add hello@hoahwa.com as a co-host so
 *    Google copies both inboxes on every confirmed booking.
 *
 * Until step 3 is done the page falls back to the request form, which writes to
 * MySQL and emails both addresses — so /book is never a dead end.
 */
export const GOOGLE_APPOINTMENT_URL: string | null = null;

/**
 * Google only renders its booking page inside an iframe when `gv=true` is
 * present. Accepts the URL in either form so a plain paste still works.
 */
export function toEmbeddableAppointmentUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("gv", "true");
    return parsed.toString();
  } catch {
    return url;
  }
}

export const bookingHero = {
  eyebrow: "Book a meeting",
  headline: ["Pick a time that suits you.", "No forms, no back-and-forth."] as const,
  lead: "A first call runs about 30 minutes. We'll ask what you're building, tell you honestly whether we're a fit, and give you a ballpark number before you leave the call.",
};

export const bookingWhatToExpect = [
  {
    num: "01",
    title: "30 minutes, no pitch deck",
    body: "You talk, we listen and ask questions. If you'd rather show us the current site and screen-share the problems, even better.",
  },
  {
    num: "02",
    title: "You meet the person who'd build it",
    body: "No account manager sitting in to take notes. The developer on the call is the one who would own your project.",
  },
  {
    num: "03",
    title: "A ballpark number before you go",
    body: "We'll give you an honest range on the call. A written fixed-price scope follows within two working days if you want to go further.",
  },
  {
    num: "04",
    title: "We'll say if we're wrong for you",
    body: "If your project needs something we don't do well, we'll tell you on the call and point you somewhere better. That costs us a lead and saves you a month.",
  },
];

/** Shown when the visitor has not accepted functional cookies yet. */
export const bookingConsentNotice = {
  title: "The booking calendar needs functional cookies",
  body: "Our scheduling calendar is hosted by Google Calendar, which sets its own cookies. Load it below, or use the request form instead and we'll come back to you by email.",
  loadLabel: "Load booking calendar",
  formLabel: "Use the request form instead",
};

export const bookingFormCopy = {
  eyebrow: "Prefer email?",
  title: "Send a booking request",
  body: "Tell us roughly when suits and we'll come back with a confirmed time. Useful if none of the open slots work, or if you'd rather not use Google Calendar.",
  submit: "Send request",
  submitting: "Sending…",
  success:
    "Request received. We'll reply with a confirmed time within one working day.",
  timeWindows: [
    "Morning (9:00 – 12:00)",
    "Afternoon (13:00 – 17:00)",
    "Evening (18:00 – 21:00)",
    "I'm flexible",
  ],
  topics: [
    "New Shopify build",
    "Migration / replatform",
    "Audit (CX, CRO or technical)",
    "Growth or CRO retainer",
    "AI search (AEO / GEO)",
    "Something else",
  ],
};

export const bookingFaqs = [
  {
    question: "What timezone are you in?",
    answer:
      "We're in Ho Chi Minh City (GMT+7). The calendar shows slots in your own timezone automatically, and we regularly take calls that suit UK and European mornings.",
  },
  {
    question: "Is the first call free?",
    answer:
      "Yes. The first call is free and carries no obligation. We only charge once a scoped piece of work is agreed in writing.",
  },
  {
    question: "What should I have ready?",
    answer:
      "Nothing formal. A link to your current site and a rough sense of budget and timing is plenty. If you have analytics access to hand we can look at real numbers on the call.",
  },
  {
    question: "Can we meet in person?",
    answer:
      "If you're in Ho Chi Minh City, yes — mention it in the notes and we'll arrange it. Otherwise calls are on Google Meet, and the link is in your calendar invite.",
  },
];
