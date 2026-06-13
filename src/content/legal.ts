export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  eyebrow: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
};

const CONTACT_EMAIL = "hello@hoahwa.com";
const COMPANY = "Hoahwa Agency Limited";
const ADDRESS = "DHT6, Tan Hung Thuan, Ho Chi Minh City, Vietnam";

export const privacyPolicy: LegalDoc = {
  slug: "privacy",
  title: "Privacy policy",
  eyebrow: "Legal",
  updatedAt: "12 June 2026",
  intro:
    "This policy explains what personal data Hoahwa collects when you visit our website or work with us, why we collect it, and the rights you have over it. It is written to meet the EU General Data Protection Regulation (GDPR), the California Consumer Privacy Act as amended by the CPRA, and Vietnam's personal data protection rules (Decree 13/2023/ND-CP and successor legislation).",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        `${COMPANY} ("Hoahwa", "we") is a web design, development, and growth agency based at ${ADDRESS}. For the purposes of GDPR we are the data controller for personal data collected through this website. You can reach us about anything in this policy at ${CONTACT_EMAIL}.`,
      ],
    },
    {
      heading: "What we collect and why",
      paragraphs: [
        "We collect only what we need to respond to you and to run this site:",
      ],
      bullets: [
        "Contact and project enquiries — name, phone number, email address, the services and budget range you select, and anything you write in the message field. We use this to reply to your enquiry and prepare a proposal (legal basis: steps prior to a contract, GDPR Art. 6(1)(b), and our legitimate interest in responding to business enquiries).",
        "Newsletter — your email address, used only to send the updates you signed up for (legal basis: consent, which you can withdraw in any email or by writing to us).",
        "Cookie preferences — a record of the consent choices you make in our cookie banner, stored on your device (legal basis: legal obligation to demonstrate consent).",
        "Analytics and marketing data — page views, approximate location, and device information, collected only if you opt in to the Analytics or Marketing cookie categories. See the Cookie policy for the exact tools and lifetimes.",
      ],
    },
    {
      heading: "What we do not do",
      bullets: [
        "We do not sell personal data, and we do not share it for cross-context behavioural advertising unless you have opted in to Marketing cookies.",
        "We do not run analytics, advertising pixels, or other non-essential trackers before you consent.",
        "We do not knowingly collect data from children under 16; this site is aimed at businesses.",
      ],
    },
    {
      heading: "Who we share data with",
      paragraphs: [
        "We use a small number of service providers to operate the site, and they only process data on our instructions:",
      ],
      bullets: [
        "Website hosting and content delivery for serving this site.",
        "A form-processing service that delivers your contact enquiry to our inbox.",
        "Analytics and advertising platforms (such as Google Analytics, Meta, or LinkedIn) — only when you have opted in to the matching cookie category.",
        "Professional advisers or authorities where the law requires it.",
      ],
    },
    {
      heading: "International transfers",
      paragraphs: [
        "We are based in Vietnam and our team works from Vietnam, so data you send us is processed there. Some of our service providers (hosting, analytics) operate globally, including in the United States and the EU. Where data of EU/EEA visitors is transferred outside the EEA, we rely on providers that offer recognised safeguards such as the EU Standard Contractual Clauses or an adequacy decision. Transfers of Vietnamese personal data abroad are handled in line with Vietnam's cross-border transfer requirements.",
      ],
    },
    {
      heading: "How long we keep data",
      bullets: [
        "Contact enquiries — up to 24 months after our last exchange, or longer if we enter into a contract.",
        "Newsletter emails — until you unsubscribe.",
        "Cookie consent records — 12 months, after which we ask again.",
        "Analytics data — per the retention configured with the provider, at most 24 months.",
      ],
    },
    {
      heading: "Your rights (GDPR — EU/EEA and UK visitors)",
      paragraphs: [
        "You can ask us at any time to:",
      ],
      bullets: [
        "Access the personal data we hold about you, and receive a copy.",
        "Correct inaccurate data or complete incomplete data.",
        "Delete your data (\"right to be forgotten\").",
        "Restrict or object to processing, including any direct marketing.",
        "Receive your data in a portable format.",
        "Withdraw consent at any time, without affecting processing that happened before withdrawal — for cookies, use the cookie icon in the bottom-left corner of any page.",
        "Complain to your local supervisory authority if you believe we have mishandled your data.",
      ],
    },
    {
      heading: "Your rights (California — CCPA/CPRA)",
      paragraphs: [
        "If you are a California resident, you have the right to know what personal information we collect, to access and correct it, to request deletion, and to opt out of the sale or sharing of personal information. We do not sell personal information. To opt out of sharing for cross-context behavioural advertising, switch on \"Do Not Sell or Share My Personal Information\" in our cookie preferences, or email us. We honour opt-out preference signals such as Global Privacy Control. We will never discriminate against you for exercising these rights.",
      ],
    },
    {
      heading: "Your rights (Vietnam — personal data protection law)",
      paragraphs: [
        "If you are in Vietnam, you have the rights set out in Vietnam's personal data protection rules, including the right to be informed, to give and withdraw consent, to access and correct your data, to request deletion, to restrict or object to processing, to complain and claim damages, and to request data provision. Requests can be sent to the contact below and we will respond within the statutory time limit.",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "The site is served over HTTPS, form submissions are encrypted in transit, and access to enquiry data is limited to the team members who need it. No method of transmission or storage is 100% secure, but we take proportionate measures to protect your data and will notify you and the relevant authority of any breach where the law requires it.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "When we change this policy we will update the date at the top, and for significant changes we will flag it on the site. Earlier versions are available on request.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [
        `${COMPANY}, ${ADDRESS}. Email: ${CONTACT_EMAIL}. We aim to answer all privacy requests within 30 days (or sooner where local law requires).`,
      ],
    },
  ],
};

