export const NEWSLETTER_API_URL =
  process.env.NEXT_PUBLIC_NEWSLETTER_API_URL ?? "/api/newsletter.php";

export type NewsletterSubmission = {
  email: string;
  /** Where the signup came from, e.g. "footer". Stored for attribution. */
  source?: string;
  /** Honeypot — must stay empty. Bots that fill it are silently accepted. */
  website?: string;
};

export async function subscribeToNewsletter(
  payload: NewsletterSubmission,
): Promise<{ ok: true } | { ok: false; error: string }> {
  let res: Response;
  try {
    res = await fetch(NEWSLETTER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }

  let data: { ok?: boolean; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: "Unexpected server response." };
  }

  if (!res.ok || !data.ok) {
    return { ok: false, error: data.error ?? "Subscription failed." };
  }

  return { ok: true };
}
