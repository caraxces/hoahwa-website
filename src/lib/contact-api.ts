export const CONTACT_API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API_URL ?? "/api/contact.php";

export type ContactSubmission = {
  name: string;
  phone: string;
  email: string;
  company: string;
  objectives: string;
  referral_source: string;
  service: string;
  budget?: string;
};

export async function submitContactForm(
  payload: ContactSubmission,
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const res = await fetch(CONTACT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: { ok?: boolean; error?: string; id?: number } = {};
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: "Unexpected server response." };
  }

  if (!res.ok || !data.ok) {
    return { ok: false, error: data.error ?? "Submission failed." };
  }

  return { ok: true, id: data.id ?? 0 };
}