export const cookiePolicy: LegalDoc = {
  slug: "cookie-policy",
  title: "Cookie policy",
  eyebrow: "Legal",
  updatedAt: "12 June 2026",
  intro:
    "Cookies and similar technologies (such as localStorage) are small pieces of data stored on your device. This page lists every category we use, what is in it, and how to change your mind at any time.",
  sections: [
    {
      heading: "How consent works on this site",
      bullets: [
        "Non-essential cookies are off by default. Nothing in the Functional, Analytics, or Marketing categories loads until you opt in.",
        "\"Accept all\" and \"Reject non-essential\" are equally available — declining everything takes exactly one click.",
        "Your choice is stored for 12 months in a first-party record on your device, after which we ask again.",
        "You can change or withdraw consent at any time via the cookie icon in the bottom-left corner of every page. Withdrawing is as easy as giving consent.",
      ],
    },
    {
      heading: "Categories we use",
      paragraphs: [
        "The full, current list of cookies — with provider, purpose, and lifetime for each — is shown per category in the cookie preference panel and summarised below.",
      ],
    },
    {
      heading: "Managing cookies in your browser",
      paragraphs: [
        "Beyond our preference panel, every major browser lets you block or delete cookies in its settings. Blocking strictly necessary storage may stop parts of the site from working (for example, we would not remember your consent choice). Your browser or extensions may also send a Global Privacy Control signal, which we treat as an opt-out of sale or sharing.",
      ],
    },
    {
      heading: "Questions",
      paragraphs: [
        `Anything unclear? Email ${CONTACT_EMAIL} — see also our Privacy policy for how we handle personal data generally.`,
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  slug: "terms",
  title: "Terms of use",
  eyebrow: "Legal",
  updatedAt: "12 June 2026",
  intro:
    "These terms govern your use of the Hoahwa website. Engagements for design, development, or growth services are governed by the separate proposal and agreement we sign with each client.",
  sections: [
    {
      heading: "Use of this site",
      paragraphs: [
        "You may browse the site and use our contact forms for genuine enquiries. You agree not to misuse the site — including attempting to breach its security, scraping content at scale, or submitting unlawful or misleading material through our forms.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        `All content on this site — text, design, graphics, logos, case studies, and code — belongs to ${COMPANY} or its clients and licensors. You may not reproduce it for commercial purposes without our written permission. Client work shown in case studies remains the property of the respective client.`,
      ],
    },
    {
      heading: "No warranties",
      paragraphs: [
        "The site and its content are provided for general information about our services. We keep it accurate and up to date as best we can, but it is provided \"as is\", without warranties of any kind, and nothing on it constitutes professional advice or a binding offer.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the maximum extent permitted by law, we are not liable for indirect or consequential loss arising from your use of this website. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      heading: "Third-party links",
      paragraphs: [
        "Links to external sites are provided for convenience. We are not responsible for their content or their privacy practices.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of Vietnam, and disputes fall under the jurisdiction of the competent courts of Ho Chi Minh City — without affecting any mandatory consumer protections you enjoy in your country of residence.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [`${COMPANY}, ${ADDRESS}. Email: ${CONTACT_EMAIL}.`],
    },
  ],
};
