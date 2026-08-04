export const BOOKING_API_URL =
  process.env.NEXT_PUBLIC_BOOKING_API_URL ?? "/api/booking.php";

export type BookingSubmission = {
  name: string;
  email: string;
  company?: string;
  /** ISO date string, e.g. "2026-08-14". */
  preferred_date: string;
  preferred_window: string;
  timezone: string;
  topic: string;
  notes?: string;
  /** Honeypot — must stay empty. */
  website?: string;
};

export async function submitBookingRequest(
  payload: BookingSubmission,
): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  let res: Response;
  try {
    res = await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }

  let data: { ok?: boolean; error?: string; id?: number } = {};
  try {
    data = await res.json();
  } catch {
    return { ok: false, error: "Unexpected server response." };
  }

  if (!res.ok || !data.ok) {
    return { ok: false, error: data.error ?? "Could not send your request." };
  }

  return { ok: true, id: data.id ?? 0 };
}
